from typing import Any

from pydantic import BaseModel, Field, field_validator


def coerce_model(response: Any, model_type: type[BaseModel]) -> Any:
    if isinstance(response, model_type):
        return response
    return model_type.model_validate(response)


class WebsiteInput(BaseModel):
    website: str
    search_focus: str = Field(
        default="",
        description="Extra user-provided context to narrow the search.",
    )
    max_results: int = Field(
        default=10,
        ge=1,
        le=50,
        description="Number of DuckDuckGo search results to return.",
    )

    @field_validator("website")
    @classmethod
    def normalize_website(cls, website: str) -> str:
        if website.startswith(("http://", "https://")):
            return website
        return f"https://{website}"


class BusinessProfile(BaseModel):
    company_name: str = Field(description="The company name inferred from the website.")
    business_domain: str = Field(description="The primary business domain or industry.")
    industry_terms: list[str] = Field(
        description="Specific search terms that describe this company's industry."
    )
    customer_segments: list[str] = Field(
        description="Customer types, market segments, or buyer personas served."
    )
    geographic_focus: list[str] = Field(
        description="Relevant countries, regions, or local markets."
    )
    evidence: list[str] = Field(
        description="Short facts from the website supporting the classification."
    )


class Competitor(BaseModel):
    name: str = Field(description="Competitor company name.")
    website: str | None = Field(default=None, description="Competitor website if known.")
    reason: str = Field(description="Why this company is a likely competitor.")


class CompetitorList(BaseModel):
    competitors: list[Competitor] = Field(
        description="Top competitors in the same industry or customer segment."
    )


class SearchKeyword(BaseModel):
    keyword: str = Field(description="A search keyword or query relevant to the business.")
    search_volume_estimate: str = Field(
        description="Estimated search volume: high, medium, or low."
    )
    intent: str = Field(
        description="Search intent: informational, navigational, commercial, or transactional."
    )
    reason: str = Field(description="Why this keyword is relevant to the business.")


class KeywordList(BaseModel):
    keywords: list[SearchKeyword] = Field(
        description="Top search keywords and queries for SEO and content strategy."
    )
