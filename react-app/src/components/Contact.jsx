import { useState } from 'react';
import { Tick, Arrow } from './icons.jsx';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ name: '', email: '', site: '', team: '1–5' });
  const submit = (e) => {
    e.preventDefault();
    if (!data.email) return;
    setSent(true);
  };
  return (
    <section className="cta-wrap" id="contact">
      <div className="cta-grid">
        <div>
          <div className="section-eyebrow"><span className="mono">09</span><span>Start your trial</span></div>
          <h2 className="cta-title">
            Ready to rank where the answers <em>actually live?</em>
          </h2>
          <p className="cta-sub">
            14 days. Full Premium plan. No card. We'll spin up your workspace, ingest your top three
            competitors, and send a calendar invite for a 20-minute walkthrough.
          </p>
          <ul className="cta-list">
            <li><Tick /> Full Premium plan, 14 days · everything unlocked</li>
            <li><Tick /> Includes your free $10 audit credit</li>
            <li><Tick /> Cancel from in-app, no email loop</li>
          </ul>
          <div className="cta-actions">
            <a className="btn btn-dark btn-lg" href="#audit">Start free trial <Arrow className="btn-arrow" size={13} /></a>
            <a className="btn btn-ghost btn-lg" href="#">Talk to sales</a>
          </div>
        </div>
        <form className="cta-form" onSubmit={submit}>
          {sent ? (
            <div className="cta-sent">
              <div className="cta-sent-mark"><Tick /></div>
              <h3>You're in.</h3>
              <p>Workspace <span className="mono">{data.site || 'your-domain.com'}</span> spinning up. Check {data.email} in the next 90 seconds.</p>
              <button className="btn btn-ghost" type="button" onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <>
              <h3>Get started in 90 seconds</h3>
              <div className="field"><label>Work email</label>
                <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="you@company.com" /></div>
              <div className="field"><label>Full name</label>
                <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Hannah Lo" /></div>
              <div className="field"><label>Site to audit</label>
                <input value={data.site} onChange={(e) => setData({ ...data, site: e.target.value })} placeholder="company.com" /></div>
              <div className="field"><label>Team size</label>
                <div className="seg">
                  {['1–5', '6–25', '26–100', '100+'].map((t) => (
                    <button type="button" key={t} className={data.team === t ? 'on' : ''} onClick={() => setData({ ...data, team: t })}>{t}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                Start free trial <Arrow className="btn-arrow" size={13} />
              </button>
              <div className="cta-fine">
                By starting a trial you agree to our <a href="#">terms</a> and <a href="#">privacy policy</a>.
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
