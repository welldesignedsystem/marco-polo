---
name: seo-geo-aeo-optimizer
description: >
  Use this skill whenever the user wants to rank higher in search results, AI answers, or voice search for any search term or query. Triggers include: "how do I rank for X", "help me optimize for [keyword]", "I want to appear in AI answers", "top of Google for X", "featured snippet", "AEO", "GEO", "answer engine optimization", "generative engine optimization", "SEO strategy", "rank my site", "appear in ChatGPT answers", "show up in Perplexity", "voice search optimization", "zero-click", "content strategy for ranking", or any mention of improving visibility in Google, Bing, AI tools (ChatGPT, Perplexity, Gemini, Claude), or voice assistants. Even if the user just says "I want to be top for [term]" or "how do I beat competitors for [keyword]", use this skill immediately. Do NOT wait for the user to say "SEO" or "AEO" explicitly.
---

# SEO / GEO / AEO Optimizer Skill

A comprehensive skill for helping users dominate search results across three dimensions:
- **SEO** (Search Engine Optimization) — Google, Bing, traditional search
- **GEO** (Generative Engine Optimization) — ChatGPT, Perplexity, Gemini, Claude AI answers
- **AEO** (Answer Engine Optimization) — Featured snippets, voice search, zero-click results

---

## Workflow Overview

When a user brings a search term/query to optimize, follow this sequence:

1. **Clarify** — Gather the query, URL/domain (if any), target audience, and content type
2. **Classify** — Determine intent type and which engines matter most
3. **Analyze** — Break down what it takes to rank for that specific query
4. **Strategize** — Produce a layered action plan covering SEO + GEO + AEO
5. **Prioritize** — Give a quick-win vs long-term roadmap

---

## Step 1: Clarify Inputs

Ask (or infer from context) the following:

| Input | Why it matters |
|---|---|
| The exact search query/term | The unit of optimization |
| Website URL (optional) | For on-page and authority analysis |
| Target audience | Shapes content angle |
| Current position (if known) | Sets baseline |
| Content format | Blog? Product page? Video? |
| Geography | Local vs global SEO |
| Priority engine | Google? Perplexity? Voice? |

If the user gives a query but no URL, proceed with general strategy. If they give a URL, tailor suggestions to their domain context.

---

## Step 2: Classify Query Intent

Identify the **intent type** — this shapes the entire strategy:

| Intent | Example | Best format |
|---|---|---|
| Informational | "how does X work" | Long-form article, FAQ, explainer |
| Navigational | "Shopify login" | Branded page, direct match |
| Commercial | "best X for Y" | Comparison, listicle, reviews |
| Transactional | "buy X online" | Product/landing page, structured data |
| Local | "plumber near me" | Google Business Profile, local schema |
| Conversational | "what should I do if…" | FAQ, direct answer, voice-optimized |

Also identify **SERP features** likely triggered:
- Featured Snippet (definition, list, table, steps)
- People Also Ask (PAA)
- Knowledge Panel
- Local Pack
- AI Overview / SGE result
- Video carousel

---

## Step 3: SEO Strategy

### 3.1 On-Page Optimization

**Title Tag**
- Include primary keyword near the start
- Keep under 60 characters
- Add a power word or number if possible
- Example: `"Best [Keyword] in 2025: [Benefit]"`

**Meta Description**
- 150–160 characters
- Include keyword + clear CTA
- Treat it as an ad, not a summary

**URL Slug**
- Short, hyphenated, keyword-first
- Remove stop words
- Example: `/keyword-main-phrase/`

**H1 / H2 Structure**
- H1: exact or close match to target query
- H2s: cover related sub-queries (use People Also Ask as a guide)
- H3s: step-by-step details, sub-topics

**Content Depth**
- Match or exceed the word count of top 3 ranking pages
- Cover all sub-topics those pages cover
- Add unique angle: original data, expert quote, first-hand experience

**Keyword Placement**
- First 100 words: include primary keyword naturally
- LSI/semantic keywords throughout (use related search suggestions)
- Avoid keyword stuffing — write for humans first

