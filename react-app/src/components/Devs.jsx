import { Arrow } from './icons.jsx';

const INTEGRATIONS = [
  { name: 'Slack',     bg: '#4a154b', fg: '#ecb22e', mark: '#' },
  { name: 'Notion',    bg: '#ffffff', fg: '#0a2540', mark: 'N' },
  { name: 'HubSpot',   bg: '#ff7a59', fg: 'white',   mark: 'H' },
  { name: 'Webflow',   bg: '#146ef5', fg: 'white',   mark: 'W' },
  { name: 'Salesforce',bg: '#00a1e0', fg: 'white',   mark: 'SF' },
  { name: 'Segment',   bg: '#52bd95', fg: 'white',   mark: 'Sg' },
  { name: 'Linear',    bg: '#5e6ad2', fg: 'white',   mark: 'L' },
  { name: 'Zapier',    bg: '#ff4a00', fg: 'white',   mark: 'Z' },
  { name: 'Postgres',  bg: '#336791', fg: 'white',   mark: 'P' },
  { name: 'BigQuery',  bg: '#4285f4', fg: 'white',   mark: 'BQ' },
  { name: 'Snowflake', bg: '#29b5e8', fg: 'white',   mark: '❄' },
  { name: 'Webhook',   bg: '#0a2540', fg: '#06d6a0', mark: '{}' }
];

export default function Devs() {
  return (
    <section className="section" id="devs">
      <div className="section-head">
        <div className="section-eyebrow"><span className="mono">07</span><span>Developers</span></div>
        <h2 className="section-title">Plays nice with the stack you <em>already run.</em></h2>
        <p className="section-sub">
          Push visibility data into your warehouse. Alert your team in Slack. Brief your writers in
          Notion. Or skip the middleware and query our REST and GraphQL APIs directly.
        </p>
      </div>
      <div className="devs-grid">
        <article className="devs-col">
          <h3>Build with our API</h3>
          <p>REST + GraphQL. Webhooks for every rank change. SDKs for Node, Python, and Go. Built to be the spine of your AI-search ops stack.</p>
          <a href="#" className="bento-link">Read API reference <Arrow size={13} /></a>
          <div className="devs-stats">
            <div><div className="devs-stat-v">184ms</div><div className="devs-stat-l">p50 latency</div></div>
            <div><div className="devs-stat-v">99.99%</div><div className="devs-stat-l">Uptime SLA</div></div>
            <div><div className="devs-stat-v">12k</div><div className="devs-stat-l">QPS sustained</div></div>
          </div>
        </article>
        <article className="devs-col">
          <h3>Ship to where your team works</h3>
          <p>Slack, Notion, Linear, HubSpot, Salesforce, Segment, plus Postgres logical replication for the firehose. 30+ destinations, zero glue code.</p>
          <a href="#" className="bento-link">All integrations <Arrow size={13} /></a>
          <div className="devs-stats">
            <div><div className="devs-stat-v">30+</div><div className="devs-stat-l">Integrations</div></div>
            <div><div className="devs-stat-v">Real-time</div><div className="devs-stat-l">Streaming sync</div></div>
            <div><div className="devs-stat-v">3</div><div className="devs-stat-l">Official SDKs</div></div>
          </div>
        </article>
      </div>
      <div className="integ-grid">
        {INTEGRATIONS.map((it) => (
          <div className="integ" key={it.name}>
            <div className="integ-mark" style={{ background: it.bg, color: it.fg }}>{it.mark}</div>
            <div className="integ-name">{it.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
