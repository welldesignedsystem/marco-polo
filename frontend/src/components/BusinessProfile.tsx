import type { BusinessProfile as BP } from "@/lib/api";

interface Props {
  profile: BP;
}

export default function BusinessProfile({ profile }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Business Profile
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-1">{profile.company_name}</h2>
        <p className="text-sm text-slate-500">{profile.business_domain}</p>
      </div>

      <div className="px-6 py-5 space-y-5">
        <Section label="Industry Terms">
          <div className="flex flex-wrap gap-1.5">
            {profile.industry_terms.map((t) => (
              <span key={t} className="badge-primary">
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Customer Segments">
          <div className="flex flex-wrap gap-1.5">
            {profile.customer_segments.map((s) => (
              <span key={s} className="badge-emerald">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Geographic Focus">
          <div className="flex flex-wrap gap-1.5">
            {profile.geographic_focus.map((g) => (
              <span key={g} className="badge-amber">
                {g}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Evidence">
          <ul className="space-y-1.5">
            {profile.evidence.map((e, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                {e}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}
