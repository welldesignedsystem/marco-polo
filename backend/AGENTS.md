# marco-polo — Backend

Python 3.14 project managed with `uv`.

## Commands

```bash
cd backend
uv run python src/competitors.py       # CLI: scrape site → profile → find competitors
uv run python src/keywords.py          # CLI: scrape site → profile → generate SEO keywords
uv run marco-polo-api                  # FastAPI dev server (uvicorn with reload) at :8000
```

## API

- `POST /competitors` — body `{"website", "search_focus", "max_results"}`
- `POST /keywords` — same shape
- `POST /register` — body `{"name", "email", "website?"}` — placeholder, returns `{"status": "ok"}`
- `POST /report` — body `{"email", "website", "description?"}` — placeholder. Later will invoke Claude skill and email a detailed SEO/GEO/AEO report.
- Entrypoint `src.api:run` registered in `pyproject.toml` under `[project.scripts]`.

## Env

Required in `backend/.env` (loaded via `python-dotenv`; `opencode.json` blocks agent from reading `.env`):

```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
OPENROUTER_SITE_URL="https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_APP_NAME="marco-polo"
TAVILY_API_KEY=tvly-...
```

Code defaults to `openai/gpt-4.1-mini` if `OPENROUTER_MODEL` is unset.

Set `SEARCH_PROVIDER=tavily` to use Tavily instead of DuckDuckGo. The API also accepts `search_provider` per-request.

## Architecture

- `src/models.py` — Pydantic models + `coerce_model`. Imports use absolute `from src.models import ...`.
- `src/model_utils.py` — `ModelFactory` creates a `ChatOpenAI` instance for OpenRouter.
- `src/searcher.py` — `SearchStrategy` ABC with `DuckDuckGoStrategy` and `TavilyStrategy`. Factory `create_searcher()` selects by `SEARCH_PROVIDER` env var or explicit argument.
- `src/competitors.py` — `CompetitorFinder`: scrape → profile → search (via strategy) → LLM extraction. Accepts `search_provider` to override the searcher.
- `src/keywords.py` — `KeywordFinder`: scrape → profile → LLM keyword generation.
- `src/api.py` — FastAPI wrapping both finders.
- Website text truncated to 12000 chars before LLM calls.
- DuckDuckGo internally requests `max_results * 2` results for downstream filtering.

## Quirks

- `load_dotenv()` is called at module import time in `competitors.py`, `keywords.py`, and `api.py`.
- No tests, no CI, no lint/typecheck config.
