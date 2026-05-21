# marco-polo — Frontend

Next.js 14 with TypeScript, Tailwind CSS, and App Router.

## Commands

```bash
cd frontend
npm run dev       # Dev server on :3000
npm run build     # Production build
npm run typecheck # tsc --noEmit
```

## Architecture

- **API proxy**: `next.config.mjs` rewrites `/api/*` → `localhost:8000/*`. Backend must be running first.
- **Data flow**: `page.tsx` → `lib/api.ts` (fetch) → backend FastAPI → render components.
- **Two analysis modes**: toggle between `competitors` and `keywords` in `SearchForm.tsx`.

## Components (all client components)

| Component | File | Role |
|-----------|------|------|
| `SearchForm` | `src/components/SearchForm.tsx` | Type toggle, URL/focus inputs, results slider, submit |
| `BusinessProfile` | `src/components/BusinessProfile.tsx` | Company name, domain, tags, evidence list |
| `CompetitorResults` | `src/components/CompetitorResults.tsx` | Ranked competitor cards with website link |
| `KeywordResults` | `src/components/KeywordResults.tsx` | Table with keyword, volume badge, intent badge, reason |
| `LoadingSkeleton` | `src/components/LoadingSkeleton.tsx` | Animated shimmer placeholders |
| `ErrorState` | `src/components/ErrorState.tsx` | Error message with optional retry |

## Quirks

- `next.config.mjs` uses JSDoc `@type` instead of TS import (`.mjs` doesn't support TS syntax).
- The `postcss.config.js` uses CommonJS (`module.exports`).
- Tailwind custom classes (`card`, `input-field`, `btn-primary`, etc.) are defined in `globals.css` via `@layer components`.
