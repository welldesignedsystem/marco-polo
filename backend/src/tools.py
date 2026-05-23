from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from pydantic import BaseModel, Field

from src.logging_config import get_logger
from src.model_utils import ModelFactory, structured_call
from src.models import BusinessProfile, WebsiteInput
from src.searcher import create_searcher

load_dotenv()

logger = get_logger(__name__)

# ── Compliance analysis output models ──────────────────────────────


class ScoredCriterion(BaseModel):
    name: str = Field(description="Criterion name from SKILLS.md")
    score: int = Field(ge=0, le=5, description="Score 0-5")
    finding: str = Field(description="Evidence or finding for this criterion")
    recommendation: str = Field(description="What to improve")


class DimensionReport(BaseModel):
    score: float = Field(ge=0, le=100, description="Dimension score 0-100")
    summary: str = Field(description="One-paragraph assessment")
    criteria: list[ScoredCriterion] = Field(
        description="Individual criterion scores"
    )
    strengths: list[str] = Field(description="What the site does well")
    weaknesses: list[str] = Field(description="Key gaps and issues")
    recommendations: list[str] = Field(
        description="Actionable improvement recommendations"
    )


# ── Utility functions ──────────────────────────────────────────────


def scrape_website(url: str, max_chars: int = 12000) -> str:
    """Scrape a website and return its text content, truncated."""
    loader = WebBaseLoader(url)
    documents = loader.load()
    page_text = "\n\n".join(d.page_content for d in documents)
    return page_text[:max_chars]


def extract_business_profile(
    llm: Any,
    website_input: WebsiteInput,
    website_text: str,
) -> BusinessProfile:
    """Extract a BusinessProfile from scraped website text via LLM."""
    return structured_call(
        llm,
        BusinessProfile,
        [
            (
                "system",
                "You analyze company websites and extract concise market "
                "positioning facts. Infer the company name from the website "
                "text or URL. Use the user's search focus to emphasize the "
                "most relevant industry terms and customer segments. If "
                "something is unclear, infer cautiously.",
            ),
            (
                "human",
                f"Website: {website_input.website}\n\n"
                f"Search focus: {website_input.search_focus}\n\n"
                f"Website text:\n{website_text}",
            ),
        ],
    )


def search_web(
    query: str,
    max_results: int = 10,
    provider: str | None = None,
) -> list[dict[str, str]]:
    """Search the web via the configured search provider."""
    searcher = create_searcher(provider)
    return searcher.search(query, max_results=max_results)


def read_file(path: str) -> str:
    """Read a text file from disk."""
    return Path(path).read_text(encoding="utf-8")


def create_llm() -> Any:
    """Create a ChatOpenAI instance using the configured provider."""
    return ModelFactory.create_chat_llm()


# ── Compliance analysis functions ──────────────────────────────────


def analyze_seo_compliance(
    llm: Any,
    website_text: str,
    profile: BusinessProfile,
    skills_content: str,
    search_results: list[dict[str, str]],
    website_url: str,
) -> DimensionReport:
    """Analyze website against SEO criteria from SKILLS.md."""
    return structured_call(
        llm,
        DimensionReport,
        [
            (
                "system",
                "You are an expert SEO auditor. Score the target website against "
                "the following SEO compliance criteria. Use the website text, "
                "business profile, and web search results as evidence.\n\n"
                f"SEO Criteria from SKILLS.md:\n{skills_content}\n\n"
                "Score each criterion 0-5 using the rubric in SKILLS.md. "
                "Compute the overall score as (sum of criterion scores / "
                "number of criteria / 5) × 100. Provide specific evidence "
                "from the website text for each score.",
            ),
            (
                "human",
                "Website URL:\n"
                f"{website_url}\n\n"
                "Business profile:\n"
                f"{profile.model_dump_json(indent=2)}\n\n"
                "Website text:\n"
                f"{website_text}\n\n"
                "Web search results (industry best practices, competitor context):\n"
                f"{json.dumps(search_results, indent=2)}",
            ),
        ],
    )


def analyze_geo_compliance(
    llm: Any,
    website_text: str,
    profile: BusinessProfile,
    skills_content: str,
    search_results: list[dict[str, str]],
    website_url: str,
) -> DimensionReport:
    """Analyze website against GEO criteria from SKILLS.md."""
    return structured_call(
        llm,
        DimensionReport,
        [
            (
                "system",
                "You are an expert in Generative Engine Optimization (GEO). "
                "Score the target website against the following GEO compliance "
                "criteria. Use the website text, business profile, and web "
                "search results as evidence.\n\n"
                f"GEO Criteria from SKILLS.md:\n{skills_content}\n\n"
                "Score each criterion 0-5 using the rubric in SKILLS.md. "
                "Compute the overall score as (sum of criterion scores / "
                "number of criteria / 5) × 100. Focus on how well the site "
                "is optimized for LLM-based search engines (ChatGPT Search, "
                "Perplexity, Google AI Overviews).",
            ),
            (
                "human",
                "Website URL:\n"
                f"{website_url}\n\n"
                "Business profile:\n"
                f"{profile.model_dump_json(indent=2)}\n\n"
                "Website text:\n"
                f"{website_text}\n\n"
                "Web search results (GEO best practices, industry context):\n"
                f"{json.dumps(search_results, indent=2)}",
            ),
        ],
    )


def analyze_aeo_compliance(
    llm: Any,
    website_text: str,
    profile: BusinessProfile,
    skills_content: str,
    search_results: list[dict[str, str]],
    website_url: str,
) -> DimensionReport:
    """Analyze website against AEO criteria from SKILLS.md."""
    return structured_call(
        llm,
        DimensionReport,
        [
            (
                "system",
                "You are an expert in Answer Engine Optimization (AEO). "
                "Score the target website against the following AEO compliance "
                "criteria. Use the website text, business profile, and web "
                "search results as evidence.\n\n"
                f"AEO Criteria from SKILLS.md:\n{skills_content}\n\n"
                "Score each criterion 0-5 using the rubric in SKILLS.md. "
                "Compute the overall score as (sum of criterion scores / "
                "number of criteria / 5) × 100. Focus on how well the site "
                "is optimized for featured snippets, voice search, and "
                "conversational AI assistants.",
            ),
            (
                "human",
                "Website URL:\n"
                f"{website_url}\n\n"
                "Business profile:\n"
                f"{profile.model_dump_json(indent=2)}\n\n"
                "Website text:\n"
                f"{website_text}\n\n"
                "Web search results (AEO best practices, industry context):\n"
                f"{json.dumps(search_results, indent=2)}",
            ),
        ],
    )
