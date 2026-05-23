# SEO / GEO / AEO Compliance Skills

This document defines the methodology and criteria for evaluating a website's
compliance across three modern search-discovery dimensions.

---

## 1. SEO — Search Engine Optimization

Traditional optimization for crawler-based search engines (Google, Bing).

### 1.1 Technical SEO

| Criterion | What to check |
|-----------|---------------|
| **Crawlability** | robots.txt, sitemap.xml, no orphan pages, no `noindex` on important pages |
| **Page speed** | Core Web Vitals (LCP ≤ 2.5 s, FID ≤ 100 ms, CLS ≤ 0.1), Lighthouse scores |
| **Mobile friendliness** | Responsive design, tap targets, viewport meta tag, mobile-first layout |
| **HTTPS** | Valid SSL cert, all resources served over HTTPS, no mixed content |
| **Canonical URLs** | Self-referencing canonicals, no duplicate content across URLs |
| **Structured data** | JSON-LD for Organization, Product, Article, FAQ, BreadcrumbList, LocalBusiness, etc. |
| **URL structure** | Clean, descriptive slugs, no session IDs/params, lowercase, hyphen-separated |
| **Status codes** | 200 for live pages, 301 for moved, 404 for gone, no soft 404s |

### 1.2 On-Page SEO

| Criterion | What to check |
|-----------|---------------|
| **Title tags** | Unique per page, ≤ 60 chars, primary keyword near the front |
| **Meta descriptions** | Unique per page, ≤ 160 chars, compelling with CTA |
| **Headings** | Single `<h1>` per page, logical hierarchy (h1 → h2 → h3), keyword-rich |
| **Content quality** | Original, substantive, covers topic comprehensively, no thin content |
| **Keyword usage** | Primary keyword in h1, first paragraph, and naturally throughout body |
| **Image optimization** | Descriptive alt text, compressed WebP/AVIF, lazy loading |
| **Internal linking** | Contextual links between related pages, descriptive anchor text |
| **External linking** | Links to authoritative sources, no-follow for user-generated/sponsored |

### 1.3 Off-Page SEO

| Criterion | What to check |
|-----------|---------------|
| **Backlink profile** | Quantity of referring domains, domain authority, relevance, link diversity |
| **Brand mentions** | Unlinked brand mentions across the web |
| **Social signals** | Social media presence and engagement (indirect ranking factor) |
| **Local citations** | NAP (Name, Address, Phone) consistency across directories |

### 1.4 International / Multilingual SEO

| Criterion | What to check |
|-----------|---------------|
| **hreflang tags** | For multi-language sites: correct iso language codes, self-referencing, no conflicts |
| **ccTLD vs gTLD** | Country-code TLD for local targeting or gTLD with hreflang + geotargeting in GSC |
| **Language-specific sitemaps** | Separate sitemaps or annotations per language |

---

## 2. GEO — Generative Engine Optimization

Optimizing content to be cited and surfaced by LLM-based search engines
(ChatGPT Search, Perplexity, Google AI Overviews, Bing Copilot).

### 2.1 Source Credibility & Authority

| Criterion | What to check |
|-----------|---------------|
| **E-E-A-T signals** | Author bylines, credentials, cited sources, publication dates, about page with real people |
| **Domain authority** | High DR / DA, trust flow, referral domains from .edu / .gov |
| **Original research** | Proprietary data, studies, surveys that LLMs can cite as authoritative |
| **Citation frequency** | How often the domain appears as a source in LLM-generated answers |
| **External validation** | Links to/from recognized industry authorities, fact-checks |

### 2.2 Content Structure for LLM Extraction

| Criterion | What to check |
|-----------|---------------|
| **Clear answers** | Direct answers to questions in the first 50-100 words of a section |
| **FAQ / Q&A format** | Structured FAQ schema, question-answer pairs that LLMs extract verbatim |
| **Definition-first** | Clear definitions of terms before deeper explanation (inverted pyramid) |
| **Bullet lists & tables** | Structured data formats LLMs parse easily (lists, tables, code blocks, quotes) |
| **Summary sections** | Key takeaways, executive summaries, TL;DR blocks at top of content |

