"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegistrationForm from "@/components/RegistrationForm";
import SearchForm from "@/components/SearchForm";
import BusinessProfile from "@/components/BusinessProfile";
import CompetitorResults from "@/components/CompetitorResults";
import KeywordResults from "@/components/KeywordResults";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import { isRegistered } from "@/lib/auth";
import {
  analyze,
  type AnalysisType,
  type BusinessProfile as BP,
  type Competitor,
  type SearchKeyword,
} from "@/lib/api";

interface AnalysisResult {
  type: AnalysisType;
  profile: BP;
  competitors?: Competitor[];
  keywords?: SearchKeyword[];
}

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isRegistered()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleAnalyze = async ({
    website,
    searchFocus,
    maxResults,
    type,
  }: {
    website: string;
    searchFocus: string;
    maxResults: number;
    type: AnalysisType;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyze(type, {
        website,
        search_focus: searchFocus,
        max_results: maxResults,
      });
      setResult({
        type,
        profile: data.profile,
        ...(type === "competitors"
          ? { competitors: data.result as Competitor[] }
          : { keywords: data.result as SearchKeyword[] }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Free SEO/GEO/AEO Audit
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Know exactly how your website performs
              </h1>
              <p className="mt-4 text-lg text-slate-300 max-w-xl">
                Get a detailed, actionable report on your website&apos;s search visibility — covering
                traditional SEO, Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO).
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300 border border-white/10">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  SEO
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300 border border-white/10">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  GEO
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300 border border-white/10">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  AEO
                </span>
              </div>
            </div>

            {/* Registration card */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">Get your free report</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your details and we&apos;ll send the full analysis to your inbox.
              </p>
              <div className="mt-6">
                <RegistrationForm onSuccess={() => router.push("/dashboard")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live tools */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Live preview
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              See competitors and keywords before you register
            </h2>
            <p className="mt-3 text-slate-500">
              Run a quick website analysis from the main page. Choose competitors or keywords,
              then use the full dashboard when you want to keep going.
            </p>
          </div>

          <div className="space-y-6">
            <div className="card px-6 py-6">
              <SearchForm onSubmit={handleAnalyze} loading={loading} />
            </div>

            {loading && <LoadingSkeleton />}
            {error && !loading && <ErrorState message={error} onRetry={() => setError(null)} />}

            {result && !loading && (
              <div className="space-y-8">
                <BusinessProfile profile={result.profile} />
                {result.type === "competitors" && result.competitors && (
                  <CompetitorResults competitors={result.competitors} />
                )}
                {result.type === "keywords" && result.keywords && (
                  <KeywordResults keywords={result.keywords} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              What&apos;s inside your report
            </h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">
              Three dimensions of analysis to give you a complete picture of your website&apos;s search performance.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="card-hover px-6 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">SEO</h3>
              <p className="mt-2 text-sm text-slate-500">
                Technical SEO audit, on-page optimization, backlink analysis, and keyword gap assessment.
              </p>
            </div>
            <div className="card-hover px-6 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">GEO</h3>
              <p className="mt-2 text-sm text-slate-500">
                Generative Engine Optimization — how your content appears in AI-generated search answers and chatbot responses.
              </p>
            </div>
            <div className="card-hover px-6 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">AEO</h3>
              <p className="mt-2 text-sm text-slate-500">
                Answer Engine Optimization — how well your site answers user questions in voice search, snippets, and Q&A surfaces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-sm text-slate-400">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to dashboard →
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
