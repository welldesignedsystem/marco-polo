import json
import os
import re

os.environ.setdefault("USER_AGENT", "marco-polo/0.1")

from langchain_community.document_loaders import WebBaseLoader
from dotenv import load_dotenv

from src.model_utils import ModelFactory, structured_call
from src.logging_config import get_logger
from src.models import (
    BusinessProfile,
    CompetitorList,
    WebsiteInput,
)
from src.searcher import create_searcher


load_dotenv()


class CompetitorFinder:
    def __init__(self, search_provider: str | None = None) -> None:
        self.llm = ModelFactory.create_chat_llm()
        self._searcher = create_searcher(search_provider)

        self.logger = get_logger(__name__)

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
        return structured_call(
            self.llm,
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

    def build_search_query(
        self, website_input: WebsiteInput, profile: BusinessProfile
    ) -> str:
        terms = " ".join(profile.industry_terms[:3])
        segments = " ".join(profile.customer_segments[:1])
        locations = " ".join(profile.geographic_focus[:1])
        query = (
            f'top competitors "{profile.business_domain}" {terms} '
            f"{segments} {locations} {website_input.search_focus}"
        )
        return re.sub(r"\s+", " ", query).strip()[:240]

    def search_competitors(self, query: str, max_results: int = 10) -> list[dict[str, str]]:
        return self._searcher.search(query, max_results=max_results)

    def extract_competitors(
        self,
        website_input: WebsiteInput,
        profile: BusinessProfile,
        search_results: list[dict[str, str]],
    ) -> CompetitorList:
        return structured_call(
            self.llm,
            CompetitorList,
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
                    f"{self._searcher.label} search results:\n"
                    f"{json.dumps(search_results, indent=2)}",
                ),
            ],
        )

    def print_competitors(self, competitors: CompetitorList) -> None:
        competitor_array = [
            competitor.model_dump(exclude_none=True)
            for competitor in competitors.competitors
        ]
        print(json.dumps(competitor_array, indent=2))

    def run(self) -> None:
        try:
            website_input = self.get_input()
            website_text = self.scrape_website(website_input.website)
            profile = self.extract_business_profile(website_input, website_text)
            query = self.build_search_query(website_input, profile)
            self.logger.info("Search query: %s", query)
            search_results = self.search_competitors(query, website_input.max_results)
            competitors = self.extract_competitors(website_input, profile, search_results)
            self.print_competitors(competitors)
        except Exception as e:
            # Log full stack trace for diagnosing failures during run
            self.logger.exception("Unhandled error in CompetitorFinder.run: %s", e)
            raise


def main() -> None:
    CompetitorFinder().run()


if __name__ == "__main__":
    main()
