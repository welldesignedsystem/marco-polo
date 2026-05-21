import uvicorn

from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

from src.competitors import CompetitorFinder
from src.keywords import KeywordFinder
from src.models import WebsiteInput

load_dotenv()

app = FastAPI(title="marco-polo")


class AnalysisRequest(WebsiteInput):
    pass


class AnalysisResponse(BaseModel):
    profile: dict
    result: list[dict]


@app.post("/competitors")
def analyze_competitors(body: AnalysisRequest) -> AnalysisResponse:
    finder = CompetitorFinder()
    website_text = finder.scrape_website(body.website)
    profile = finder.extract_business_profile(body, website_text)
    query = finder.build_search_query(body, profile)
    search_results = finder.search_competitors(query, body.max_results)
    competitors = finder.extract_competitors(body, profile, search_results)
    return AnalysisResponse(
        profile=profile.model_dump(),
        result=[c.model_dump(exclude_none=True) for c in competitors.competitors],
    )


@app.post("/keywords")
def analyze_keywords(body: AnalysisRequest) -> AnalysisResponse:
    finder = KeywordFinder()
    website_text = finder.scrape_website(body.website)
    profile = finder.extract_business_profile(body, website_text)
    keywords = finder.extract_keywords(body, profile)
    return AnalysisResponse(
        profile=profile.model_dump(),
        result=[k.model_dump() for k in keywords.keywords],
    )


def run() -> None:
    uvicorn.run("src.api:app", reload=True)
