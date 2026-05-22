# marco-polo — Frontend

Next.js 14 with TypeScript, Tailwind CSS, and App Router.

## Commands

```bash
cd frontend
npm run dev       # Dev server on :3000
npm run build     # Production build
npm run typecheck # tsc --noEmit
```

## Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Landing page — hero + registration form | public |
| `/dashboard` | Tabbed dashboard (Report, Competitors, Keywords) | requires registration (localStorage check, else redirects to `/`) |

## Architecture

- **API proxy**: `next.config.mjs` rewrites `/api/*` → `localhost:8000/*`. Backend must be running first.
- **Auth**: Simple localStorage-based. `lib/auth.ts` saves/loads `{ name, email }` from `marco-polo-user` key. No real auth — this is a placeholder flow.
- **Report flow**: Registration form → `POST /api/register` (placeholder) → save user → redirect to `/dashboard` → `ReportRequest` component → `POST /api/report` (placeholder, returns "coming soon" message).
- **Analysis flow**: `SearchForm` → `lib/api.ts` (fetch) → backend FastAPI → render results components.

## Components (all client components)

| Component | File | Role |
|-----------|------|------|
| `RegistrationForm` | `src/components/RegistrationForm.tsx` | Name + email + website form, calls `/api/register` |
| `ReportRequest` | `src/components/ReportRequest.tsx` | Website + description form, calls `/api/report`, shows success state |
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
