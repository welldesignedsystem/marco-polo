import uvicorn

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.logging_config import get_logger
from src.competitors import CompetitorFinder
from src.keywords import KeywordFinder
from src.models import WebsiteInput, Registration, ReportRequest

load_dotenv()

logger = get_logger(__name__)

app = FastAPI(title="marco-polo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://aeo-app.io.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisRequest(WebsiteInput):
    pass


class AnalysisResponse(BaseModel):
    profile: dict
    result: list[dict]


def external_service_error(exc: Exception) -> HTTPException:
    # Log the original exception with stack trace for troubleshooting
    logger.exception("External service error: %s", exc)
    message = str(exc)
    if len(message) > 500:
        message = f"{message[:500]}..."
    return HTTPException(
        status_code=502,
        detail=(
            "Analysis failed while contacting an external service. "
            f"{type(exc).__name__}: {message}"
        ),
    )


@app.post("/competitors")
def analyze_competitors(body: AnalysisRequest) -> AnalysisResponse:
    try:
        finder = CompetitorFinder(search_provider=body.search_provider)
        website_text = finder.scrape_website(body.website)
        profile = finder.extract_business_profile(body, website_text)
        query = finder.build_search_query(body, profile)
        search_results = finder.search_competitors(query, body.max_results)
        competitors = finder.extract_competitors(body, profile, search_results)
        return AnalysisResponse(
            profile=profile.model_dump(),
            result=[c.model_dump(exclude_none=True) for c in competitors.competitors],
        )
    except Exception as exc:
        # external_service_error logs the exception
        raise external_service_error(exc) from exc


@app.post("/keywords")
def analyze_keywords(body: AnalysisRequest) -> AnalysisResponse:
    try:
        finder = KeywordFinder()
        website_text = finder.scrape_website(body.website)
        profile = finder.extract_business_profile(body, website_text)
        keywords = finder.extract_keywords(body, profile)
        return AnalysisResponse(
            profile=profile.model_dump(),
            result=[k.model_dump() for k in keywords.keywords],
        )
    except Exception as exc:
        # external_service_error logs the exception
        raise external_service_error(exc) from exc


@app.post("/register")
def register(body: Registration) -> dict:
    return {"status": "ok", "email": body.email}


@app.post("/report")
def request_report(body: ReportRequest) -> dict:
    return {
        "status": "ok",
        "message": "Report request received. A detailed SEO/GEO/AEO analysis will be sent to your email once ready.",
    }


def run() -> None:
    uvicorn.run("src.api:app", reload=True)
