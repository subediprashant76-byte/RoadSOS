import { useState, useRef, useCallback, useEffect } from 'react';
import { T } from '../T';
import { Incident } from '../../hooks/useSimulation';
import { playSOSBeep } from '../../sounds';

const GPS_POOL = [
  { lat:27.7172, lng:85.3240, place:'Ratna Park, Kathmandu' },
  { lat:27.6966, lng:85.3591, place:'Koteshwor, Kathmandu' },
  { lat:27.7326, lng:85.2976, place:'Balaju, Kathmandu' },
  { lat:27.6784, lng:85.3136, place:'Lagankhel, Lalitpur' },
  { lat:27.7480, lng:85.3467, place:'Gongabu, Kathmandu' },
];

const STEPS = [
  { en: '🔴 Detecting impact...', np: '🔴 प्रभाव पत्ता लगाउँदै...', sub_en: 'Impact sensors triggered', sub_np: 'प्रभाव सेन्सरहरू सक्रिय' },
  { en: '🧠 Analyzing sensor data...', np: '🧠 सेन्सर डेटा विश्लेषण गर्दै...', sub_en: 'Processing accelerometer + gyroscope', sub_np: 'एक्सेलेरोमिटर + जाइरोस्कोप प्रशोधन' },
  { en: '🤖 AI confirming accident...', np: '🤖 AI ले दुर्घटना पुष्टि गर्दै...', sub_en: 'Running edge ML model', sub_np: 'एज ML मोडेल चलाउँदै' },
  { en: '📡 Sending SOS...', np: '📡 SOS पठाउँदै...', sub_en: 'Contacting emergency services', sub_np: 'आपतकालीन सेवाहरूमा सम्पर्क गर्दै' },
];

interface Props {
  contacts: { name: string }[];
  onIncident: (inc: Omit<Incident, 'id'>) => void;
  addToast: (t: { title: string; description?: string; type?: 'success'|'error'|'warning'|'default' }) => void;
}

