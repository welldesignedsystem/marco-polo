# aeo-app.io — monorepo

## Backend (`backend/`)

Python 3.14, managed with `uv`.

```bash
cd backend
uv run python src/competitors.py       # CLI: scrape → profile → find competitors
uv run python src/keywords.py          # CLI: scrape → profile → generate SEO keywords
uv run marco-polo-api                  # FastAPI dev server (uvicorn reload) on :8000
```

### API

| POST endpoint | Body | Notes |
|---|---|---|
| `/competitors` | `{website, search_focus, max_results, search_provider?}` | Real analysis |
| `/keywords` | same | Real analysis |
| `/register` | `{name, email, website?}` | Placeholder, returns `{status:"ok"}` |
| `/report` | `{email, website, description?}` | Placeholder |

Entrypoint: `src.api:run` in `pyproject.toml` under `[project.scripts]`.

### Env

Required in `backend/.env` (loaded via `python-dotenv` at import time in `api.py`, `competitors.py`, `keywords.py`). **`opencode.json` blocks agent from reading `.env`** — the code loads it itself at runtime.

```
OPENROUTER_API_KEY=sk-or-v1-...
TAVILY_API_KEY=tvly-...
```

| Var | Default | Notes |
|---|---|---|
| `OPENROUTER_MODEL` | `openai/gpt-4.1-mini` | Override model |
| `LLM_PROVIDER` | auto-detect if `OPENROUTER_API_KEY` set | `openrouter` or `bedrock` |
| `SEARCH_PROVIDER` | `duckduckgo` | `tavily` or `duckduckgo` |
| `USER_AGENT` | `marco-polo/0.1` | Set at module import in `competitors.py`/`keywords.py` |
| `BEDROCK_MODEL` | `us.anthropic.claude-haiku-4-5-20251001-v1:0` | Used when `LLM_PROVIDER=bedrock` |

`WebsiteInput.search_provider` model field defaults to `"tavily"` but the searcher factory (`create_searcher()`) falls back to env var `SEARCH_PROVIDER` then `"duckduckgo"`.

### Architecture

- `src/models.py` — Pydantic models + `coerce_model`. Imports use absolute `from src.models import ...`.
- `src/model_utils.py` — `ModelFactory.create_chat_llm()` (supports OpenRouter + Bedrock via `LLM_PROVIDER`); `structured_call()` for LLM JSON extraction with auto-wrapping for bare-list responses.
- `src/searcher.py` — `SearchStrategy` ABC with `DuckDuckGoStrategy` (requests `max_results * 2` internally) and `TavilyStrategy`. Factory `create_searcher()` selects by `SEARCH_PROVIDER` env or explicit arg.
- `src/competitors.py` — `CompetitorFinder`: scrape (WebBaseLoader) → profile → search (via strategy) → LLM competitor extraction. Accepts `search_provider` to override searcher.
- `src/keywords.py` — `KeywordFinder`: scrape → profile → LLM keyword generation.
- `src/api.py` — FastAPI app wrapping both finders, CORS for `localhost:3000`.
- `src/logging_config.py` — Rotating file handler (`logs/marco-polo.log`, 5 MB) + stderr.
- Website text truncated to 12000 chars before LLM calls.
- `USER_AGENT` set at module level (import side effect) in `competitors.py`, `keywords.py`, `searcher.py`.

No tests, no CI, no lint/typecheck config.

## Frontend (`frontend/`)

Next.js 14 with TypeScript, Tailwind CSS, and App Router.

```bash
cd frontend
npm run dev       # Dev server on :3000
npm run build     # Production build
npm run typecheck # tsc --noEmit
```

### Architecture

- **API proxy**: `next.config.mjs` rewrites `/api/*` → `localhost:8000/*`. Start backend first.
- **Auth**: localStorage-based. `lib/auth.ts` saves/loads `{name, email}` from `marco-polo-user` key. `isRegistered()` guards `/dashboard`.
- **Routes**: `/` (landing + registration + live analysis), `/dashboard` (tabbed: Report, Competitors, Keywords).
- **Env**: `NEXT_PUBLIC_API_BASE_URL` overrides API base (default empty → uses proxy).

### Quirks

- `next.config.mjs` uses JSDoc `@type` instead of TS (`.mjs` cannot use TS syntax).
- `postcss.config.js` uses CommonJS (`module.exports`).
- Tailwind custom component classes defined in `globals.css` via `@layer components`: `card`, `card-hover`, `input-field`, `btn-primary`, `btn-secondary`, `badge-*`, `skeleton`.
- `tailwind.config.ts` extends with `shimmer` animation keyframes.

## Dev server

`./dev.sh` frees ports 3000/8000, starts backend, waits for readiness (polls `/openapi.json`), then starts frontend. Sets `USER_AGENT=marco-polo-dev/0.1` and `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`.