**Internal Linking**
- Link from high-authority pages on your site to the target page
- Use descriptive anchor text (not "click here")
- Link to 3–5 relevant internal pages from the target page too

**Page Speed & Core Web Vitals**
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Compress images, use CDN, minimize JS

**Schema Markup**
- Add appropriate schema type (Article, FAQ, HowTo, Product, LocalBusiness, etc.)
- FAQ schema = PAA eligibility + voice answer eligibility
- HowTo schema = step-by-step SERP feature

### 3.2 Off-Page / Authority

- **Backlinks**: Earn links from topically relevant, authoritative domains
- **Digital PR**: Data studies, original research, expert commentary
- **Guest posts**: Only on relevant, quality sites
- **Brand mentions**: Even unlinked mentions build topical authority signals
- **Social signals**: Distribution amplifies crawl rate and CTR signals

### 3.3 Technical SEO Checklist

- [ ] Page indexed (check via `site:yourdomain.com/page`)
- [ ] Canonical tag correct
- [ ] Mobile-friendly (Google Mobile-Friendly Test)
- [ ] HTTPS
- [ ] Sitemap submitted to Google Search Console
- [ ] No crawl blocks (robots.txt)
- [ ] Structured data valid (Schema Markup Validator)

---

## Step 4: GEO Strategy (Generative Engine Optimization)

GEO targets **AI answer engines**: ChatGPT Browse, Perplexity, Gemini, Claude, Bing Copilot. These engines pull from indexed web content and synthesize answers. To be cited:

### 4.1 Be a Citable Source

- Write **declarative, factual sentences** that can be lifted as answers
- Include **statistics, definitions, and comparisons** — these get cited heavily
- Attribute claims to sources (builds trust signals for AI to cite you)
- Use **direct answer format**: "X is Y. It works by Z."

### 4.2 Topical Authority & Entity Coverage

- Build **content clusters**: a pillar page + 5–10 supporting posts on sub-topics
- Cover the topic more thoroughly than anyone else
- Establish your brand/author as a recognized **entity** in your niche
  - Author bio with credentials
  - Author's own website or Wikipedia-like presence
  - Mentions from authoritative domains

### 4.3 Structured, Machine-Readable Content

- Use clear H2/H3 headings that mirror likely AI questions
- Add **definition blocks** (bolded term + colon + definition)
- Use **numbered lists** for processes (AI loves ordered steps)
- Include **summary boxes** or TL;DR at the top

### 4.4 Freshness & Update Signals

- Add "Last updated" date to pages
- Refresh content quarterly with new data
- AI engines favor recently updated, actively maintained content

### 4.5 Distribution on AI-Indexed Sources

- Submit to or publish on: Reddit, Quora, Medium, LinkedIn Articles, industry wikis
- These platforms are heavily indexed by AI answer engines
- Ensure your brand/answer appears in these communities naturally

---

## Step 5: AEO Strategy (Answer Engine Optimization)

AEO targets **zero-click answers**: Featured Snippets, Voice Search, Google's AI Overviews, PAA boxes.

### 5.1 Featured Snippet Capture

There are 4 snippet types — optimize for each differently:

**Paragraph Snippet** (most common)
- Write a 40–60 word direct answer immediately after the H2 that matches the query
- Start with: "X is…", "To [verb] X, you…", "[Query]? [Answer]."
- No fluff, no preamble

**List Snippet**
- Use numbered lists (for steps/processes) or bulleted lists (for items)
- Keep each item under 10 words
- Have 5–10 items total

**Table Snippet**
- Use HTML `<table>` tags (not images of tables)
- Good for comparisons, pricing, specs

**Video Snippet**
- Timestamp key moments in YouTube descriptions
- Say the answer out loud in the first 30 seconds of the video

### 5.2 Voice Search Optimization

Voice queries are longer, more conversational, and question-based:
- Target **question keywords**: "how", "what", "where", "who", "best way to"
- Write in natural spoken language (contractions are fine)
- Add an FAQ section targeting the exact voice query phrasing
- Ensure your Google Business Profile is complete (for local voice)
- Aim for the featured snippet — it's usually what voice assistants read aloud

