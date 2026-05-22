"use client";

import Link from "next/link";

const focusAreas = [
  {
    title: "AI Visibility Analysis",
    description:
      "Determining whether your business is cited, recommended, or surfaced when users ask AI assistants questions relevant to your industry.",
    items: [
      "Query your business domain across ChatGPT, Perplexity, Copilot, and Google AI Overviews",
      "Detect if your brand name, domain, or products appear in AI-generated answers",
      "Track citation frequency and sentiment across multiple AI engines",
      "Measure Share of Voice — how often you appear vs. competitors in AI outputs",
    ],
  },
  {
    title: "Content & Structure Optimization",
    description:
      "AI engines retrieve answers differently than search engines. GEO requires content that is authoritative, citable, and RAG-friendly.",
    items: [
      "Optimize content for retrieval-augmented generation (RAG) pipelines",
      "Structure pages with clear factual statements AI systems can quote directly",
      "Build authoritative topical depth — AI favors comprehensive multi-page coverage over thin pages",
      "Implement FAQPage and QAPage schema to surface direct answers in AI snippets",
      "Create dedicated prompt-targeted landing pages for high-value AI queries",
    ],
  },
  {
    title: "Authority & Trust Signals",
    description:
      "AI engines prioritize sources with established credibility, recognized expertise, and verifiable claims.",
    items: [
      "Wikipedia and Wikidata presence — still the single strongest citation signal for AI engines",
      "External backlink quality and diversity from authoritative industry domains",
      "Expertise signals — author bios, credentials, published research, and industry recognition",
      "Factual consistency — AI cross-references multiple pages; contradictions reduce citation likelihood",
      "Brand mention volume across news, blogs, and industry publications",
    ],
  },
  {
    title: "Competitive GEO Benchmarking",
    description:
      "Understanding how your AI visibility compares to competitors — and where to close the gap.",
    items: [
      "Multi-engine visibility scorecard comparing your brand against up to 5 competitors",
      "Identify which competitors are cited most by AI and why",
      "Content gap analysis — topics competitors own in AI answers that you don't",
      "Prompt benchmarking — test 20+ industry prompts and map every brand that appears",
      "Track changes over time as AI engine training data and retrieval algorithms evolve",
    ],
  },
];

const signals = [
  { label: "Wikipedia presence", weight: "High", note: "Most cited source across all AI engines" },
  { label: "Structured data (schema)", weight: "High", note: "FAQ, Organization, Product, Article schemas" },
  { label: "Topical depth", weight: "Medium", note: "Multiple linked pages covering a subject comprehensively" },
  { label: "Factual clarity", weight: "Medium", note: "Clear, unambiguous statements AI can directly quote" },
  { label: "Domain authority", weight: "Medium", note: "Backlink profile and content trustworthiness" },
  { label: "Author credentials", weight: "Low", note: "Byline author bios with verifiable expertise" },
  { label: "Freshness", weight: "Low", note: "Regularly updated content signals ongoing relevance" },
];

export default function GeoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors">
              <span className="text-xs font-bold text-white">MP</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">aeo-app.io</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Live Tools
            </Link>
            <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Guide
            </Link>
            <span className="text-sm font-medium text-emerald-600">GEO</span>
            <Link href="/dashboard" className="btn-primary text-xs px-4 py-2">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-28">
          <div className="max-w-3xl">
            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200 transition-colors mb-6"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Guide
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pillar 2
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Generative Engine<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Optimization
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              The emerging discipline of optimizing your content so AI-powered search engines
              reference and recommend your business when generating answers. GEO ensures your
              brand is discoverable in the AI-driven search era.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative -mt-12 z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "400M+", label: "Weekly active ChatGPT users" },
              { value: "60%", label: "Of searches end without a click to the web" },
              { value: "2-3x", label: "Traffic boost for AI-cited businesses" },
            ].map((stat, i) => (
              <div key={i} className="card px-6 py-5 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
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
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What GEO Covers</h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            Four disciplines that determine your visibility in AI-generated search results.
          </p>
        </div>
        <div className="grid gap-6">
          {focusAreas.map((area, i) => (
            <div key={i} className="card-hover px-8 py-7">
              <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-600">
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
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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

      {/* GEO Signals */}
      <div className="bg-slate-50 border-y border-slate-200 mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">GEO Signal Weights</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">
              What AI engines prioritize when deciding whether to cite your content.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Signal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Weight</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {signals.map((s) => (
                  <tr key={s.label} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.label}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.weight === "High" ? "bg-emerald-50 text-emerald-700" :
                        s.weight === "Medium" ? "bg-amber-50 text-amber-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {s.weight}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Check your AI visibility
          </h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Find out if your business appears in AI assistant answers — and how you compare
            to competitors.
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
