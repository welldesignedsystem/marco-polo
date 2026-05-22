import json
import os
import re
from typing import TypeVar

from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from src.logging_config import get_logger

T = TypeVar("T", bound=BaseModel)

logger = get_logger(__name__)


def structured_call(
    llm: ChatOpenAI,
    model_type: type[T],
    messages: list[tuple[str, str]],
) -> T:
    enhanced = []
    for role, content in messages:
        if role == "system":
            content += (
                "\n\nYou MUST respond with valid JSON only. "
                "Do NOT wrap the JSON in markdown code blocks. "
                "Do NOT include any text before or after the JSON object. "
                "Use this JSON schema:\n"
                f"{json.dumps(model_type.model_json_schema(), indent=2)}"
            )
        enhanced.append((role, content))

    response = llm.invoke(enhanced)
    text = response.content.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        data = _extract_json(text)
        if data is None:
            logger.error("Failed to parse JSON from LLM response. Raw response: %s", text[:2000])
            raise ValueError(
                "Failed to parse JSON from LLM response.\n"
                f"Raw response:\n{text[:2000]}"
            )
    # If the LLM returned a bare list but the expected model is an object
    # with a single list field (e.g., CompetitorList -> {competitors: [...]})
    # try to auto-wrap the list to make validation easier and log the action.
    if isinstance(data, list):
        try:
            fields = getattr(model_type, "model_fields", {}) or {}
            # If the model has exactly one field, assume the list belongs there
            if len(fields) == 1:
                list_field = next(iter(fields))
                logger.warning(
                    "LLM returned top-level list for %s; auto-wrapping into %s",
                    model_type.__name__,
                    list_field,
                )
                data = {list_field: data}
            else:
                # Try to find any field that looks like a list by inspecting schema
                schema = model_type.model_json_schema()
                list_field = None
                for fname, fdef in schema.get("properties", {}).items():
                    if fdef.get("type") == "array":
                        list_field = fname
                        break
                if list_field:
                    logger.warning(
                        "LLM returned top-level list for %s; wrapping into %s based on schema",
                        model_type.__name__,
                        list_field,
                    )
                    data = {list_field: data}
        except Exception:
            logger.exception("Failed while attempting to auto-wrap LLM list response")
    return model_type.model_validate(data)


def _extract_json(text: str) -> dict | list | None:
    for pattern in (r"\{.*\}", r"\[.*\]"):
        match = re.search(pattern, text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                continue
    return None


class ModelFactory:
    @staticmethod
    def create_chat_llm(model_name: str | None = None, api_key: str | None = None) -> ChatOpenAI:
        """Create a configured ChatOpenAI instance using environment defaults.

        model_name and api_key may be provided to override environment variables.
        """
        model = model_name or os.getenv("OPENROUTER_MODEL", "openai/gpt-4.1-mini")
        key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not key:
            logger.error("OPENROUTER_API_KEY environment variable is not set")
            raise ValueError("OPENROUTER_API_KEY environment variable is required.")

        return ChatOpenAI(
            model=model,
            temperature=0,
            api_key=key,
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", ""),
                "X-Title": os.getenv("OPENROUTER_APP_NAME", "marco-polo"),
            },
        )