### 5.3 People Also Ask (PAA) Domination

- Research PAA questions for your target query
- Create a dedicated **FAQ section** on your page answering each PAA question
- Each answer: 2–4 sentences, starts directly without repeating the question
- Add FAQ schema markup

### 5.4 Google AI Overview (SGE) Optimization

- Mirrors GEO strategy: be authoritative, factual, and citable
- Pages with **E-E-A-T signals** (Experience, Expertise, Authoritativeness, Trustworthiness) are preferred
- First-hand experience content (reviews, case studies, personal accounts) is increasingly favored
- Include the query phrase in the first paragraph naturally

---

## Step 6: Content Blueprint Template

For any target query, produce this content blueprint:

```
TARGET QUERY: [exact query]
INTENT: [informational / commercial / transactional / local / conversational]
PRIORITY ENGINES: [Google / Perplexity / Voice / AI Overview]

TITLE TAG: [≤60 chars, keyword near start]
META DESCRIPTION: [150–160 chars, CTA]
URL SLUG: /[short-keyword-slug]/

CONTENT STRUCTURE:
  H1: [close match to query]
  [DIRECT ANSWER BLOCK — 40–60 words for featured snippet]
  H2: What is [Topic]? [definition + context]
  H2: How [Topic] Works [steps / process]
  H2: [Comparison or Benefits]
  H2: [Common Questions / FAQ]
    H3: [PAA Question 1] + short answer
    H3: [PAA Question 2] + short answer
    H3: [PAA Question 3] + short answer
  H2: [Expert Tips / Unique Angle]
  H2: Conclusion / Summary

SCHEMA TO ADD: [FAQ + Article / HowTo / Product]
INTERNAL LINKS FROM: [list 2–3 high-authority pages on site]
BACKLINK TARGETS: [types of sites to pitch]
CONTENT DIFFERENTIATOR: [what makes this unique vs competitors]
```

---

## Step 7: Prioritized Action Roadmap

Always close with a prioritized roadmap:

### Quick Wins (Week 1–2)
- On-page optimization (title, meta, H1, direct answer block)
- Add FAQ schema markup
- Internal linking from existing pages
- Submit/re-submit URL to Google Search Console

### Medium Term (Month 1–3)
- Publish supporting cluster content
- Earn 3–5 relevant backlinks (digital PR, guest post)
- Build out PAA answers
- Optimize page speed

### Long Term (Month 3–12)
- Build topical authority across the full content cluster
- Establish brand entity (author bios, Wikipedia-level presence)
- Earn citations from authoritative GEO sources (Reddit, Quora, major media)
- Monitor and refresh content quarterly

---

## Quick Reference: Which Tactic for Which Engine

| Tactic | Google SEO | Google AI Overview | Perplexity/ChatGPT | Voice Search |
|---|:---:|:---:|:---:|:---:|
| Keyword in title/H1 | ✅ | ✅ | ⚠️ | ✅ |
| Direct answer block | ✅ | ✅ | ✅ | ✅ |
| FAQ schema | ✅ | ✅ | ⚠️ | ✅ |
| Backlinks | ✅ | ⚠️ | ⚠️ | ❌ |
| Topical authority cluster | ✅ | ✅ | ✅ | ⚠️ |
| Original data/research | ⚠️ | ✅ | ✅ | ❌ |
| Reddit/Quora presence | ❌ | ⚠️ | ✅ | ❌ |
| Local schema | ✅ (local) | ✅ (local) | ❌ | ✅ (local) |
| Structured lists/tables | ✅ | ✅ | ✅ | ⚠️ |
| E-E-A-T signals | ✅ | ✅ | ✅ | ⚠️ |

✅ = High impact | ⚠️ = Moderate impact | ❌ = Low/no impact

---

## Reference Files

- `references/intent-patterns.md` — Detailed intent classification and SERP feature mapping
- `references/schema-templates.md` — Ready-to-use JSON-LD schema templates (FAQ, HowTo, Article, Product, Local)
- `references/geo-sources.md` — Platform-by-platform guide to getting cited in AI engines

Read these when you need deeper detail on a specific sub-topic.