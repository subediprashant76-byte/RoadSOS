import { T } from '../T';
import { Incident } from '../../hooks/useSimulation';

interface Props {
  incidents: Incident[];
  onClear: () => void;
}

const HIGH_RISK_ZONES = ['Kalanki Chowk', 'Koteshwor Intersection', 'Suryabinayak Highway', 'Kavre Bend', 'Nagdhunga Pass', 'Bhairahawa Ring Road'];

export function Dashboard({ incidents, onClear }: Props) {
  const today = incidents.filter(i => {
    const d = new Date(i.timestamp);
    const n = new Date();
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth();
  });

  const avgEta = today.length ? Math.round(today.reduce((a, b) => a + (b.eta || 6), 0) / today.length * 10) / 10 : 0;
  const zone = HIGH_RISK_ZONES[Math.floor(Date.now() / 3600000) % HIGH_RISK_ZONES.length];

  const statCards = [
    { icon:'🚨', en:'Total Accidents Today', np:'आजका कुल दुर्घटना', value: today.length, color:'var(--r)', dim:'rgba(255,28,53,.08)', border:'rgba(255,28,53,.2)' },
    { icon:'⏱', en:'Avg Response Time', np:'औसत प्रतिक्रिया समय', value: today.length ? `${avgEta}m` : '—', color:'var(--amber)', dim:'rgba(255,176,32,.08)', border:'rgba(255,176,32,.2)' },
    { icon:'📡', en:'Active Monitors', np:'सक्रिय निगरानीहरू', value: 1, color:'var(--green)', dim:'rgba(0,232,122,.08)', border:'rgba(0,232,122,.2)' },
    { icon:'⚠️', en:'High Risk Zone', np:'उच्च जोखिम क्षेत्र', value: zone, color:'var(--cyan)', dim:'rgba(0,212,255,.08)', border:'rgba(0,212,255,.2)' },
  ];

  return (
    <section id="dashboard" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:'2rem' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
              <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
              <T en="Incident Dashboard" np="घटना ड्यासबोर्ड" />
            </div>
            <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', lineHeight:1.1 }}>
              <T en="Incident Overview" np="घटना अवलोकन" />
            </h2>
          </div>
          {incidents.length > 0 && (
            <button onClick={onClear}
              style={{ padding:'8px 16px', borderRadius:8, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', fontFamily:'inherit', fontSize:'.82rem', cursor:'pointer', transition:'all .2s' }}
              data-testid="btn-clear-log"
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--r)'; e.currentTarget.style.color = 'var(--r)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
              🗑 <T en="Clear Log" np="लग खाली गर्नुहोस्" />
            </button>
          )}
        </div>

        {/* Stats cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2.5rem' }} className="stats-grid">
          {statCards.map((s, i) => (
            <div key={i} style={{ background:s.dim, border:`1px solid ${s.border}`, borderRadius:16, padding:'20px 24px' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize: typeof s.value === 'string' && s.value.length > 6 ? '.88rem' : '1.6rem', fontWeight:800, color:s.color, letterSpacing:'-.03em', lineHeight:1, marginBottom:4 }}>
                {s.value}
              </div>
              <div style={{ fontSize:'.7rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>
                <T en={s.en} np={s.np} />
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden' }}>
          <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:'.9rem', fontWeight:700, color:'var(--text)' }}>
              <T en="Incident Log" np="घटना लग" />
            </div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'.75rem', color:'var(--muted)' }}>
              {incidents.length} <T en="total" np="कुल" />
            </div>
          </div>
          {incidents.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:9, padding:'4rem', color:'var(--muted)', textAlign:'center' }}>
              <span style={{ fontSize:'2.5rem', opacity:.2 }}>📋</span>
              <p style={{ fontSize:'.88rem' }}>
                <T en="No incidents recorded yet. Run the simulator to generate data." np="अझै कुनै घटना रेकर्ड गरिएको छैन। डेटा उत्पन्न गर्न सिमुलेटर चलाउनुहोस्।" />
              </p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {[
                      { en:'ID', np:'ID' }, { en:'Time', np:'समय' }, { en:'Location', np:'स्थान' },
                      { en:'Confidence', np:'विश्वास' }, { en:'ETA', np:'ETA' }, { en:'Maps', np:'नक्सा' }, { en:'Status', np:'स्थिति' },
                    ].map(h => (
                      <th key={h.en} style={{ padding:'12px 16px', textAlign:'left', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--muted)' }}>
                        <T en={h.en} np={h.np} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc, i) => (
                    <tr key={inc.id || i} style={{ borderBottom:'1px solid var(--border)', transition:'background .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding:'12px 16px', fontFamily:'var(--font-mono)', fontSize:'.75rem', color:'var(--cyan)' }}>{inc.id || `ACC-${i}`}</td>
                      <td style={{ padding:'12px 16px', fontSize:'.82rem', color:'var(--muted)' }}>{new Date(inc.timestamp).toLocaleTimeString()}</td>
                      <td style={{ padding:'12px 16px', fontSize:'.82rem', color:'var(--text)' }}>{inc.place}</td>
                      <td style={{ padding:'12px 16px', fontSize:'.82rem', color:'var(--amber)', fontFamily:'var(--font-mono)' }}>{inc.confidence}%</td>
                      <td style={{ padding:'12px 16px', fontSize:'.82rem', color:'var(--muted)' }}>{inc.eta}m</td>
                      <td style={{ padding:'12px 16px' }}>
                        <a href={`https://www.google.com/maps?q=${inc.lat},${inc.lng}`} target="_blank" rel="noopener noreferrer" style={{ color:'var(--cyan)', fontSize:'.78rem' }}>
                          🗺 <T en="View ↗" np="हेर्नुहोस् ↗" />
                        </a>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(0,232,122,.08)', border:'1px solid rgba(0,232,122,.2)', color:'var(--green)', borderRadius:100, padding:'3px 10px', fontSize:'.68rem', fontWeight:700 }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} />
                          <T en="Sent" np="पठाइयो" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:860px){.stats-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:480px){.stats-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
