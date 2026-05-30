import { useEffect, useRef, useState } from 'react';
import { T } from '../T';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const steps = [
  {
    num: '01',
    en: 'AI Detects the Accident', np: 'AI ले दुर्घटना पत्ता लगाउँछ',
    enBody: 'On-device ML models analyze accelerometer, gyroscope and camera feeds. Crash patterns are identified within 3 seconds — no connectivity required.',
    npBody: 'उपकरणमै ML मोडेलले एक्सेलेरोमिटर, जाइरोस्कोप र क्यामेरा डेटा विश्लेषण गर्छ। ३ सेकेन्डभित्र दुर्घटना ढाँचा पहिचान गरिन्छ।',
  },
  {
    num: '02',
    en: 'GPS Location Locked', np: 'GPS स्थान लक गरियो',
    enBody: 'High-accuracy coordinates are captured and fused with road-segment data to pinpoint the exact crash site and nearest medical facility.',
    npBody: 'उच्च-सटीकता निर्देशांकहरू क्याप्चर गरी सडक-खण्ड डेटासँग जोडेर सटीक दुर्घटना स्थल र नजिकको अस्पताल पहिचान गरिन्छ।',
  },
  {
    num: '03',
    en: 'Emergency Alert Dispatched', np: 'आपतकालीन अलर्ट पठाइयो',
    enBody: 'SOS messages with full GPS data are sent simultaneously to emergency contacts and local services. A 10-second cancellation window prevents false alarms.',
    npBody: 'पूर्ण GPS डेटासहित SOS सन्देशहरू आपतकालीन सम्पर्कहरू र स्थानीय सेवाहरूमा एकैसाथ पठाइन्छ। १० सेकेन्डको रद्द सञ्झ्याल गलत अलर्ट रोक्छ।',
  },
];

