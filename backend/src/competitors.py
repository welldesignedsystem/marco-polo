import json

from langchain_community.document_loaders import WebBaseLoader
from langchain_community.utilities.duckduckgo_search import DuckDuckGoSearchAPIWrapper
from dotenv import load_dotenv

from src.model_utils import ModelFactory
from src.models import (
    BusinessProfile,
    CompetitorList,
    WebsiteInput,
    coerce_model,
)


load_dotenv()


class CompetitorFinder:
    def __init__(self) -> None:
        self.llm = ModelFactory.create_chat_llm()
        self.search = DuckDuckGoSearchAPIWrapper()

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
        return coerce_model(response, BusinessProfile)

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

    def search_competitors(self, query: str, max_results: int = 10) -> list[dict[str, str]]:
        return self.search.results(query, max_results=max_results * 2)

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
        return coerce_model(response, CompetitorList)

    def print_competitors(self, competitors: CompetitorList) -> None:
        competitor_array = [
            competitor.model_dump(exclude_none=True)
            for competitor in competitors.competitors
        ]
        print(json.dumps(competitor_array, indent=2))

    def run(self) -> None:
        website_input = self.get_input()
        website_text = self.scrape_website(website_input.website)
        profile = self.extract_business_profile(website_input, website_text)
        query = self.build_search_query(website_input, profile)
        print(f"Search query: {query}")
        search_results = self.search_competitors(query, website_input.max_results)
        competitors = self.extract_competitors(website_input, profile, search_results)
        self.print_competitors(competitors)


def main() -> None:
    CompetitorFinder().run()


if __name__ == "__main__":
    main()
