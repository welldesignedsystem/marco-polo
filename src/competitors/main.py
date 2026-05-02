import json
import os
from typing import Any

from langchain_community.document_loaders import WebBaseLoader
from langchain_community.utilities.duckduckgo_search import DuckDuckGoSearchAPIWrapper
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator


load_dotenv()


class WebsiteInput(BaseModel):
    website: str
    search_focus: str = Field(
        description="Extra user-provided context to narrow the competitor search."
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


class CompetitorFinder:
    def __init__(self) -> None:
        model_name = os.getenv("OPENROUTER_MODEL", "openai/gpt-4.1-mini")
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required.")

        self.llm = ChatOpenAI(
            model=model_name,
            temperature=0,
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
            default_headers={
                "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", ""),
                "X-Title": os.getenv("OPENROUTER_APP_NAME", "marco-polo"),
            },
        )
        self.search = DuckDuckGoSearchAPIWrapper(max_results=10)

    def get_input(self) -> WebsiteInput:
        return WebsiteInput(
            website=input("Website: "),
            search_focus=input("Search focus: "),
        )

    def scrape_website(self, website: str) -> str:
        loader = WebBaseLoader(website)
        documents = loader.load()
        page_text = "\n\n".join(document.page_content for document in documents)
        return page_text[:12000]

    def extract_business_profile(
        self, website_input: WebsiteInput, website_text: str
    ) -> BusinessProfile:
        structured_llm = self.llm.with_structured_output(BusinessProfile)
        response = structured_llm.invoke(
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
            ]
        )
        return self._coerce_model(response, BusinessProfile)

    def build_search_query(
        self, website_input: WebsiteInput, profile: BusinessProfile
    ) -> str:
        terms = " ".join(profile.industry_terms[:4])
        segments = " ".join(profile.customer_segments[:2])
        locations = " ".join(profile.geographic_focus[:2])
        return (
            f'top competitors "{profile.business_domain}" {terms} '
            f"{segments} {locations} {website_input.search_focus} "
            f"-{profile.company_name}"
        ).strip()

    def search_competitors(self, query: str) -> list[dict[str, str]]:
        return self.search.results(query, max_results=10)

    def extract_competitors(
        self,
        website_input: WebsiteInput,
        profile: BusinessProfile,
        search_results: list[dict[str, str]],
    ) -> CompetitorList:
        structured_llm = self.llm.with_structured_output(CompetitorList)
        response = structured_llm.invoke(
            [
                (
                    "system",
                    "You identify likely business competitors from search results. "
                    "Return direct competitors or close alternatives serving the "
                    "same customer segment. Exclude the input company.",
                ),
                (
                    "human",
                    "Input website:\n"
                    f"{website_input.model_dump_json(indent=2)}\n\n"
                    "Business profile:\n"
                    f"{profile.model_dump_json(indent=2)}\n\n"
                    "DuckDuckGo search results:\n"
                    f"{json.dumps(search_results, indent=2)}",
                ),
            ]
        )
        return self._coerce_model(response, CompetitorList)

    def print_competitors(self, competitors: CompetitorList) -> None:
        competitor_array = [
            competitor.model_dump(exclude_none=True)
            for competitor in competitors.competitors
        ]
        print(json.dumps(competitor_array, indent=2))

    def _coerce_model(self, response: Any, model_type: type[BaseModel]) -> Any:
        if isinstance(response, model_type):
            return response

        return model_type.model_validate(response)

    def run(self) -> None:
        website_input = self.get_input()
        website_text = self.scrape_website(website_input.website)
        profile = self.extract_business_profile(website_input, website_text)
        query = self.build_search_query(website_input, profile)
        search_results = self.search_competitors(query)
        competitors = self.extract_competitors(website_input, profile, search_results)
        self.print_competitors(competitors)


def main() -> None:
    CompetitorFinder().run()


if __name__ == "__main__":
    main()
