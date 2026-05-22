"use client";

import Link from "next/link";

const focusAreas = [
  {
    title: "Technical SEO Audit",
    description:
      "A deep inspection of your website's infrastructure to ensure search engines can crawl, index, and render your content efficiently.",
    items: [
      "Core Web Vitals — LCP, INP, CLS scores across mobile and desktop",
      "Crawlability — robots.txt, sitemap.xml, noindex directives, and orphan pages",
      "Page speed analysis with Lighthouse performance scoring",
      "Mobile responsiveness and Core Web Vitals pass rates",
      "HTTPS, security headers, and redirect chain hygiene",
      "Structured data coverage — Organization, Product, FAQ, BreadcrumbList, and Review schema",
    ],
  },
  {
    title: "On-Page Optimization",
    description:
      "Fine-tuning every page element that signals relevance to search engines and drives click-through rates from the SERP.",
    items: [
      "Title tag optimization — length, keyword placement, brand inclusion, and uniqueness",
      "Meta description crafting for CTR maximization and rich snippet eligibility",
      "H1/H2 heading hierarchy and keyword alignment across all pages",
      "Content depth benchmarking against top-ranking competitor pages",
      "Image alt text coverage and descriptive filenames for image search",
      "Internal linking structure, anchor text optimization, and topic cluster connectivity",
    ],
  },
  {
    title: "Backlink Analysis",
    description:
      "Evaluating the authority and trust signals flowing into your domain from other websites — still one of the strongest ranking factors.",
    items: [
      "Domain authority comparison against top competitors",
      "Total backlink count, unique referring domains, and link quality distribution",
      "Competitor backlink gap analysis — sites linking to competitors but not to you",
      "Broken link building opportunities on relevant industry pages",
      "Unlinked brand mentions that should become backlinks",
      "Guest post and resource page targeting for link acquisition",
    ],
  },
  {
    title: "Keyword Gap Assessment",
    description:
      "Identifying the high-value search queries your competitors rank for that your website does not — your fastest path to new traffic.",
    items: [
      "Competitor keyword portfolio analysis across your top 3-5 competitors",
      "Content gap mapping — keywords with search volume where you have no page",
      "Search intent classification — informational, commercial, transactional, navigational",
      "Priority scoring by combining search volume, business fit, and ranking difficulty",
      "AI prompt gap analysis — keywords where competitors appear in AI answers but you don't",
      "Quarterly keyword win/loss tracking against your competitive set",
    ],
  },
];

const workflows = [
  {
    step: "1",
    title: "Scrape & Profile",
    desc: "Enter any website URL. aeo-app.io scrapes the site content and builds a detailed business profile — company name, industry, customer segments, and geographic focus.",
    color: "indigo",
  },
  {
    step: "2",
    title: "Competitor Discovery",
    desc: "We search across DuckDuckGo or Tavily to find real businesses competing for the same audience, ranked by relevance and market overlap.",
    color: "indigo",
  },
  {
    step: "3",
    title: "Keyword Intelligence",
    desc: "AI generates a targeted keyword set optimized for your specific business profile, including search volume estimates and intent classification.",
    color: "indigo",
  },
  {
    step: "4",
    title: "Actionable Output",
    desc: "Results are delivered as ranked competitor lists and keyword tables with explanations — ready to feed into your content strategy.",
    color: "indigo",
  },
];

export default function SeoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors">
              <span className="text-xs font-bold text-white">aa</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">aeo-app.io</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Guide
            </Link>
            <span className="text-sm font-medium text-indigo-600">SEO</span>
            <Link href="/dashboard" className="btn-primary text-xs px-4 py-2">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-28">
          <div className="max-w-3xl">
            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200 transition-colors mb-6"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Guide
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Pillar 1
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Search Engine<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Optimization
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              The practice of optimizing your website to rank higher in traditional search engines
              like Google and Bing. It covers technical performance, on-page content, backlinks,
              and user experience signals that search engines use to determine relevance and authority.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative -mt-12 z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "8.5B+", label: "Daily Google searches" },
              { value: "68%", label: "Of online experiences start with search" },
              { value: "10x", label: "First result CTR vs. tenth position" },
            ].map((stat, i) => (
              <div key={i} className="card px-6 py-5 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="mx-auto max-w-6xl px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What SEO Covers</h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            Four interconnected disciplines that determine your search visibility.
          </p>
        </div>
        <div className="grid gap-6">
          {focusAreas.map((area, i) => (
            <div key={i} className="card-hover px-8 py-7">
              <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{area.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{area.description}</p>
                </div>
                <div className="lg:col-span-3">
                  <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {area.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-600">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How aeo-app.io helps */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl tracking-tight">
              How aeo-app.io Delivers SEO
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              From website scrape to actionable intelligence in under 30 seconds.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflows.map((w) => (
              <div key={w.step} className="card px-6 py-8 bg-white/5 backdrop-blur-sm border-slate-700">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-lg font-bold text-indigo-400 mb-4">
                  {w.step}
                </span>
                <h3 className="font-bold text-white mb-2">{w.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to audit your SEO?
          </h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Enter your website and get a full competitive analysis with keyword
            recommendations — no sign-up required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn-primary text-base px-8 py-3">
              Analyze Your Website
            </Link>
            <Link href="/guide" className="btn-secondary text-base px-8 py-3">
              Back to Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between text-sm text-slate-400">
          <span>aeo-app.io — Competitive Intelligence &amp; SEO</span>
          <div className="flex items-center gap-4">
            <Link href="/guide" className="hover:text-slate-600 transition-colors">Guide</Link>
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
