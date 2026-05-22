"use client";

import Link from "next/link";

interface PillarProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  whyMatters: string[];
  howHelps: string[];
  gradient: string;
  icon: string;
}

const pillars: PillarProps[] = [
  {
    index: 1,
    title: "SEO",
    subtitle: "Search Engine Optimization",
    description:
      "The practice of optimizing your website to rank higher in traditional search engines like Google and Bing. It covers technical performance, on-page content, backlinks, and user experience signals that search engines use to determine relevance.",
    whyMatters: [
      "Google processes over 8.5 billion searches per day — the largest traffic source for most websites",
      "68% of online experiences begin with a search engine",
      "The first organic result is 10x more likely to get a click than the tenth",
      "SEO compounds over time; a well-optimized page generates traffic for years",
    ],
    howHelps: [
      "Uncover high-value keywords your competitors rank for but you don't",
      "Discover who your real competitors are and how they position themselves",
      "Get ranked competitor intelligence with business profiles and market focus",
      "Understand search intent patterns to shape your content strategy",
    ],
    gradient: "from-indigo-600 via-indigo-500 to-purple-600",
    icon: "🔍",
  },
  {
    index: 2,
    title: "GEO",
    subtitle: "Generative Engine Optimization",
    description:
      "The emerging discipline of optimizing your content so AI-powered search engines — ChatGPT, Perplexity, Google AI Overviews, Microsoft Copilot — reference and recommend your business when generating answers to user queries.",
    whyMatters: [
      "AI-generated answers appear above traditional search results, capturing the majority of clicks",
      "ChatGPT alone has 400M+ weekly active users acting on its recommendations",
      "Businesses cited in AI answers see 2-3x referral traffic from users who verify recommendations",
      "GEO requires different optimization than SEO — AI engines favor authoritative, citable, structured content",
    ],
    howHelps: [
      "Analyze whether your business appears in AI assistant responses for target queries",
      "Compare your AI visibility against competitors across ChatGPT, Copilot, and Perplexity",
      "Identify content gaps that prevent AI engines from citing your business as a source",
      "Generate keyword and prompt strategies optimized for AI discovery, not just Google rankings",
    ],
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    icon: "🧠",
  },
  {
    index: 3,
    title: "AEO",
    subtitle: "Answer Engine Optimization",
    description:
      "The practice of structuring your content to appear as direct answers in voice search results, featured snippets, Google's People Also Ask boxes, and AI assistant responses. AEO focuses on clear, authoritative, question-answering content.",
    whyMatters: [
      "Featured snippets capture 8-10% of all search clicks while occupying the coveted position zero",
      "Voice search accounts for 20% of all mobile queries and is growing 10x faster than text search",
      "AI assistants read your content aloud — only the most clearly structured answers get selected",
      "Answer-engine-optimized pages are 3x more likely to be cited across multiple AI platforms",
    ],
    howHelps: [
      "Identify questions your customers are asking that your content doesn't answer",
      "Reveal competitor content that ranks in snippet positions you can capture",
      "Get actionable recommendations for FAQ schema, structured data, and question-targeted content",
      "Track your answer visibility across voice search, snippets, and AI assistant surfaces",
    ],
    gradient: "from-amber-500 via-orange-500 to-rose-600",
    icon: "💬",
  },
];

