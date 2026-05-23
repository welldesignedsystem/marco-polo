# Intent Patterns & SERP Feature Mapping

A detailed reference for classifying query intent and predicting which SERP features and AI answer formats will appear.

---

## Intent Classification Patterns

### Informational Intent

**Signals**: how, what, why, when, who, explain, guide, tutorial, definition, examples
**Examples**: "how does photosynthesis work", "what is a HELOC", "why is my cat vomiting"

**Ranking strategy**:
- Long-form comprehensive content (1,500–4,000 words)
- Clear H2 structure covering all sub-questions
- Definition block at top for snippet capture
- FAQ section for PAA domination

**Likely SERP features**: Featured Snippet, PAA, AI Overview, Video Carousel
**GEO priority**: Very high — AI engines love answering informational queries

---

### Commercial Investigation Intent

**Signals**: best, top, vs, review, comparison, alternatives, recommended, worth it
**Examples**: "best CRM for small business", "Shopify vs WooCommerce", "is [product] worth it"

**Ranking strategy**:
- Comparison tables with clear criteria
- Pros/cons lists
- First-hand or cited review data
- Regular updates (freshness critical for "best" queries)
- Affiliate disclosures if applicable

**Likely SERP features**: Review snippets, Comparison panel, People Also Ask
**GEO priority**: High — Perplexity and ChatGPT Browse are heavily used for product research

---

### Transactional Intent

**Signals**: buy, order, price, discount, coupon, cheap, near me, delivery, hire, book
**Examples**: "buy noise-cancelling headphones", "HVAC repair near me", "book dentist appointment"

**Ranking strategy**:
- Optimize product/service pages (not blog posts)
- Price, availability, reviews on-page
- Local signals if applicable
- Clear CTA above the fold
- Product schema with pricing and availability

**Likely SERP features**: Shopping ads, Local Pack, Product Knowledge Panel
**GEO priority**: Low for pure AI answers — users go to actual sites for transactions

---

### Navigational Intent

**Signals**: brand name + login/website/app/contact/support
**Examples**: "Netflix login", "Canva templates", "Apple support phone number"

**Ranking strategy**:
- Ensure your brand pages are properly indexed and titled
- Claim your Knowledge Panel in Google Search Console
- Use Sitelinks schema where possible
- Keep URLs clean and obvious

**Likely SERP features**: Sitelinks, Knowledge Panel
**GEO priority**: Minimal — these route directly to brand sites

---

### Local Intent

**Signals**: near me, in [city], [city] + service, open now, directions
**Examples**: "Italian restaurant Sydney CBD", "plumber near me open now"

**Ranking strategy**:
- Google Business Profile (GBP) fully completed and verified
- NAP consistency (Name, Address, Phone) across all directories
- Local citations (Yelp, TripAdvisor, industry directories)
- Location pages on website with LocalBusiness schema
- Reviews (quantity + recency + responses)

**Likely SERP features**: Local Pack (map + 3 businesses), Local Knowledge Panel
**GEO priority**: Moderate — voice assistants use local intent heavily

---

### Conversational / Long-tail Intent

**Signals**: Full questions, "should I", "can I", "is it okay to", personal situation framing
**Examples**: "should I refinance my mortgage in 2025", "can I use bleach on colored clothes"

**Ranking strategy**:
- Match the conversational tone in your content
- Answer the exact question in the opening 2 sentences
- Include nuance and conditional answers ("it depends on X")
- Voice-optimize (natural language, short sentences)

**Likely SERP features**: Featured Snippet, Voice Search result, AI Overview
**GEO priority**: Very high — these are the queries AI chatbots handle most

---

## SERP Feature Trigger Conditions

### Featured Snippet (Position 0)

**Triggered by**: Queries with clear informational intent where Google can extract a discrete answer
**Content requirements**:
- Direct answer in 40–60 words immediately following a relevant H2
- Starts with the answer (not "In this article we will...")
- For list snippets: use proper `<ul>` or `<ol>` HTML tags
- For table snippets: use proper `<table>` HTML

**Pro tip**: To steal a snippet from a competitor, find the exact H2 heading they use, write a better/more complete answer in the same format.

---

### People Also Ask (PAA)

**Triggered by**: Most queries — PAA appears on ~80% of searches now
**Content requirements**:
- Identify PAA questions via Google search for your target term
- Create H3 subheadings matching the PAA question wording exactly
- Answer in 2–4 sentences immediately below the H3
- Add FAQ schema for the same questions

**Strategy**: Answer 5–8 PAA questions per page. Answering one PAA question well often earns appearances in the PAA boxes for multiple related queries.

---

### AI Overview (Google SGE)

**Triggered by**: Most informational and commercial queries in markets where SGE is enabled
**Content requirements**:
- Topical authority signals (comprehensive coverage of the subject)
- E-E-A-T signals (author credentials, site trust, citations)
- Structured, skimmable content
- First-hand experience elements (case studies, personal accounts, original data)

**Key insight**: SGE tends to cite 3–5 sources. Appearing in the top 10 organic results significantly increases SGE citation probability, but it's not guaranteed — AI Overview sometimes cites pages ranked #15–#20 if they have the best-structured direct answer.

---

### Video Carousel

**Triggered by**: "How to" queries, product reviews, tutorials, entertainment
**Content requirements**:
- YouTube video with keyword-rich title matching the query
- Video published on a channel with decent authority
- Good watch time and engagement metrics
- Timestamps in description for key sections

---

### Knowledge Panel

**Triggered by**: Brand/entity searches, celebrity/person queries, notable organizations
**How to earn one**:
- Create a Wikidata entity for your brand
- Earn a Wikipedia article (if notable enough)
- Consistent NAP data across the web
- Claim via Google Search Console > "Is this your business?"

---

### Local Pack (Map Pack)

**Triggered by**: Any query with local intent or geo-modifier
**Ranking factors** (in rough order of importance):
1. Google Business Profile completeness and verification
2. Proximity to the searcher
3. Review rating and quantity
4. Category relevance
5. Local citation consistency
6. Website authority

---

## Query Modifier Cheat Sheet

| Modifier | Intent signal | Action |
|---|---|---|
| "best" | Commercial | Comparison content, review signals |
| "how to" | Informational | HowTo schema, numbered steps |
| "what is" | Informational | Definition block, FAQ schema |
| "near me" | Local transactional | GBP, local schema |
| "vs" / "or" | Commercial | Comparison table |
| "review" | Commercial | First-hand review, rating schema |
| "price" / "cost" | Transactional | Pricing page, product schema |
| "free" | Transactional | Free tier/tool page |
| "template" | Informational | Downloadable asset + landing page |
| "examples" | Informational | List/gallery format |
| "2025" / current year | Freshness | Update date prominently displayed |
| "Reddit" | Social proof | Reddit community presence |
| "forum" | Social proof | Community participation |