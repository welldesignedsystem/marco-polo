# aeo-app · Landing Page (Stripe-inspired)

Vite + React 18 implementation of the aeo-app marketing site.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  main.jsx               React 18 entry
  App.jsx                Page composition
  styles.css             Design tokens + every section's CSS
  components/
    icons.jsx            Tick, Arrow, Caret, GoogleLogo, Sparkle
    Hero.jsx             Ticker + Nav + mesh-gradient hero
    ReportCard.jsx       Product card sitting on the hero
    Logos.jsx            Customer logo strip
    Stats.jsx            Dark stats band
    Bento.jsx            "Products" bento grid
    Solutions.jsx        Alternating "Built for every team" rows
    ThreeUp.jsx          "Why aeo-app" three feature cards
    Pricing.jsx          Plans + monthly/annual toggle
    Quotes.jsx           Dark customer-quote carousel
    Devs.jsx             Developers + integrations grid
    Blog.jsx             "What's happening" posts
    Contact.jsx          Trial form
    Footer.jsx           Dense footer
```

## Notes

- Fonts (Inter, JetBrains Mono, Source Serif 4) load from Google Fonts via `index.html`.
- Theme toggle (light/dark) and accent-color swatches that lived in the Tweaks panel
  were dev-only and are not included; switch them by editing CSS variables in
  `src/styles.css` or setting `document.documentElement.dataset.theme = 'dark'`.
- All copy and stats are placeholder — replace before shipping.
