"use client";

import { useState, type FormEvent } from "react";
import type { AnalysisType } from "@/lib/api";

interface Props {
  onSubmit: (data: {
    website: string;
    searchFocus: string;
    maxResults: number;
    type: AnalysisType;
  }) => void;
  loading: boolean;
}

export default function SearchForm({ onSubmit, loading }: Props) {
  const [website, setWebsite] = useState("");
  const [searchFocus, setSearchFocus] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [type, setType] = useState<AnalysisType>("competitors");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!website.trim()) return;
    onSubmit({ website: website.trim(), searchFocus: searchFocus.trim(), maxResults, type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setType("competitors")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
            type === "competitors"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Find Competitors
        </button>
        <button
          type="button"
          onClick={() => setType("keywords")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
            type === "keywords"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Generate Keywords
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1.5">
            Website URL
          </label>
          <input
            id="website"
            type="text"
            placeholder="example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="focus" className="block text-sm font-medium text-slate-700 mb-1.5">
            Search Focus <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="focus"
            type="text"
            placeholder='e.g., "enterprise SaaS" or "organic skincare"'
            value={searchFocus}
            onChange={(e) => setSearchFocus(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="results" className="block text-sm font-medium text-slate-700 mb-1.5">
            Max Results: <span className="text-indigo-600 font-semibold">{maxResults}</span>
          </label>
          <input
            id="results"
            type="range"
            min={1}
            max={50}
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1</span>
            <span>50</span>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading || !website.trim()} className="btn-primary w-full">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing…
          </>
        ) : type === "competitors" ? (
          "Find Competitors"
        ) : (
          "Generate Keywords"
        )}
      </button>
    </form>
  );
}
