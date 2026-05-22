"use client";

import { useState, type FormEvent } from "react";
import { requestReport } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function ReportRequest() {
  const user = getUser();
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!website.trim() || !user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await requestReport({
        email: user.email,
        website: website.trim(),
        description: description.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="card px-6 py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Report requested</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          We&apos;ll run a detailed SEO/GEO/AEO analysis and email the full report to <strong>{user?.email}</strong> once it&apos;s ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="report-website" className="block text-sm font-medium text-slate-700 mb-1.5">
          Website to Analyze
        </label>
        <input
          id="report-website"
          type="text"
          placeholder="example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="input-field"
          required
        />
      </div>
      <div>
        <label htmlFor="report-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
          Additional Context <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="report-desc"
          rows={3}
          placeholder="Any specific areas you'd like the report to focus on…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field resize-none"
        />
      </div>

      <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
        Your report will include an in-depth analysis of SEO, GEO (Generative Engine Optimization),
        and AEO (Answer Engine Optimization) with actionable recommendations.
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <button type="submit" disabled={loading || !website.trim()} className="btn-primary w-full">
        {loading ? "Requesting…" : "Request Free Report"}
      </button>
    </form>
  );
}
