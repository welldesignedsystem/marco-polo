# marco-polo — Frontend

Next.js 14 web UI for the marco-polo backend. Enter a website to discover competitors or generate SEO keywords.

## Prerequisites

Node.js 18+ and the backend running on `localhost:8000`.

## Setup

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev       # Dev server at :3000, proxies /api/* → localhost:8000/*
npm run build     # Production build
npm run typecheck # tsc --noEmit
```

Start the backend first, then the frontend.

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind imports + component classes
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main page — form + results
├── components/
│   ├── BusinessProfile.tsx    # Business profile card with tags
│   ├── CompetitorResults.tsx  # Competitor list cards
│   ├── ErrorState.tsx         # Error message + retry button
│   ├── KeywordResults.tsx     # Keyword table with volume/intent badges
│   ├── LoadingSkeleton.tsx    # Animated loading placeholders
│   └── SearchForm.tsx         # URL + focus + type toggle + slider
└── lib/
    └── api.ts                # Typed fetch wrapper for /api/competitors and /api/keywords
```
