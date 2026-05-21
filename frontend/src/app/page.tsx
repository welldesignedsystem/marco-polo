"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import BusinessProfile from "@/components/BusinessProfile";
import CompetitorResults from "@/components/CompetitorResults";
import KeywordResults from "@/components/KeywordResults";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import { analyze, type BusinessProfile as BP, type Competitor, type SearchKeyword, type AnalysisType } from "@/lib/api";

interface Result {
  type: AnalysisType;
  profile: BP;
  competitors?: Competitor[];
  keywords?: SearchKeyword[];
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async ({
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
      <div className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-3xl px-4 pt-16 pb-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <span className="text-xl font-bold text-white">MP</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Marco Polo
          </h1>
          <p className="mt-3 text-lg text-slate-500 max-w-lg mx-auto">
            Competitive intelligence and SEO keyword generation. Enter a website to discover who else is playing in the same space.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 -mt-6">
        {/* Search Card */}
        <div className="card px-6 py-6">
          <SearchForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8">
            <LoadingSkeleton />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-8">
            <ErrorState message={error} onRetry={() => setError(null)} />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="mt-8 space-y-8">
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
    </main>
  );
}
