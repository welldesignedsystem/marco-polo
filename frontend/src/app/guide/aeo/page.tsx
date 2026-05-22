"use client";

import Link from "next/link";

const focusAreas = [
  {
    title: "Snippet & Position Zero Targeting",
    description:
      "Optimizing your content to appear in Google's featured snippets, People Also Ask boxes, and knowledge panels — the most visible positions in search.",
    items: [
      "Identify every query where a featured snippet exists and your site could compete",
      "Structure content with clear, concise answers to specific questions (40-60 words ideal)",
      "Optimize for list, table, paragraph, and video snippet formats based on query intent",
      "Target People Also Ask expansion opportunities — each PAA box links to more questions",
      "Track snippet win/loss against competitors and monitor churn",
    ],
  },
  {
    title: "Voice Search Optimization",
    description:
      "With 20%+ of mobile searches now voice-driven, your content must be structured for spoken responses across Siri, Google Assistant, and Alexa.",
    items: [
      "Optimize for conversational long-tail queries users speak vs. type",
      "Structure answers as direct, standalone responses AI assistants read aloud",
      "Target question phrases — who, what, where, when, why, how — with dedicated sections",
      "Ensure local business info (name, address, phone, hours) is voice-searchable",
      "Schema markup for LocalBusiness, FAQ, and Q&A to increase voice-readiness",
    ],
  },
  {
    title: "FAQ & Structured Data",
    description:
      "Schema markup is the language AI systems use to understand and extract your content for answer surfaces.",
    items: [
      "Implement FAQPage schema on every page with question-answer content",
      "Add QAPage schema for forums, knowledge base, and community Q&A sections",
      "Use HowTo schema for instructional content to appear in step-by-step voice responses",
      "Apply Speakable schema to mark content specifically optimized for voice assistants",
      "Validate all structured data with Google's Rich Results Test and Schema.org validator",
    ],
  },
  {
    title: "AI Assistant Readiness",
    description:
      "Beyond Google, your content must be structured for discovery by ChatGPT, Copilot, Siri, and other conversational AI systems.",
    items: [
      "Create concise, quotable definitions and explainers AI systems can cite verbatim",
      "Build comprehensive FAQ sections that cover the full question space for your topic",
      "Publish authoritative, well-structured content with clear headings AI can parse",
      "Include data, statistics, and verifiable claims — AI favors citable factual content",
      "Monitor AI assistant responses for your brand and iterate on content gaps",
    ],
  },
];

const snippetTypes = [
  { type: "Paragraph", description: "Direct answer to a question in a concise paragraph", bestFor: "\"What is...\" \"How does...\" queries", share: "55%" },
  { type: "List", description: "Bulleted or numbered list of items, steps, or rankings", bestFor: "\"Steps to...\" \"Top reasons...\" queries", share: "30%" },
  { type: "Table", description: "Structured data presented in a table format", bestFor: "Comparisons, specifications, pricing", share: "10%" },
  { type: "Video", description: "Timed video clip with a specific timestamp", bestFor: "Tutorial, how-to, demonstration queries", share: "5%" },
];

export default function AeoPage() {
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
            <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Guide
            </Link>
            <span className="text-sm font-medium text-amber-600">AEO</span>
            <Link href="/dashboard" className="btn-primary text-xs px-4 py-2">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-28">
          <div className="max-w-3xl">
            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 text-sm text-amber-300 hover:text-amber-200 transition-colors mb-6"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Guide
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Pillar 3
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Answer Engine<br />
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                Optimization
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              The practice of structuring your content to appear as direct answers in voice search
              results, featured snippets, Google's People Also Ask boxes, and AI assistant responses.
              AEO captures traffic before users even click a link.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative -mt-12 z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "8-10%", label: "Of all clicks go to featured snippets" },
              { value: "20%+", label: "Of mobile searches are voice-driven" },
              { value: "3x", label: "Higher cross-platform citation rate for AEO content" },
            ].map((stat, i) => (
              <div key={i} className="card px-6 py-5 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
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
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What AEO Covers</h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            Four disciplines that put your content in position zero and beyond.
          </p>
        </div>
        <div className="grid gap-6">
          {focusAreas.map((area, i) => (
            <div key={i} className="card-hover px-8 py-7">
              <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-600">
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
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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

      {/* Snippet Types */}
      <div className="bg-slate-50 border-y border-slate-200 mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Featured Snippet Formats</h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">
              Each format requires a different content structure and optimization strategy.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Format</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Best For</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {snippetTypes.map((s) => (
                  <tr key={s.type} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{s.description}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{s.bestFor}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        {s.share}
                      </span>
                    </td>
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
            Capture position zero
          </h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Find out which snippet opportunities your competitors are capturing — and how to
            claim them for yourself.
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
