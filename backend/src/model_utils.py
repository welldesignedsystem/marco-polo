from __future__ import annotations

import json
import os
import re
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, TypeVar

from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from src.logging_config import get_logger

if TYPE_CHECKING:
    from langchain_core.language_models.chat_models import BaseChatModel

T = TypeVar("T", bound=BaseModel)

logger = get_logger(__name__)


# ── Provider interface ──────────────────────────────────────────────

class LLMProvider(ABC):
    """Interface for LLM backends. Each provider knows how to build a
    LangChain chat model for its own service."""

    @abstractmethod
    def create_llm(self, model_name: str | None = None) -> ChatOpenAI:
        ...


class OpenRouterProvider(LLMProvider):
    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY is required for OpenRouterProvider")

    def create_llm(self, model_name: str | None = None) -> ChatOpenAI:
        return ChatOpenAI(
            model=model_name or os.getenv("OPENROUTER_MODEL", "openai/gpt-4.1-mini"),
            temperature=0,
            api_key=self.api_key,
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", ""),
                "X-Title": os.getenv("OPENROUTER_APP_NAME", "marco-polo"),
            },
        )

class BedrockProvider(LLMProvider):
    def __init__(self, region: str | None = None, profile: str | None = None) -> None:
        self.region = region or os.getenv("AWS_REGION", "us-east-1")
        self.profile = profile or os.getenv("AWS_PROFILE")

    def _extract_provider_from_arn(self, arn: str) -> str:
        """
        Handles inference-profile ARNs:
          arn:aws:bedrock:us-east-1::inference-profile/us.anthropic.claude-3-...
        """
        suffix = arn.split("/")[-1]  # "us.anthropic.claude-3-..."
        parts = suffix.split(".")
        return parts[1]              # skip region prefix, grab provider

    def create_llm(self, model_name: str | None = None) -> ChatOpenAI:
        from langchain_aws import ChatBedrockConverse

        model = model_name or os.getenv("BEDROCK_MODEL", "us.anthropic.claude-haiku-4-5-20251001-v1:0")

        kwargs: dict = {
            "model": model,
            "temperature": 0,
            "region_name": self.region,
        }

        if model.startswith("arn:"):
            kwargs["provider"] = self._extract_provider_from_arn(model)

        if self.profile:
            kwargs["credentials_profile_name"] = self.profile

        return ChatBedrockConverse(**kwargs)  # type: ignore[return-value]


def create_provider(provider: str | None = None, **kwargs: str) -> LLMProvider:
    """Factory: return the right LLMProvider based on a name or env vars.

    Order of precedence:
      1. Explicit *provider* argument
      2. ``LLM_PROVIDER`` env var
      3. ``OPENROUTER_API_KEY`` env var  → OpenRouter
      4. Raise ``ValueError`` — set ``LLM_PROVIDER`` in your ``.env``
    """
    resolved = provider or os.getenv("LLM_PROVIDER")
    if resolved:
        if resolved == "openrouter":
            return OpenRouterProvider(**kwargs)
        if resolved == "bedrock":
            return BedrockProvider(**kwargs)
        valid = ("openrouter", "bedrock")
        raise ValueError(f"Unknown LLM_PROVIDER {resolved!r}. Valid options: {valid}")

    if os.getenv("OPENROUTER_API_KEY"):
        return OpenRouterProvider(**kwargs)

    raise ValueError(
        "No LLM provider configured. Set LLM_PROVIDER in .env "
        "(e.g. LLM_PROVIDER=openrouter or LLM_PROVIDER=bedrock)."
    )


# ── Backward-compat convenience ─────────────────────────────────────

class ModelFactory:
    @staticmethod
    def create_chat_llm(model_name: str | None = None, api_key: str | None = None) -> ChatOpenAI:
        if api_key:
            provider: LLMProvider = OpenRouterProvider(api_key=api_key)
        else:
            provider = create_provider()
        return provider.create_llm(model_name=model_name)


# ── Structured output helper ────────────────────────────────────────

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
    logger.info("LLM response for %s: %s", model_type.__name__, str(response)[:5000])
    text = response.content.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()
    logger.info("Cleaned LLM response for %s: %s", model_type.__name__, text[:5000])
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
