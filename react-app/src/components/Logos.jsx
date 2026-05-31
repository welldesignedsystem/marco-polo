export default function Logos() {
  const items = ['Northbeam','Mercury','Ramp','Vercel','Notion','Cradlewise','Linear-ish','Webflow-ish'];
  return (
    <div className="logos-band">
      <div className="logos-label">2,400+ growth teams rank where the answers live</div>
      <div className="logos-strip">
        {items.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