export function HowItWorks() {
  const { ref, visible } = useReveal();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSending(s => !s), 2100);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="how-it-works" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
          <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
          <T en="Process" np="प्रक्रिया" />
        </div>
        <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', lineHeight:1.1, marginBottom:14 }}>
          <T en="How RoadSoS Responds" np="RoadSoS कसरी प्रतिक्रिया दिन्छ" />
        </h2>
        <p style={{ color:'var(--muted)', fontSize:'.98rem', maxWidth:430, lineHeight:1.7, marginBottom: '4rem' }}>
          <T en="Three automated stages — from crash to rescue — without any manual input." np="तीन स्वचालित चरणहरू — दुर्घटनादेखि उद्धारसम्म — कुनै म्यानुअल इनपुट बिना।" />
        </p>

        <div ref={ref} style={{ display:'grid', gridTemplateColumns:'1fr 1.7fr', gap:'4rem', alignItems:'center' }} className="hiw-grid">
          {/* Steps */}
          <div>
            {steps.map((s, i) => (
              <div key={i} style={{ display:'flex', gap:18, padding:'24px 0', borderBottom: i < steps.length-1 ? '1px solid var(--border)' : 'none', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition:`all .7s cubic-bezier(.16,1,.3,1) ${i*.15}s` }}>
                <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,28,53,.08)', border:'1px solid rgba(255,28,53,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)', fontSize:'.72rem', color:'var(--r2)', flexShrink:0 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:'.97rem', fontWeight:700, color:'var(--text)', marginBottom:5 }}>
                    <T en={s.en} np={s.np} />
                  </h3>
                  <p style={{ fontSize:'.85rem', color:'var(--muted)', lineHeight:1.65 }}>
                    <T en={s.enBody} np={s.npBody} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Phone mock */}
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(36px)', transition:'all .7s cubic-bezier(.16,1,.3,1) .3s' }}>
            <div style={{ position:'absolute', top:'8%', right:'-5%', background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:11, padding:'9px 13px', display:'flex', alignItems:'center', gap:7, fontSize:'.72rem', color:'var(--text)', fontWeight:500, boxShadow:'0 8px 32px rgba(0,0,0,.4)', whiteSpace:'nowrap', animation:'fb1 4s ease-in-out infinite alternate', zIndex:2 }}>
              <span style={{ color:'var(--cyan)' }}>🛰</span> GPS Locked · 3m accuracy
            </div>
            <div style={{ position:'absolute', bottom:'12%', left:'-10%', background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:11, padding:'9px 13px', display:'flex', alignItems:'center', gap:7, fontSize:'.72rem', color:'var(--text)', fontWeight:500, boxShadow:'0 8px 32px rgba(0,0,0,.4)', whiteSpace:'nowrap', animation:'fb2 5s ease-in-out infinite alternate', zIndex:2 }}>
              <span style={{ color:'var(--r)' }}>🧠</span> <T en="Crash Confidence: 97%" np="दुर्घटना विश्वास: ९७%" />
            </div>

            <div style={{ width:248, background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:38, padding:'18px 14px', position:'relative', boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
              <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:90, height:24, background:'var(--bg)', borderRadius:'0 0 18px 18px' }} />
              <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ background:'linear-gradient(135deg, var(--r), #c0102a)', borderRadius:14, padding:12, display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem', animation:'shake .6s ease-in-out infinite alternate' }}>⚠️</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'.84rem', color:'#fff', marginBottom:1 }}>
                      <T en="Accident Detected" np="दुर्घटना पत्ता लाग्यो" />
                    </div>
                    <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.85)' }}>
                      <T en="Sending SOS…" np="SOS पठाउँदै…" />
                    </div>
                  </div>
                </div>
                <div style={{ height:110, background:'var(--border)', borderRadius:11, position:'relative', overflow:'hidden', border:'1px solid var(--border)' }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize:'18px 18px' }} />
                  <div style={{ position:'absolute', left:0, right:0, top:'50%', height:2, background:'rgba(255,255,255,.08)' }} />
                  <div style={{ position:'absolute', top:0, bottom:0, left:'55%', width:2, background:'rgba(255,255,255,.08)' }} />
                  <div style={{ position:'absolute', top:'50%', left:'55%', transform:'translate(-50%,-50%)', width:11, height:11, borderRadius:'50%', background:'var(--r)', animation:'ping 1.5s ease-out infinite' }} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {[
                    { ini:'RS', color:'var(--r)', name:'Ram Sharma', status:'✓ Sent', statusColor:'var(--green)' },
                    { ini:'SP', color:'#7c3aed', name:'Sita Pradhan', status: sending ? '✓ Sent' : '…', statusColor: sending ? 'var(--green)' : 'var(--muted)' },
                  ].map((c, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.04)', borderRadius:9, padding:'7px 9px' }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.58rem', fontWeight:700, color:'#fff', flexShrink:0 }}>{c.ini}</div>
                      <div style={{ fontSize:'.72rem', color:'var(--text)', flex:1 }}>{c.name}</div>
                      <div style={{ fontSize:'.62rem', fontFamily:'var(--font-mono)', color:c.statusColor }}>{c.status}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:4 }}>
                  {[
                    { en:'📞 Call Ambulance', np:'📞 एम्बुलेन्स बोलाउनुहोस्' },
                    { en:'📍 Share Live Location', np:'📍 लाइभ स्थान साझा गर्नुहोस्' },
                    { en:'🩺 First Aid Guide', np:'🩺 प्राथमिक उपचार गाइड' },
                  ].map((btn, i) => (
                    <button key={i} style={{ padding:'7px 10px', borderRadius:8, background:'rgba(255,255,255,.06)', border:'1px solid var(--border)', color:'var(--text)', fontSize:'.7rem', fontWeight:600, cursor:'pointer' }}>
                      <T en={btn.en} np={btn.np} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shake { from { transform:rotate(-5deg); } to { transform:rotate(5deg); } }
        @keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(255,28,53,.7); } 70% { box-shadow: 0 0 0 18px rgba(255,28,53,0); } 100% { box-shadow: 0 0 0 0 rgba(255,28,53,0); } }
        @keyframes fb1 { from { transform:translateY(0); } to { transform:translateY(-9px); } }
        @keyframes fb2 { from { transform:translateY(0); } to { transform:translateY(7px); } }
        @media(max-width:860px) { .hiw-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
