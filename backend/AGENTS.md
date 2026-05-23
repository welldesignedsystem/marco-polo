# Backend Agent Instructions

## Project

Python 3.14, managed with `uv`. Project name `marco-polo` in `backend/`.

## Commands

```bash
uv run python src/report.py       # CLI: website URL → deep research → PDF compliance report
uv run python src/competitors.py  # CLI: scrape → profile → find competitors
uv run python src/keywords.py     # CLI: scrape → profile → generate SEO keywords
uv run marco-polo-api             # FastAPI dev server (uvicorn reload) on :8000
```

## Report Generator Agent

When running `src/report.py`, the agent operates as follows:

### Workflow

1. **Load context** — Read `SKILLS.md` (compliance methodology) and `AGENTS.md` (these instructions) to understand the framework.
2. **Scrape target** — Fetch the website content via `tools.scrape_website()`.
3. **Build profile** — Use LLM to extract a `BusinessProfile` via `tools.extract_business_profile()`.
4. **Deep research** — For each dimension (SEO, GEO, AEO):
   - Search the web via Tavily/DuckDuckGo for current best practices and industry standards relevant to the target's industry.
   - Cross-reference the website text and profile against the criteria in `SKILLS.md`.
   - Use the LLM to score each criterion and generate findings.
5. **Compile report** — Aggregate all findings into a structured `ComplianceReport` model.
6. **Generate PDF** — Render a professional PDF report with sections: Executive Summary, SEO, GEO, AEO, Recommendations.

### Available Tools (in `tools.py`)

| Function | Purpose |
|----------|---------|
| `scrape_website(url, max_chars)` | Scrape website text via WebBaseLoader |
| `extract_business_profile(llm, website_input, website_text)` | Extract company profile |
| `search_web(query, max_results, provider)` | Web search via configured provider |
| `read_file(path)` | Read a text file from disk |
| `create_llm()` | Create a ChatOpenAI instance |
| `analyze_seo_compliance(...)` | LLM analysis against SEO criteria |
| `analyze_geo_compliance(...)` | LLM analysis against GEO criteria |
| `analyze_aeo_compliance(...)` | LLM analysis against AEO criteria |

### Report Structure

The PDF report must contain:
- **Cover page** with website name, URL, report date
- **Executive Summary** with overall compliance score and top 3 findings
- **SEO Assessment** — scored criteria, strengths, weaknesses, recommendations
- **GEO Assessment** — scored criteria, strengths, weaknesses, recommendations
- **AEO Assessment** — scored criteria, strengths, weaknesses, recommendations
- **Action Plan** — prioritized recommendations with estimated effort

### Environment

- `OPENROUTER_API_KEY` — for LLM access
- `TAVILY_API_KEY` — for web search
- `SEARCH_PROVIDER` — `tavily` or `duckduckgo` (default: `tavily`)

## Architecture

- `src/models.py` — Pydantic models + `coerce_model`. Absolute imports from `src.models`.
- `src/model_utils.py` — `ModelFactory`, `structured_call()` for LLM JSON extraction.
- `src/searcher.py` — `SearchStrategy` ABC with `DuckDuckGoStrategy` + `TavilyStrategy`. Factory `create_searcher()`.
- `src/tools.py` — Reusable tools for scraping, analysis, search.
- `src/report.py` — DeepAgent orchestrator + PDF generation.
- `src/competitors.py` — `CompetitorFinder`: scrape → profile → search → LLM extraction.
- `src/keywords.py` — `KeywordFinder`: scrape → profile → LLM keyword generation.
- `src/api.py` — FastAPI entrypoint.
- `src/logging_config.py` — Rotating file handler + stderr.

## Quirks

- `load_dotenv()` is called at module import time in `api.py`, `competitors.py`, `keywords.py`, `report.py`, `tools.py`.
- Website text truncated to 12 000 chars before LLM calls.
- No tests, no CI, no lint/typecheck config.
