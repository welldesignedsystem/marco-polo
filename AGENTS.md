# marco-polo

Python 3.14 project managed with `uv`.

## Run

```bash
uv run python src/competitors.py
uv run python src/keywords.py
uv run marco-polo-api
```

## Required env

Set `OPENROUTER_API_KEY` in `.env` (loaded via `python-dotenv`).  
Optional: `OPENROUTER_MODEL` (default: `openai/gpt-4.1-mini`), `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`.

## Entrypoints

- `src/competitors.py` — Scrapes a company website, extracts a business profile via LLM, searches DuckDuckGo for competitors, prints structured results.
- `src/keywords.py` — Same scrape + profile extraction, then generates top SEO/search keywords for the business.

## Shared models

`src/models.py` holds all Pydantic models (`WebsiteInput`, `BusinessProfile`, `Competitor`, `CompetitorList`, `SearchKeyword`, `KeywordList`) plus `coerce_model` utility. Shared across entrypoints. Imports use absolute `from src.models import ...`.

## Notes

- `opencode.json` blocks reading `.env` — env is loaded by the code via `python-dotenv`, not by the agent.
- No tests, no CI, no lint/typecheck config.