function PillarSection({ pillar }: { pillar: PillarProps }) {
  return (
    <section className="relative">
      <div className="sticky top-0 z-10 pt-16 pb-8">
        <div className={`mx-auto max-w-6xl px-4`}>
          <div className={`inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${pillar.gradient} px-6 py-3 shadow-lg`}>
            <span className="text-2xl">{pillar.icon}</span>
            <div>
              <span className="text-sm font-semibold text-white/80">Pillar {pillar.index}</span>
              <h2 className="text-2xl font-bold text-white tracking-tight">{pillar.title}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">{pillar.description}</p>
            <div className="card p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-red-600">!</span>
                Why it matters
              </h3>
              <ul className="space-y-2">
                {pillar.whyMatters.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r ${pillar.gradient}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

            <div className="lg:col-span-2">
              <div className="card-hover p-6 h-full border-t-4" style={{ borderTopColor: pillar.index === 1 ? "#6366f1" : pillar.index === 2 ? "#10b981" : "#f59e0b" }}>
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-xs font-bold text-indigo-600">aa</span>
                  How aeo-app.io helps
                </h3>
                <ul className="space-y-3">
                  {pillar.howHelps.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600">
                      <svg className={`mt-0.5 h-4 w-4 shrink-0 ${pillar.index === 1 ? "text-indigo-500" : pillar.index === 2 ? "text-emerald-500" : "text-amber-500"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={`/guide/${pillar.title.toLowerCase()}`}
                  className={`inline-flex items-center gap-1 text-sm font-medium ${pillar.index === 1 ? "text-indigo-600 hover:text-indigo-500" : pillar.index === 2 ? "text-emerald-600 hover:text-emerald-500" : "text-amber-600 hover:text-amber-500"} transition-colors`}
                >
                  Read full guide
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default function GuidePage() {
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
            <Link
              href="/guide"
              className="text-sm font-medium text-indigo-600"
            >
              Guide
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary text-xs px-4 py-2"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            The future of search is multi-engine
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl mx-auto leading-tight">
            SEO, GEO &amp; AEO —<br />
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              The Three Pillars of Search
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
            Search has fractured. Google still dominates, but AI assistants, voice search, and
            generative engines now capture more than half of all queries. Your business needs
            visibility across all of them — and aeo-app.io is built to deliver it.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn-primary text-base px-8 py-3">
              Analyze Your Website
            </Link>
            <Link href="#overview" className="btn-secondary text-base px-8 py-3">
              Learn More
            </Link>
          </div>

          {/* Overview cards */}
          <div className="mt-16" id="overview">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "SEO", label: "Traditional search", slug: "seo", color: "border-indigo-500/30 bg-indigo-500/5", text: "text-indigo-600" },
                { title: "GEO", label: "AI-generated answers", slug: "geo", color: "border-emerald-500/30 bg-emerald-500/5", text: "text-emerald-600" },
                { title: "AEO", label: "Voice & answer engines", slug: "aeo", color: "border-amber-500/30 bg-amber-500/5", text: "text-amber-600" },
              ].map((pill) => (
                <Link
                  key={pill.title}
                  href={`/guide/${pill.slug}`}
                  className={`card border-2 ${pill.color} px-6 py-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${pill.text} bg-white text-lg font-bold shadow-sm`}>
                      {pill.title[0]}
                    </span>
                    <div>
                      <p className={`text-sm font-bold ${pill.text}`}>{pill.title}</p>
                      <p className="text-xs text-slate-500">{pill.label}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="mt-24" id="seo">
        {pillars.map((pillar) => (
          <PillarSection key={pillar.title} pillar={pillar} />
        ))}
      </div>

      {/* Convergence */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 mt-8">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl tracking-tight">
              The Convergence
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              SEO, GEO, and AEO aren't competing disciplines — they're three sides of the same coin.
              A strategy that ignores any one of them leaves visibility on the table.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>
            <div className="relative grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Foundations",
                  items: ["Technical SEO", "Keyword research", "Content optimization", "Backlink authority"],
                },
                {
                  title: "AI Layer",
                  items: ["Structured data & schema", "Authoritative citations", "Factual clarity", "RAG-friendly content"],
                },
                {
                  title: "Answer Layer",
                  items: ["Question-targeted content", "Voice-optimized phrasing", "FAQ & Q&A structure", "Snippet-ready formatting"],
                },
              ].map((layer, i) => (
                <Link
                  key={layer.title}
                  href={i === 0 ? "/guide/seo" : i === 1 ? "/guide/geo" : "/guide/aeo"}
                  className="card px-6 py-8 text-center bg-white/5 backdrop-blur-sm border-slate-700 hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-bold text-white mb-4">{layer.title}</h3>
                  <ul className="space-y-2">
                    {layer.items.map((item) => (
                      <li key={item} className="text-sm text-slate-400 flex items-center justify-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-indigo-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              aeo-app.io is the only tool that analyzes your visibility across all three dimensions
              and gives you a unified action plan — not three separate reports.
            </p>
            <Link href="/" className="btn-primary text-base px-10 py-3">
              Start Your Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to see where you stand?
          </h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Enter your website and get a full competitive intelligence report — including SEO, GEO,
            and AEO analysis — in seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn-primary text-base px-8 py-3">
              Analyze Now
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-3">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between text-sm text-slate-400">
          <span>aeo-app.io — Competitive Intelligence &amp; SEO</span>
          <Link href="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
