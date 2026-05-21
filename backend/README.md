# marco-polo — Backend

FastAPI service that scrapes a company website, extracts a business profile via LLM, and either finds competitors or generates SEO keywords.

## Setup

```bash
cd backend
uv venv
source .venv/bin/activate
uv sync
```

## Environment

Copy `.example.env` to `.env` and fill in your API key:

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
OPENROUTER_SITE_URL="https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_APP_NAME="marco-polo"
```

The code defaults to `openai/gpt-4.1-mini` if `OPENROUTER_MODEL` is unset.

## Run

```bash
uv run marco-polo-api          # Dev server (uvicorn with reload) at :8000
uv run python src/competitors.py   # CLI: find competitors
uv run python src/keywords.py      # CLI: generate SEO keywords
```

## API

| Method | Path | Body |
|--------|------|------|
| POST | `/competitors` | `{"website": "…", "search_focus": "…", "max_results": 10}` |
| POST | `/keywords` | same shape |

Both endpoints return `{"profile": {...}, "result": [...]}`.

## Structure

```
src/
├── api.py            # FastAPI app entrypoint
├── competitors.py    # CompetitorFinder (scrape → profile → search → extract)
├── keywords.py       # KeywordFinder (scrape → profile → extract)
├── model_utils.py    # ModelFactory — creates ChatOpenAI for OpenRouter
└── models.py         # Pydantic models (WebsiteInput, BusinessProfile, etc.)
```
