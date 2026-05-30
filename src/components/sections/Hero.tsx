import { useEffect, useRef, useState } from 'react';
import { T } from '../T';

function useCounter(target: number, duration: number, trigger: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return val;
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c1 = useCounter(3, 1100, triggered);
  const c2 = useCounter(98, 1700, triggered);
  const c3 = useCounter(10, 1300, triggered);

  return (
    <section id="home" style={{ position:'relative', minHeight:'100svh', display:'grid', placeItems:'center', padding:'120px clamp(1rem,5vw,4rem) 80px', overflow:'hidden' }}>
      {/* Background */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:680, height:680, top:-180, left:-180, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,28,53,.11), transparent 70%)', filter:'blur(80px)', animation:'d1 18s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute', width:480, height:480, bottom:-80, right:-80, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,255,.07), transparent 70%)', filter:'blur(80px)', animation:'d2 14s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize:'55px 55px', opacity:.5 }} />
        <div style={{ position:'absolute', left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, var(--r), transparent)', animation:'scan 7s ease-in-out infinite', opacity:.4 }} />
      </div>

      <div ref={ref} style={{ position:'relative', zIndex:2, maxWidth:820, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,28,53,.08)', border:'1px solid rgba(255,28,53,.2)', color:'var(--r2)', padding:'6px 16px', borderRadius:100, fontSize:'.7rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'1.8rem', animation:'fu .8s both' }}>
          <span className="live-dot" />
          <T en="AI Emergency Response System" np="AI आपतकालीन प्रतिक्रिया प्रणाली" />
        </div>

        {/* Headline */}
        <h1 style={{ fontSize:'clamp(2.8rem,7.5vw,6rem)', fontWeight:900, lineHeight:.95, letterSpacing:'-.04em', color:'var(--text)', marginBottom:'.6rem', animation:'fu .8s .1s both' }}>
          <T en="Saving" np="हर सेकेन्ड" />
        </h1>
        <div style={{ fontSize:'clamp(2.8rem,7.5vw,6rem)', fontWeight:900, lineHeight:.95, letterSpacing:'-.04em', background:'linear-gradient(135deg, var(--r), var(--r2) 50%, #ff8c61)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'1.6rem', animation:'fu .8s .15s both' }}>
          <T en="Every Second." np="बचाउँदै।" />
        </div>

        {/* Sub */}
        <p style={{ fontSize:'1.05rem', color:'var(--muted)', maxWidth:500, lineHeight:1.75, marginBottom:'2.5rem', animation:'fu .8s .2s both' }}>
          <T
            en="RoadSoS uses on-device AI to detect crashes in real time and dispatch emergency alerts with precise GPS — automatically, in under 10 seconds."
            np="RoadSoS ले उपकरणमै AI प्रयोग गरेर दुर्घटना तुरुन्त पत्ता लगाउँछ र सटीक GPS सहित आपतकालीन अलर्ट पठाउँछ — स्वचालित रूपमा, १० सेकेन्डभित्र।"
          />
        </p>

        {/* Buttons */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:'3.5rem', animation:'fu .8s .3s both' }}>
          <a href="#simulate" className="btn btn-primary" data-testid="btn-start-monitoring">
            <T en="Start Monitoring" np="निगरानी सुरु गर्नुहोस्" />
          </a>
          <a href="#training" className="btn btn-ghost" data-testid="btn-view-training">
            <T en="View Training Games" np="तालिम खेलहरू हेर्नुहोस्" />
          </a>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', animation:'fu .8s .4s both', boxShadow:'0 8px 32px rgba(0,0,0,.4)' }} data-testid="hero-stats">
          {[
            { val:`${c1}s`, en:'Detection', np:'पहिचान' },
            { val:`${c2}%`, en:'Accuracy', np:'सटीकता' },
            { val:'24/7', en:'Monitoring', np:'निगरानी' },
            { val:`${c3}s`, en:'Alert Time', np:'अलर्ट समय' },
          ].map((s, i) => (
            <div key={i} style={{ padding:'15px 26px', textAlign:'center', flex:1, borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:'.68rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', marginTop:3 }}>
                <T en={s.en} np={s.np} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes d1 { from{transform:translate(0,0)scale(1)} to{transform:translate(55px,38px)scale(1.08)} }
        @keyframes d2 { from{transform:translate(0,0)} to{transform:translate(-38px,-55px)scale(1.05)} }
        @keyframes scan { 0%{top:0;opacity:0} 5%{opacity:.7} 95%{opacity:.15} 100%{top:100%;opacity:0} }
        @keyframes fu { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
      `}</style>
    </section>
  );
}
