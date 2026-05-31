# marco-polo monorepo

Two packages: `backend/` (Python/FastAPI + CLI tools) and `react-app/` (Vite+React 18 landing page). `infra/` is empty.

See `backend/AGENTS.md` for backend agent instructions, especially the report generator workflow.

## Dev server

```bash
./dev.sh          # frees ports, starts backend (:8000), polls /openapi.json, then starts react-app (:5173)
```

Sets `USER_AGENT=marco-polo-dev/0.1`.

## Backend (`backend/`)

Python 3.14, `uv`-managed (not pip). Copy `backend/.example.env` → `backend/.env`.

```bash
cd backend
uv sync                              # install from lockfile
uv run python src/report.py          # CLI: URL → PDF compliance report
uv run python src/competitors.py     # CLI: scrape → profile → competitors
uv run python src/keywords.py        # CLI: scrape → profile → SEO keywords
uv run marco-polo-api                # FastAPI dev server (uvicorn reload) on :8000
```

- `load_dotenv()` called at import time in `api.py`, `competitors.py`, `keywords.py`, `report.py`, `tools.py`.
- `opencode.json` blocks agent from reading `backend/.env` — code loads it at runtime. **Do not edit `backend/.env`; opencode.json won't show its contents.**
- Website text truncated to 12 000 chars before LLM calls.
- `USER_AGENT` set at module import side-effect (in `competitors.py`, `keywords.py`, `searcher.py`).
- `WebsiteInput.search_provider` defaults to `"tavily"`; factory `create_searcher()` falls back to env `SEARCH_PROVIDER`, then `"duckduckgo"`.
- No tests, no CI, no lint/typecheck config.

## react-app (`react-app/`)

Separate Vite + React 18 marketing landing page (not part of the Next.js app).

```bash
cd react-app
npm install
npm run dev    # http://localhost:5173
npm run build  # → dist/
```
