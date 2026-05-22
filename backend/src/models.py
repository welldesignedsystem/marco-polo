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
        description="Number of search results to return.",
    )
    search_provider: str = Field(
        default="tavily",
        description="Search provider: duckduckgo or tavily.",
    )

    @field_validator("website")
    @classmethod
    def normalize_website(cls, website: str) -> str:
        if website.startswith(("http://", "https://")):
            return website
        return f"https://{website}"


class BusinessProfile(BaseModel):
    company_name: str = Field(
        default="Unknown company",
        description="The company name inferred from the website.",
    )
    business_domain: str = Field(
        default="Unknown industry",
        description="The primary business domain or industry.",
    )
    industry_terms: list[str] = Field(
        default_factory=list,
        description="Specific search terms that describe this company's industry."
    )
    customer_segments: list[str] = Field(
        default_factory=list,
        description="Customer types, market segments, or buyer personas served."
    )
    geographic_focus: list[str] = Field(
        default_factory=list,
        description="Relevant countries, regions, or local markets."
    )
    evidence: list[str] = Field(
        default_factory=list,
        description="Short facts from the website supporting the classification."
    )

    @field_validator(
        "industry_terms",
        "customer_segments",
        "geographic_focus",
        "evidence",
        mode="before",
    )
    @classmethod
    def normalize_string_list(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [value]
        return value


class Competitor(BaseModel):
    name: str = Field(default="Unknown competitor", description="Competitor company name.")
    website: str | None = Field(default=None, description="Competitor website if known.")
    reason: str = Field(default="", description="Why this company is a likely competitor.")


class CompetitorList(BaseModel):
    competitors: list[Competitor] = Field(
        default_factory=list,
        description="Top competitors in the same industry or customer segment."
    )


class SearchKeyword(BaseModel):
    keyword: str = Field(default="", description="A search keyword or query relevant to the business.")
    search_volume_estimate: str = Field(
        default="unknown",
        description="Estimated search volume: high, medium, or low."
    )
    intent: str = Field(
        default="informational",
        description="Search intent: informational, navigational, commercial, or transactional."
    )
    reason: str = Field(default="", description="Why this keyword is relevant to the business.")


class KeywordList(BaseModel):
    keywords: list[SearchKeyword] = Field(
        default_factory=list,
        description="Top search keywords and queries for SEO and content strategy."
    )


class Registration(BaseModel):
    name: str
    email: str
    website: str | None = None


class ReportRequest(BaseModel):
    email: str
    website: str
    description: str = Field(default="", description="Optional context about the website or report needs.")
