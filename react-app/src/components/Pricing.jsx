import { useState } from 'react';
import { Tick, Arrow } from './icons.jsx';

const PLANS = [
  {
    id: 'basic', name: 'Basic',
    blurb: 'For solo operators ranking a single site.',
    monthly: 49, annual: 39,
    features: [
      '1 domain · 100 tracked prompts',
      'Weekly refresh on 3 engines',
      'PDF audit + briefs',
      'Email support'
    ]
  },
  {
    id: 'premium', name: 'Premium',
    blurb: 'For marketing teams shipping content weekly.',
    monthly: 249, annual: 199,
    features: [
      '5 domains · 500 prompts each',
      'Daily refresh on all 14 engines',
      'Competitor benchmarking (3 rivals)',
      'Slack alerts + Notion sync',
      'Priority support · 4h SLA'
    ],
    highlight: true
  },
  {
    id: 'platinum', name: 'Platinum',
    blurb: 'For agencies and multi-brand portfolios.',
    monthly: 899, annual: 749,
    features: [
      'Unlimited domains · 2,000 prompts each',
      'Real-time streaming refresh',
      'Unlimited competitors',
      'White-label PDFs + client portal',
      'Postgres mirror + webhook firehose',
      'Dedicated strategist · 1h SLA'
    ]
  }
];

export default function Pricing() {
  const [cycle, setCycle] = useState('annual');
  return (
    <section className="section" id="pricing">
      <div className="pricing-head">
        <div className="section-eyebrow"><span className="mono">05</span><span>Pricing</span></div>
        <h2 className="section-title">
          Predictable pricing for <em>every team size.</em>
        </h2>
        <p className="section-sub" style={{ margin: '20px auto 0', textAlign: 'center' }}>
          Start at $49/mo, scale to enterprise. No prompt overage fees. Cancel anytime.
        </p>
        <div className="cycle">
          <button className={cycle === 'monthly' ? 'on' : ''} onClick={() => setCycle('monthly')}>Monthly</button>
          <button className={cycle === 'annual' ? 'on' : ''} onClick={() => setCycle('annual')}>
            Annual <span className="cycle-save">−20%</span>
          </button>
        </div>
      </div>

      <div className="plans">
        {PLANS.map((p) => (
          <article className={`plan ${p.highlight ? 'plan-hi' : ''}`} key={p.id}>
            {p.highlight && <span className="plan-badge">Most popular</span>}
            <div className="plan-name">{p.name}</div>
            <div className="plan-blurb">{p.blurb}</div>
            <div className="plan-price">
              <span className="plan-currency">$</span>
              <span className="plan-amount">{cycle === 'annual' ? p.annual : p.monthly}</span>
              <span className="plan-period">/ mo</span>
            </div>
            <div className="plan-cycle">{cycle === 'annual' ? 'billed annually' : 'billed monthly'}</div>
            <ul className="plan-feats">
              {p.features.map((f) => <li key={f}><Tick /> <span>{f}</span></li>)}
            </ul>
            <a className={`btn ${p.highlight ? 'btn-primary' : 'btn-ghost'} btn-lg`} href="#contact" style={{ justifyContent: 'center' }}>
              Start 14-day trial <Arrow className="btn-arrow" size={13} />
            </a>
          </article>
        ))}
      </div>

      <div className="plans-foot">
        Need SSO, SOC2, on-prem or volume pricing? <a href="#contact">Talk to sales →</a>
      </div>
    </section>
  );
}
