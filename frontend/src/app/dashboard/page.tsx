"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "report", label: "Free Report", icon: "📋" },
  { id: "competitors", label: "Find Competitors", icon: "🏢" },
  { id: "keywords", label: "Generate Keywords", icon: "🔑" },
];

const tabContent: Record<Tab, { title: string; description: string }> = {
  report: {
    title: "Free SEO/GEO/AEO Report",
    description: "Enter a website to receive a comprehensive analysis delivered to your email.",
  },
  competitors: {
    title: "Find Competitors",
    description: "Discover who your real competitors are based on your website profile.",
  },
  keywords: {
    title: "Generate Keywords",
    description: "Uncover high-value SEO keywords tailored to your business.",
  },
};

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

  const currentTab = tabContent[tab];

  return (
    <div className="min-h-screen bg-slate-50">
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
            <span className="text-sm text-slate-400">{user.email}</span>
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

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Dashboard
              </p>
              <h1 className="text-2xl font-bold text-white mt-1 sm:text-3xl">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Analyze websites, find competitors, and generate SEO keywords.
              </p>
            </div>
          </div>

          {/* Tab pills */}
          <div className="mt-8 flex gap-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setResult(null); setError(null); }}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  tab === t.id
                    ? "bg-white text-slate-900 shadow-lg"
                    : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                }`}
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">{currentTab.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{currentTab.description}</p>
        </div>

        {tab === "report" && (
          <div className="card px-6 py-6">
            <ReportRequest />
          </div>
        )}

        {(tab === "competitors" || tab === "keywords") && (
          <div className="space-y-8">
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
