import type { SearchKeyword } from "@/lib/api";

interface Props {
  keywords: SearchKeyword[];
}

const intentConfig: Record<string, { label: string; className: string }> = {
  informational: { label: "Info", className: "badge-primary" },
  commercial: { label: "Commercial", className: "badge-amber" },
  transactional: { label: "Transactional", className: "badge-emerald" },
  navigational: { label: "Navigational", className: "badge" },
};

const volumeConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-emerald-50 text-emerald-700" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700" },
  low: { label: "Low", className: "bg-slate-100 text-slate-500" },
};

export default function KeywordResults({ keywords }: Props) {
  if (keywords.length === 0) {
    return (
      <div className="card px-6 py-10 text-center">
        <p className="text-slate-400 text-sm">No keywords generated.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Keywords
          <span className="ml-2 text-sm font-normal text-slate-400">({keywords.length})</span>
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Keyword
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Volume
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Intent
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {keywords.map((k, i) => (
              <tr key={i} className="transition-colors hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <code className="text-sm font-medium text-indigo-700">{k.keyword}</code>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${volumeConfig[k.search_volume_estimate]?.className ?? "bg-slate-100 text-slate-500"}`}>
                    {volumeConfig[k.search_volume_estimate]?.label ?? k.search_volume_estimate}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={intentConfig[k.intent]?.className ?? "badge"}>
                    {intentConfig[k.intent]?.label ?? k.intent}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500 max-w-xs">
                  {k.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
