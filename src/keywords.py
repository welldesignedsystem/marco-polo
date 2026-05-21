import json

from langchain_community.document_loaders import WebBaseLoader
from dotenv import load_dotenv

from src.model_utils import ModelFactory
from src.models import (
    BusinessProfile,
    KeywordList,
    WebsiteInput,
    coerce_model,
)


load_dotenv()


class KeywordFinder:
    def __init__(self) -> None:
        self.llm = ModelFactory.create_chat_llm()

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

    def extract_keywords(
        self, website_input: WebsiteInput, profile: BusinessProfile
    ) -> KeywordList:
        structured_llm = self.llm.with_structured_output(KeywordList)
        response = structured_llm.invoke(
            [
                (
                    "system",
                    "You generate high-value search keywords and queries for SEO "
                    "and content strategy based on a business profile. Include a "
                    "mix of informational, commercial, and transactional intent "
                    "keywords. Prioritize terms the business would want to rank "
                    "for in search engines.",
                ),
                (
                    "human",
                    "Input website:\n"
                    f"{website_input.model_dump_json(indent=2)}\n\n"
                    "Business profile:\n"
                    f"{profile.model_dump_json(indent=2)}",
                ),
            ]
        )
        return coerce_model(response, KeywordList)

    def print_keywords(self, keywords: KeywordList) -> None:
        keyword_array = [keyword.model_dump() for keyword in keywords.keywords]
        print(json.dumps(keyword_array, indent=2))

    def run(self) -> None:
        website_input = self.get_input()
        website_text = self.scrape_website(website_input.website)
        profile = self.extract_business_profile(website_input, website_text)
        keywords = self.extract_keywords(website_input, profile)
        self.print_keywords(keywords)


def main() -> None:
    KeywordFinder().run()


if __name__ == "__main__":
    main()
