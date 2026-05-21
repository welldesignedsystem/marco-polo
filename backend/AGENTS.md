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
- Entrypoint `src.api:run` registered in `pyproject.toml` under `[project.scripts]`.

## Env

Required in `backend/.env` (loaded via `python-dotenv`; `opencode.json` blocks agent from reading `.env`):

```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
OPENROUTER_SITE_URL="https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_APP_NAME="marco-polo"
```

Code defaults to `openai/gpt-4.1-mini` if `OPENROUTER_MODEL` is unset.

## Architecture

- `src/models.py` — Pydantic models + `coerce_model`. Imports use absolute `from src.models import ...`.
- `src/model_utils.py` — `ModelFactory` creates a `ChatOpenAI` instance for OpenRouter.
- `src/competitors.py` — `CompetitorFinder`: scrape → profile → DuckDuckGo search → LLM extraction.
- `src/keywords.py` — `KeywordFinder`: scrape → profile → LLM keyword generation.
- `src/api.py` — FastAPI wrapping both finders.
- Website text truncated to 12000 chars before LLM calls.
- DuckDuckGo search requests `max_results * 2` results internally for downstream filtering.

## Quirks

- `load_dotenv()` is called at module import time in `competitors.py`, `keywords.py`, and `api.py`.
- No tests, no CI, no lint/typecheck config.
