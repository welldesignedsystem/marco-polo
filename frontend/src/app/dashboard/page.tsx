"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, clearUser, type User } from "@/lib/auth";
import ReportRequest from "@/components/ReportRequest";
import SearchForm from "@/components/SearchForm";
import BusinessProfile from "@/components/BusinessProfile";
import CompetitorResults from "@/components/CompetitorResults";
import KeywordResults from "@/components/KeywordResults";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import { analyze, type BusinessProfile as BP, type Competitor, type SearchKeyword, type AnalysisType } from "@/lib/api";

type Tab = "report" | "competitors" | "keywords";

interface AnalysisResult {
  type: AnalysisType;
  profile: BP;
  competitors?: Competitor[];
  keywords?: SearchKeyword[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("report");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/");
      return;
    }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

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

  if (!user) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "report", label: "Free Report" },
    { id: "competitors", label: "Find Competitors" },
    { id: "keywords", label: "Generate Keywords" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-xs font-bold text-white">aa</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">aeo-app.io</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setResult(null); setError(null); }}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {tab === "report" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Free SEO/GEO/AEO Report</h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter a website to receive a comprehensive analysis delivered to your email.
              </p>
            </div>
            <ReportRequest />
          </div>
        )}

        {(tab === "competitors" || tab === "keywords") && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {tab === "competitors" ? "Find Competitors" : "Generate Keywords"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {tab === "competitors"
                  ? "Discover who your real competitors are based on your website profile."
                  : "Uncover high-value SEO keywords tailored to your business."}
              </p>
            </div>

            <div className="card px-6 py-6">
              <SearchForm
                onSubmit={(data) => handleAnalyze({ ...data, type: tab })}
                loading={loading}
              />
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
        )}
      </div>
    </div>
  );
}
