import { useState, useRef } from 'react';
import { Tick, Arrow, Caret, GoogleLogo, Sparkle } from './icons.jsx';
import ReportCard from './ReportCard.jsx';

const API = 'http://localhost:8000';

function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-info">
        <span className="ticker-info-dot" />
        <span>AI-search volume tracked today:</span>
        <span className="mono">$184.7m</span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="nav-wrap">
      <nav className="nav">
        <a href="#top" className="logo">
          <span className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 11.5L8 3l5 8.5M5 9h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="logo-text">aeo-app<span className="logo-dot">.ai</span></span>
        </a>
        <div className="nav-links">
          <a className="nav-link" href="#solutions">Products <Caret /></a>
          <a className="nav-link" href="#solutions">Solutions <Caret /></a>
          <a className="nav-link" href="#devs">Developers <Caret /></a>
          <a className="nav-link" href="#blog">Resources <Caret /></a>
          <a className="nav-link" href="#pricing">Pricing</a>
        </div>
        <div className="nav-cta">
          <a className="nav-link" href="#contact">Sign in</a>
          <a className="btn btn-ghost btn-sm" href="#contact">Contact sales</a>
          <a className="btn btn-dark btn-sm" href="#audit">Get started <Arrow size={12} /></a>
        </div>
      </nav>
    </div>
  );
}

export default function Hero() {
  const [url, setUrl] = useState('');
  const [stage, setStage] = useState('idle');
  const [report, setReport] = useState(null);
  const inputRef = useRef(null);

  const submit = async (e) => {
    e?.preventDefault();
    const v = url.trim();
    if (!v) { inputRef.current?.focus(); return; }
    setStage('scanning');
    try {
      const res = await fetch(`${API}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '', website: v, description: '' }),
      });
      if (!res.ok) throw new Error('Report generation failed');
      const data = await res.json();
      const host = v.replace(/^https?:\/\//, '').replace(/\/$/, '') || v;
      setReport({ host, pdfPath: data.pdf_path });
      setStage('report');
    } catch {
      setStage('error');
    }
  };

  return (
    <section className="hero-wrap" id="top">
      <div className="hero-mesh" />
      <div className="hero-mesh-grid" />
      <Ticker />
      <Nav />
      <div className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <Sparkle />
              <span>Introducing <span className="mono">v3.2</span> — now tracking ChatGPT 5 Atlas search</span>
              <Arrow size={12} />
            </div>
            <h1 className="hero-title">
              Visibility infrastructure to <em>grow your revenue.</em>
            </h1>
            <p className="hero-sub">
              Join millions of growth teams who use aeo-app to rank in the AI-search era.
              Measure your share of voice across 14 answer engines and ship the playbook
              to win those answers back.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary btn-lg" href="#audit">
                Start now <Arrow className="btn-arrow" size={13} />
              </a>
              <a className="btn btn-google btn-lg" href="#contact">
                <GoogleLogo /> Sign up with Google
              </a>
              <a className="btn btn-ghost btn-lg" href="#contact">Contact sales</a>
            </div>
          </div>

          <div className="hero-card">
            <ReportCard stage={stage} report={report} />
          </div>
        </div>
      </div>

      <div className="audit-pop" id="audit">
        <form onSubmit={submit} className="audit-row">
          <span className="audit-prefix">https://</span>
          <input
            ref={inputRef}
            className="audit-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="your-domain.com"
            spellCheck={false}
            autoCapitalize="off"
          />
          <button type="submit" className="btn btn-primary">
            Run full audit <span className="price-tag">$10</span>
          </button>
        </form>
        <div className="audit-meta">
          <span><Tick /> 47-page PDF in &lt; 4 min</span>
          <span><Tick /> 14 engines · 500 prompts</span>
          <span><Tick /> No card required</span>
        </div>
      </div>
      <div className="hero-mesh-fade" />
    </section>
  );
}
