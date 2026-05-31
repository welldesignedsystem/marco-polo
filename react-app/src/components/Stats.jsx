export default function Stats() {
  return (
    <section className="stats">
      <div className="stats-inner">
        <div className="stats-head">
          <div>
            <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <span className="mono">01</span>
              <span>By the numbers</span>
            </div>
            <h2 className="section-title">
              The world's growth teams <em>trust aeo-app</em> for AI visibility.
            </h2>
          </div>
          <p className="section-sub">
            We measure the prompts your buyers actually type, on the engines they actually use —
            from ChatGPT and Perplexity to Google AI Overviews and 11 more — every day.
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value"><em>14</em>+</div>
            <div className="stat-label">Answer engines monitored, daily refresh, hourly on watchlist.</div>
          </div>
          <div className="stat">
            <div className="stat-value">$<em>184</em><span className="stat-unit">m</span></div>
            <div className="stat-label">Pipeline driven by AI-search citations, across our cohort in 2025.</div>
          </div>
          <div className="stat">
            <div className="stat-value"><em>99.98</em>%</div>
            <div className="stat-label">Crawler uptime over the trailing 12 months — alerting included.</div>
          </div>
          <div className="stat">
            <div className="stat-value"><em>2.4</em>k+</div>
            <div className="stat-label">Domains ranked weekly. From single-founder DTC to public fintech.</div>
          </div>
        </div>
        <div className="stats-viz" />
      </div>
    </section>
  );
}