### 2.3 Entity & Knowledge Graph Optimization

| Criterion | What to check |
|-----------|---------------|
| **Knowledge Panel** | Presence in Google Knowledge Graph / Wikidata entry for the brand |
| **Entity salience** | Clear entity relationships (brand → product → category), co-reference resolution |
| **Wikipedia presence** | Wikipedia article or citation for the brand/products |
| **Schema.org markup** | JSON-LD with `@id` URIs for entities, `sameAs` links |
| **Topical authority** | Comprehensive coverage of a topic cluster (hub-and-spoke model) |

### 2.4 Citation & Attribution Readiness

| Criterion | What to check |
|-----------|---------------|
| **Citeable statistics** | Standalone stat blocks with numbers, sources, publication date |
| **Attribution snippets** | Short 2-3 sentence paragraphs LLMs can quote directly |
| **No-date content** | All content has visible publication date and last-updated date |
| **Author attribution** | Visible author name + link to author bio/credentials page |
| **Copyright & licensing** | Clear usage rights; CC license or explicit citation permission |

---

## 3. AEO — Answer Engine Optimization

Optimizing for direct-answer systems: featured snippets, voice assistants
(Siri, Alexa, Google Assistant), and conversational AI.

### 3.1 Featured Snippet Optimization

| Criterion | What to check |
|-----------|---------------|
| **Question targeting** | Content built around "what is", "how to", "why", "vs", "best" queries |
| **Paragraph snippets** | Concise 40-50 word answer paragraph immediately after the question |
| **List snippets** | Numbered steps for "how to" queries, bulleted lists for "what are" queries |
| **Table snippets** | Data presented in HTML `<table>` for comparison queries |
| **Snippet markup** | `answeredby` / `QAPage` schema for Q&A content |

### 3.2 Voice Search Readiness

| Criterion | What to check |
|-----------|---------------|
| **Conversational phrasing** | Natural language, question-based headings, long-tail conversational queries |
| **Local voice SEO** | "near me" optimization, Google Business Profile, local schema |
| **Page speed (mobile)** | Voice searches are predominantly mobile; ≥ 90 Lighthouse performance |
| **Direct answers** | 29-word or shorter answers for voice snippet extraction |
| **Snippet position** | Content structured to appear in Position 0 (above organic results) |

### 3.3 Conversational AI Readiness

| Criterion | What to check |
|-----------|---------------|
| **Chat-optimized content** | Dialog-style Q&A, "people also ask" coverage |
| **Entity linking** | Clear entity references that AI assistants can follow |
| **Contextual depth** | Content that supports follow-up questions and multi-turn conversations |
| **Opiniated stances** | Defensible positions AI assistants can reference as expert opinions |
| **Multimodal readiness** | Image/video content that AI assistants can reference in responses |

### 3.4 Trust & Factual Accuracy

| Criterion | What to check |
|-----------|---------------|
| **Fact-checking** | Claims supported by linked sources; no unsupported statements |
| **Freshness** | Content updated within the last 6 months; evergreen content refreshed yearly |
| **Medical/YMYL accuracy** | For YMYL topics: expert review, cited studies, disclaimers |
| **Consistency** | No contradictory information across pages on the same site |
| **User intent matching** | Content matches search intent (informational / navigational / commercial / transactional) |

---

## 4. Scoring Rubric

Each criterion is scored 0-5:

| Score | Meaning |
|-------|---------|
| 0 | Not present / not implemented |
| 1 | Present but severely lacking |
| 2 | Partial implementation |
| 3 | Adequate implementation |
| 4 | Good implementation with minor gaps |
| 5 | Excellent / best-in-class |

Dimension scores are averaged across criteria and normalized to 0-100.

Overall compliance score is a weighted average:
- **SEO**: 35 %
- **GEO**: 35 %
- **AEO**: 30 %
