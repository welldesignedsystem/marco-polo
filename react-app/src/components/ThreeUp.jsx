import { Arrow } from './icons.jsx';

export default function ThreeUp() {
  return (
    <section className="three-up">
      <div className="section">
        <div className="section-head">
          <div className="section-eyebrow"><span className="mono">04</span><span>Why aeo-app</span></div>
          <h2 className="section-title">
            We do the <em>boring infrastructure</em> so your team can ship.
          </h2>
        </div>
        <div className="three-up-grid">
          <article className="three-up-card">
            <h3>The only daily-refresh crawler</h3>
            <p>14 engines, 5 providers, 500 prompts per domain. Hourly on watchlist queries. Backed by a 99.98% uptime SLA.</p>
            <a href="#" className="three-up-link">Read the engineering deep-dive <Arrow size={12} /></a>
          </article>
          <article className="three-up-card">
            <h3>Built for AI-search teams</h3>
            <p>Citation tracking, share-of-voice, prompt clustering, content playbooks — every tool your team needs without stitching five vendors together.</p>
            <a href="#" className="three-up-link">See features <Arrow size={12} /></a>
          </article>
          <article className="three-up-card">
            <h3>Ships data where you work</h3>
            <p>Slack alerts, Notion briefs, Postgres mirror, REST + GraphQL APIs, webhook firehose. Stop copying numbers between spreadsheets.</p>
            <a href="#" className="three-up-link">Integrations <Arrow size={12} /></a>
          </article>
        </div>
      </div>
    </section>
  );
}
