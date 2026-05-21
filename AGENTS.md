# marco-polo — monorepo

## Backend (`backend/`)

Python 3.14 project managed with `uv`.

```bash
cd backend
uv run python src/competitors.py       # CLI: scrape site → profile → find competitors
uv run python src/keywords.py          # CLI: scrape site → profile → generate SEO keywords
uv run marco-polo-api                  # FastAPI dev server (uvicorn with reload at :8000)
```

### API

- `POST /competitors` — JSON body `{"website": "…", "search_focus": "…", "max_results": 10}`
- `POST /keywords` — same body shape
- Entrypoint: `src.api:run` registered in `pyproject.toml` under `[project.scripts]`.

### Env

Set `OPENROUTER_API_KEY` in `backend/.env` (loaded via `python-dotenv`). The `.example.env` shows an optional alternate model; the code defaults to `openai/gpt-4.1-mini` if `OPENROUTER_MODEL` is unset. `opencode.json` blocks reading `.env` — the agent cannot read it; the code loads it itself at runtime.

### Architecture

- `src/models.py` — all Pydantic models + `coerce_model` utility. Imports use absolute `from src.models import ...`.
- `src/model_utils.py` — `ModelFactory` creates `ChatOpenAI` instance configured for OpenRouter.
- `src/competitors.py` — `CompetitorFinder`: scrape → profile → DuckDuckGo search → LLM extraction.
- `src/keywords.py` — `KeywordFinder`: scrape → profile → LLM keyword generation.
- `src/api.py` — FastAPI app wrapping both finders.
- Website text is truncated to 12000 chars before LLM calls.
- DuckDuckGo search internally requests `max_results * 2` results for downstream filtering.

## Frontend (`frontend/`)

Next.js 14 with TypeScript, Tailwind CSS, and App Router.

```bash
cd frontend
npm run dev       # dev server on :3000, proxies /api/* to backend :8000
npm run build     # production build
npm run typecheck # tsc --noEmit
```

The frontend calls the backend via Next.js rewrites (`/api/* → localhost:8000/*`). Start the backend first, then the frontend.