export function Simulation({ contacts, onIncident, addToast }: Props) {
  const [phase, setPhase] = useState<'idle'|'running'|'done'>('idle');
  const [stepIdx, setStepIdx] = useState(-1);
  const [confidence, setConfidence] = useState(0);
  const [result, setResult] = useState<{ gps: typeof GPS_POOL[0]; eta: number; ts: string } | null>(null);
  const [logEntries, setLogEntries] = useState<Incident[]>(() => {
    try { return JSON.parse(localStorage.getItem('rsos_incidents') || '[]'); } catch { return []; }
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  const doDispatch = useCallback((gps: typeof GPS_POOL[0], conf: number) => {
    const eta = Math.floor(Math.random() * 8) + 3;
    const ts = new Date().toLocaleTimeString();
    setResult({ gps, eta, ts });
    setPhase('done');
    const inc: Omit<Incident,'id'> = { timestamp: Date.now(), place: gps.place, lat: gps.lat, lng: gps.lng, confidence: conf, eta, contacts: contacts.map(c => c.name) };
    onIncident(inc);
    setLogEntries(prev => [{ ...inc, id: 'ACC-' + String(Date.now()).slice(-7) }, ...prev]);
    addToast({ title: 'SOS dispatched to all contacts!', type: 'success' });
  }, [contacts, onIncident, addToast]);

  const startSim = useCallback(() => {
    if (phase === 'running') return;
    setPhase('running');
    setStepIdx(0);
    setResult(null);
    const conf = Math.floor(Math.random() * 9) + 91;
    setConfidence(conf);
    const gps = GPS_POOL[Math.floor(Math.random() * GPS_POOL.length)];
    playSOSBeep();
    addToast({ title: 'Accident detected! SOS pipeline started.', type: 'error' });
    STEPS.forEach((_, i) => {
      timerRef.current = setTimeout(() => {
        setStepIdx(i + 1);
        if (i === STEPS.length - 1) setTimeout(() => doDispatch(gps, conf), 1200);
      }, (i + 1) * 1500);
    });
  }, [phase, doDispatch, addToast]);

  const cancelSim = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setStepIdx(-1);
    addToast({ title: 'Alert cancelled', type: 'default' });
  }, [addToast]);

  const resetSim = useCallback(() => { setPhase('idle'); setStepIdx(-1); setResult(null); }, []);
  useEffect(() => () => clearTimer(), []);

  const circumference = 2 * Math.PI * 54;
  const progress = phase === 'idle' ? 0 : phase === 'done' ? 1 : (stepIdx + 1) / (STEPS.length + 1);
  const dashOffset = circumference * (1 - progress);
  const currentStep = stepIdx >= 0 && stepIdx < STEPS.length ? STEPS[stepIdx] : null;

  const resultRows = result ? [
    { icon:'🎯', en: `Crash Confidence: ${confidence}%`, np: `दुर्घटना विश्वास: ${confidence}%` },
    { icon:'🚓', en: 'Police Station Notified', np: 'प्रहरी चौकी सूचित गरियो' },
    { icon:'🏥', en: 'Nearest Hospital Alerted: Bir Hospital (1.2 km)', np: 'नजिकको अस्पताल सतर्क गरियो: वीर अस्पताल (१.२ किमी)' },
    { icon:'🚑', en: 'Ambulance Dispatched', np: 'एम्बुलेन्स पठाइयो' },
    { icon:'⏱', en: `Estimated Arrival: ${result.eta} minutes`, np: `अनुमानित आगमन: ${result.eta} मिनेट` },
    { icon:'🔔', en: '3 nearby users alerted within 500m radius', np: '५०० मिटर दायरामा ३ नजिकका प्रयोगकर्ताहरूलाई सतर्क गरियो' },
    { icon:'📍', en: `GPS: ${result.gps.lat}°N, ${result.gps.lng}°E — ${result.gps.place}`, np: `GPS: ${result.gps.lat}°N, ${result.gps.lng}°E — ${result.gps.place}` },
    { icon:'🗺', en: '', np: '', link: `https://www.google.com/maps?q=${result.gps.lat},${result.gps.lng}`, linkEn:'View on Google Maps ↗', linkNp:'गुगल म्यापमा हेर्नुहोस् ↗' },
    { icon:'🕐', en: `Dispatched at ${result.ts}`, np: `${result.ts} मा पठाइयो` },
  ] : [];

  return (
    <section id="simulate" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)', background:'var(--card-bg)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
          <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
          <T en="Live Demo" np="लाइभ डेमो" />
        </div>
        <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', marginBottom:14 }}>
          <T en="Accident Simulator" np="दुर्घटना सिमुलेटर" />
        </h2>
        <p style={{ color:'var(--muted)', fontSize:'.98rem', maxWidth:430, lineHeight:1.7, marginBottom:'2.5rem' }}>
          <T en="Trigger a simulated accident and watch the full AI alert pipeline execute in real time." np="सिमुलेटेड दुर्घटना ट्रिगर गर्नुहोस् र पूर्ण AI अलर्ट पाइपलाइन वास्तविक समयमा हेर्नुहोस्।" />
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', alignItems:'start' }} className="sim-grid">
          {/* Control panel */}
          <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:24, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ display:'flex', gap:5 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }} />)}
              </div>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'.68rem', color:'var(--muted)' }}>roadsos://simulation/control</span>
            </div>
            <div style={{ padding:26 }}>
              {/* Ring */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, marginBottom:24 }}>
                <div style={{ position:'relative', width:136, height:136, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg viewBox="0 0 120 120" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="3" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--r)" strokeWidth="3"
                      strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      style={{ transform:'rotate(-90deg)', transformOrigin:'center', transition:'stroke-dashoffset .3s linear' }} />
                  </svg>
                  <div style={{
                    width:106, height:106, borderRadius:'50%',
                    background: phase === 'running' ? 'radial-gradient(circle, rgba(255,28,53,.18), var(--bg))' : 'radial-gradient(circle, rgba(255,28,53,.06), var(--bg))',
                    border: phase === 'running' ? '1px solid rgba(255,28,53,.4)' : '1px solid var(--border)',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3,
                    boxShadow: phase === 'running' ? '0 0 40px rgba(255,28,53,.18)' : 'none',
                    animation: phase === 'running' ? 'armPulse 1.2s ease-in-out infinite' : 'none',
                    transition:'all .4s'
                  }}>
                    <div style={{ fontSize:'1.75rem' }}>
                      {phase === 'idle' ? '🛡' : phase === 'running' ? '⚠️' : '✅'}
                    </div>
                    <div style={{ fontSize:'.6rem', fontFamily:'var(--font-mono)', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em' }}>
                      {phase === 'idle' && <T en="Standby" np="प्रतीक्षा" />}
                      {phase === 'running' && <T en="ALERT" np="सतर्क" />}
                      {phase === 'done' && <T en="SENT" np="पठाइयो" />}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.05rem', fontWeight:700, color: phase === 'running' ? 'var(--r)' : phase === 'done' ? 'var(--green)' : 'var(--text)' }}>
                    {phase === 'idle' && <T en="System Monitoring Active" np="प्रणाली निगरानी सक्रिय" />}
                    {phase === 'running' && currentStep && <T en={currentStep.en} np={currentStep.np} />}
                    {phase === 'done' && <T en="SOS Sent Successfully" np="SOS सफलतापूर्वक पठाइयो" />}
                  </div>
                  <div style={{ fontSize:'.78rem', color:'var(--muted)', marginTop:3, fontFamily:'var(--font-mono)', minHeight:'1.4em' }}>
                    {phase === 'idle' && <T en="All sensors nominal" np="सबै सेन्सर सामान्य" />}
                    {phase === 'running' && currentStep && <T en={currentStep.sub_en} np={currentStep.sub_np} />}
                    {phase === 'done' && <T en={`Crash Confidence: ${confidence}%`} np={`दुर्घटना विश्वास: ${confidence}%`} />}
                  </div>
                </div>
              </div>

              {/* SOS Results */}
              {phase === 'done' && result && (
                <div style={{ background:'rgba(0,232,122,.04)', border:'1px solid rgba(0,232,122,.15)', borderRadius:13, padding:14, marginBottom:18, display:'flex', flexDirection:'column', gap:8 }}>
                  {resultRows.map((r, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9, fontSize:'.8rem' }}>
                      <span style={{ flexShrink:0, marginTop:1 }}>{r.icon}</span>
                      {r.link ? (
                        <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ color:'var(--cyan)', textDecoration:'underline' }}>
                          <T en={r.linkEn!} np={r.linkNp!} />
                        </a>
                      ) : (
                        <span style={{ color:'var(--muted)' }}><T en={r.en} np={r.np} /></span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {phase !== 'done' && (
                  <button onClick={startSim} disabled={phase === 'running'}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:9, background:'linear-gradient(135deg, var(--r), #c0102a)', color:'#fff', border:'none', borderRadius:11, padding:'13px 22px', fontFamily:'inherit', fontWeight:700, fontSize:'.92rem', cursor: phase === 'running' ? 'not-allowed' : 'pointer', opacity: phase === 'running' ? .5 : 1, boxShadow:'0 4px 22px rgba(255,28,53,.32)', transition:'all .3s' }}
                    data-testid="btn-simulate">
                    <span>⚡</span>
                    {phase === 'running'
                      ? <T en="Simulating..." np="सिमुलेट गर्दै..." />
                      : <T en="Simulate Accident" np="दुर्घटना सिमुलेट गर्नुहोस्" />}
                  </button>
                )}
                {phase === 'running' && (
                  <button onClick={cancelSim}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'transparent', color:'var(--amber)', border:'1px solid rgba(255,176,32,.25)', borderRadius:11, padding:'11px 22px', fontFamily:'inherit', fontWeight:600, fontSize:'.85rem', cursor:'pointer' }}
                    data-testid="btn-cancel">
                    ✕ <T en="Cancel Alert" np="अलर्ट रद्द गर्नुहोस्" />
                  </button>
                )}
                {phase === 'done' && (
                  <button onClick={resetSim}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'transparent', color:'var(--muted)', border:'1px solid var(--border)', borderRadius:11, padding:'11px 22px', fontFamily:'inherit', fontWeight:600, fontSize:'.85rem', cursor:'pointer' }}
                    data-testid="btn-reset">
                    <T en="Reset Simulator" np="सिमुलेटर रिसेट गर्नुहोस्" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live incident log */}
          <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:24, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.4)', display:'flex', flexDirection:'column', height:460 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', display:'flex', alignItems:'center', gap:7 }}>
                📡 <T en="Live Incident Log" np="लाइभ घटना लग" />
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'.68rem', color:'var(--muted)', background:'rgba(255,255,255,.05)', border:'1px solid var(--border)', padding:'3px 8px', borderRadius:6 }}>
                {logEntries.length}
              </div>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:10, display:'flex', flexDirection:'column', gap:7 }}>
              {logEntries.length === 0 ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:9, flex:1, color:'var(--muted)', textAlign:'center', padding:'2rem' }}>
                  <span style={{ fontSize:'2rem', opacity:.25 }}>🛡</span>
                  <p style={{ fontSize:'.8rem' }}>
                    <T en="No incidents yet. Run the simulator." np="अझै कुनै घटना छैन। सिमुलेटर चलाउनुहोस्।" />
                  </p>
                </div>
              ) : logEntries.slice(0, 8).map((inc, i) => (
                <div key={inc.id || i} style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:11, padding:12, fontSize:'.8rem' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'.72rem', color:'var(--cyan)' }}>{inc.id || `ACC-${i}`}</span>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(0,232,122,.08)', border:'1px solid rgba(0,232,122,.2)', color:'var(--green)', borderRadius:100, padding:'2px 8px', fontSize:'.65rem', fontWeight:700 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} />
                      <T en="Alert Sent" np="अलर्ट पठाइयो" />
                    </span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, color:'var(--muted)', fontSize:'.77rem' }}>
                    <div>🕐 {new Date(inc.timestamp).toLocaleTimeString()}</div>
                    <div>📍 {inc.place}</div>
                    <div>🎯 <T en="Confidence" np="विश्वास" />: {inc.confidence}%</div>
                    <div>⏱ ETA: {inc.eta} <T en="min" np="मिनेट" /></div>
                    <div><a href={`https://www.google.com/maps?q=${inc.lat},${inc.lng}`} target="_blank" rel="noopener noreferrer" style={{ color:'var(--cyan)' }}>
                      🗺 <T en="View on Maps ↗" np="म्यापमा हेर्नुहोस् ↗" />
                    </a></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes armPulse { 0%,100%{box-shadow:0 0 40px rgba(255,28,53,.18)} 50%{box-shadow:0 0 60px rgba(255,28,53,.32)} }
        @media(max-width:820px){.sim-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </section>
  );
}
