from __future__ import annotations

import logging
import os
from abc import ABC, abstractmethod

os.environ.setdefault("USER_AGENT", "marco-polo/0.1")

from langchain_community.utilities.duckduckgo_search import DuckDuckGoSearchAPIWrapper

logger = logging.getLogger(__name__)


class SearchResult(dict[str, str]):
    """Normalized search result with title, url, and content."""

    def __init__(self, title: str, url: str, content: str) -> None:
        super().__init__(title=title, url=url, content=content)


class SearchStrategy(ABC):
    label: str = "Search"

    @abstractmethod
    def search(self, query: str, max_results: int = 10) -> list[dict[str, str]]: ...


class DuckDuckGoStrategy(SearchStrategy):
    label = "DuckDuckGo"

    def __init__(self) -> None:
        self._client = DuckDuckGoSearchAPIWrapper()

    def search(self, query: str, max_results: int = 10) -> list[dict[str, str]]:
        raw = self._client.results(query, max_results=max_results * 2)
        results = [
            SearchResult(
                title=r.get("title", ""),
                url=r.get("href", ""),
                content=r.get("body", ""),
            )
            for r in raw
        ]
        logger.info("DuckDuckGo search for %r returned %d results", query, len(results))
        for r in results[:3]:
            logger.info("  %s — %s", r["title"], r["url"])
        return results


class TavilyStrategy(SearchStrategy):
    label = "Tavily"

    def __init__(self) -> None:
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            raise ValueError("TAVILY_API_KEY environment variable is required.")
        from tavily import TavilyClient

        self._client = TavilyClient(api_key=api_key)

    def search(self, query: str, max_results: int = 10) -> list[dict[str, str]]:
        logger.info("Performing Tavily search for query: %s result count: %d", query, max_results)
        response = self._client.search(
            query=query, 
            max_results=max_results,
            search_depth="advanced",
            )
        results = response.get("results", []) if isinstance(response, dict) else response.results
        results_out = [
            SearchResult(
                title=r.get("title", ""),
                url=r.get("url", ""),
                content=r.get("content", ""),
            )
            for r in results
        ]
        logger.info("Tavily search for %r returned %d results", query, len(results_out))
        for r in results_out[:3]:
            logger.info("  %s — %s", r["title"], r["url"])
        return results_out


def create_searcher(provider: str | None = None) -> SearchStrategy:
    logger.info("Creating search strategy for provider: %s", provider)
    provider = provider or os.getenv("SEARCH_PROVIDER", "duckduckgo")
    if provider == "tavily":
        return TavilyStrategy()
    return DuckDuckGoStrategy()
