import type { Competitor } from "@/lib/api";

interface Props {
  competitors: Competitor[];
}

export default function CompetitorResults({ competitors }: Props) {
  if (competitors.length === 0) {
    return (
      <div className="card px-6 py-10 text-center">
        <p className="text-slate-400 text-sm">No competitors found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Competitors
          <span className="ml-2 text-sm font-normal text-slate-400">({competitors.length})</span>
        </h2>
      </div>

      <div className="grid gap-3">
        {competitors.map((c, i) => (
          <div key={i} className="card-hover px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-xs font-bold text-indigo-600">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-slate-900 truncate">{c.name}</h3>
                </div>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{c.reason}</p>
              </div>
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  Visit →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
