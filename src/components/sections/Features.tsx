import { useEffect, useRef, useState } from 'react';
import { T } from '../T';

const features = [
  { icon:'🧠', color:'rgba(255,28,53,.07)', en:'AI-Based Detection', np:'AI-आधारित पहिचान', enBody:'Edge ML trained on 50,000+ crash patterns detects accidents with 98% accuracy, even offline.', npBody:'५०,०००+ दुर्घटना ढाँचामा तालिम पाएको एज ML ले ९८% सटीकतासँग दुर्घटना पत्ता लगाउँछ।' },
  { icon:'🔔', color:'rgba(0,212,255,.05)', en:'Real-Time Alerts', np:'वास्तविक-समय अलर्ट', enBody:'Simultaneous SMS, voice call and push notifications sent to all emergency contacts instantly.', npBody:'सबै आपतकालीन सम्पर्कहरूमा SMS, भ्वाइस कल र पुश नोटिफिकेसन एकैसाथ पठाइन्छ।' },
  { icon:'🛰', color:'rgba(0,232,122,.05)', en:'Precision GPS', np:'सटीक GPS', enBody:'Sub-5-meter accuracy with road-segment fusion ensures rescue teams find you fast.', npBody:'५ मिटरभन्दा कम सटीकतासँग सडक-खण्ड फ्युजनले उद्धार टोलीलाई छिटो फेला पार्न मद्दत गर्छ।' },
  { icon:'🚑', color:'rgba(255,176,32,.05)', en:'Faster Response', np:'छिटो प्रतिक्रिया', enBody:'Cuts average emergency notification time from 8 minutes to under 15 seconds automatically.', npBody:'औसत आपतकालीन अधिसूचना समय ८ मिनेटबाट १५ सेकेन्डभन्दा कममा घटाउँछ।' },
  { icon:'🛡', color:'rgba(167,139,250,.05)', en:'False Positive Guard', np:'गलत अलर्ट सुरक्षा', enBody:'Multi-sensor confirmation and 10-second cancel window keeps false alarm rates below 0.3%.', npBody:'बहु-सेन्सर पुष्टि र १०-सेकेन्ड रद्द सञ्झ्यालले गलत अलर्ट दर ०.३% भन्दा कम राख्छ।' },
  { icon:'📱', color:'rgba(255,28,53,.05)', en:'Offline-First', np:'अफलाइन-फर्स्ट', enBody:'Core detection runs entirely on-device. Alerts queue and send when connectivity returns.', npBody:'मुख्य पहिचान पूर्णतः उपकरणमै चल्छ। कनेक्टिभिटी फर्किँदा अलर्टहरू पठाइन्छन्।' },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)', background:'var(--card-bg)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
          <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
          <T en="Capabilities" np="क्षमताहरू" />
        </div>
        <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', lineHeight:1.1, marginBottom:'3rem' }}>
          <T en="Built for the Critical Moment" np="महत्त्वपूर्ण क्षणका लागि निर्मित" />
        </h2>
        <div ref={ref} style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem' }} className="feat-grid">
          {features.map((f, i) => (
            <div key={i} className="card" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition:`all .7s cubic-bezier(.16,1,.3,1) ${i*.1}s`, background:f.color, borderColor:'rgba(255,255,255,.07)' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--text)', marginBottom:8 }}>
                <T en={f.en} np={f.np} />
              </h3>
              <p style={{ fontSize:'.85rem', color:'var(--muted)', lineHeight:1.65 }}>
                <T en={f.enBody} np={f.npBody} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:860px){.feat-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:560px){.feat-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
