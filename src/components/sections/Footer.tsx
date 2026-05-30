import { T } from '../T';

const cols = [
  {
    en: 'Product', np: 'उत्पादन',
    links: [
      { en:'How It Works', np:'कसरी काम गर्छ', href:'#how-it-works' },
      { en:'Simulator', np:'सिमुलेटर', href:'#simulate' },
      { en:'Training', np:'तालिम', href:'#training' },
      { en:'Features', np:'विशेषताहरू', href:'#features' },
    ],
  },
  {
    en: 'Company', np: 'कम्पनी',
    links: [
      { en:'About', np:'बारेमा', href:'#' },
      { en:'Team', np:'टोली', href:'#' },
      { en:'Blog', np:'ब्लग', href:'#' },
    ],
  },
  {
    en: 'Legal', np: 'कानूनी',
    links: [
      { en:'Privacy', np:'गोपनीयता', href:'#' },
      { en:'Terms', np:'सर्तहरू', href:'#' },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--border)', padding:'clamp(3rem,6vw,5rem) clamp(1rem,5vw,4rem) 2rem', background:'var(--card-bg)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.7fr 1fr 1fr 1fr', gap:'2.5rem', marginBottom:'3.5rem' }} className="footer-grid">
          <div>
            <div style={{ fontSize:'1.15rem', fontWeight:900, marginBottom:12 }}>
              Road<span style={{ color:'var(--r)' }}>SoS</span>
            </div>
            <p style={{ fontSize:'.83rem', color:'var(--muted)', lineHeight:1.7, maxWidth:270 }}>
              <T
                en="AI-powered accident detection and emergency response. Because every second on the road matters."
                np="AI-संचालित दुर्घटना पहिचान र आपतकालीन प्रतिक्रिया। किनभने सडकमा हर सेकेन्ड महत्त्वपूर्ण छ।"
              />
            </p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:12 }}>
                <T en={col.en} np={col.np} />
              </h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a href={l.href} style={{ color:'var(--muted)', fontSize:'.83rem', transition:'color .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                      <T en={l.en} np={l.np} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <p style={{ fontSize:'.75rem', color:'var(--muted)' }}>
            © 2026 RoadSoS. <T en="All rights reserved." np="सर्वाधिकार सुरक्षित।" />
          </p>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,28,53,.08)', border:'1px solid rgba(255,28,53,.15)', color:'rgba(255,100,120,.9)', padding:'5px 14px', borderRadius:100, fontSize:'.7rem', fontWeight:700 }}>
            🏆 <T en="National Road Safety Hackathon 2026" np="राष्ट्रिय सडक सुरक्षा ह्याकाथन २०२६" />
          </span>
        </div>
      </div>
      <style>{`@media(max-width:800px){.footer-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:480px){.footer-grid{grid-template-columns:1fr !important;}}`}</style>
    </footer>
  );
}
