# Schema Markup Templates

Ready-to-use JSON-LD templates. Add inside a `<script type="application/ld+json">` tag in the `<head>` of your page.

---

## FAQ Schema

Use for: Any page with Q&A content, PAA targeting, voice search, AEO.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is [your question here]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your concise answer here. Keep it under 300 words. Write as a standalone answer."
      }
    },
    {
      "@type": "Question",
      "name": "How do you [action]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Step-by-step or direct answer here."
      }
    }
  ]
}
```

### Example: Long-tail relocation FAQ schema

Target high-value long-tail queries such as "best international movers from Singapore to UK" and "how to move household items internationally" with an FAQ section and JSON-LD.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the best international movers from Singapore to UK?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best international movers from Singapore to the UK are specialist relocation companies with strong customs experience, reliable door-to-door service, and positive customer reviews. Choose movers that offer UK import guidance, transit insurance, and flexible air or sea shipping options for household goods."
      }
    },
    {
      "@type": "Question",
      "name": "How do I move household items internationally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To move household items internationally, start by decluttering and creating an inventory, then choose the right shipping method—air for urgent parcels or sea freight for full loads. Pack fragile goods professionally, label boxes clearly, prepare customs documentation, and work with a licensed international mover to manage transit, insurance, and delivery."
      }
    }
  ]
}
```

---

## HowTo Schema

Use for: Tutorials, step-by-step guides, process articles.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [Task Name]",
  "description": "Brief description of what this guide achieves.",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Tool or resource needed"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1 Title",
      "text": "Detailed instruction for step 1.",
      "image": "https://example.com/step1-image.jpg",
      "url": "https://example.com/guide#step1"
    },
    {
      "@type": "HowToStep",
      "name": "Step 2 Title",
      "text": "Detailed instruction for step 2."
    }
  ]
}
```

---

## Article Schema

Use for: Blog posts, news articles, editorial content. Helps with E-E-A-T signals.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title Here",
  "description": "Brief summary of the article.",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2025-01-01",
  "dateModified": "2025-06-01",
  "author": {
    "@type": "Person",
    "name": "Author Full Name",
    "url": "https://example.com/author-bio",
    "sameAs": [
      "https://linkedin.com/in/authorname",
      "https://twitter.com/authorname"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Brand Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/your-article-url"
  }
}
```

---

## Product Schema

Use for: Ecommerce product pages, transactional queries.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": ["https://example.com/product.jpg"],
  "description": "Product description.",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "sku": "SKU123",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "USD",
    "price": "49.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Your Store Name"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "253"
  }
}
```

---

## LocalBusiness Schema

Use for: Local SEO, "near me" searches, voice local queries.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://example.com/photo.jpg",
  "@id": "https://example.com",
  "url": "https://example.com",
  "telephone": "+1-555-000-0000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "00000",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/yourbusiness",
    "https://www.google.com/maps/place/yourbusiness"
  ]
}
```

---

## BreadcrumbList Schema

Use for: Site structure signaling, SERP breadcrumb display.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Current Page Title",
      "item": "https://example.com/category/page"
    }
  ]
}
```

---

## Validation

Always validate schema at: https://validator.schema.org/
Also test in Google's Rich Results Test: https://search.google.com/test/rich-results