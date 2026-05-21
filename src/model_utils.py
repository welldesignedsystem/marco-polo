import os
from langchain_openai import ChatOpenAI


class ModelFactory:
    @staticmethod
    def create_chat_llm(model_name: str | None = None, api_key: str | None = None) -> ChatOpenAI:
        """Create a configured ChatOpenAI instance using environment defaults.

        model_name and api_key may be provided to override environment variables.
        """
        model = model_name or os.getenv("OPENROUTER_MODEL", "openai/gpt-4.1-mini")
        key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not key:
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
