import { useEffect, useRef, useState } from 'react';
import { T } from '../T';

const impacts = [
  {
    icon: '⏱', color: 'rgba(255,176,32,.08)', border: 'rgba(255,176,32,.2)',
    en: 'The Golden Hour', np: 'सुनौलो घण्टा',
    enBody: 'The first 60 minutes after a crash are critical for survival. Every minute of delay drastically reduces the chance of recovery. RoadSoS cuts detection and alert time from minutes to under 10 seconds — giving victims a fighting chance.',
    npBody: 'दुर्घटनापछिका पहिलो ६० मिनेट बाँच्नका लागि महत्त्वपूर्ण छन्। हर विलम्बले निको हुने सम्भावना घटाउँछ। RoadSoS ले पहिचान र अलर्ट समय मिनेटबाट १० सेकेन्डभन्दा कममा घटाउँछ।',
  },
  {
    icon: '🗺', color: 'rgba(255,28,53,.06)', border: 'rgba(255,28,53,.2)',
    en: 'Rural Road Crisis', np: 'ग्रामीण सडक संकट',
    enBody: '70% of road fatalities in Nepal occur in rural areas where emergency services are slow to arrive or unaware of accidents. RoadSoS works entirely offline — no internet required for detection and initial alert dispatch.',
    npBody: 'नेपालमा ७०% सडक मृत्यु ग्रामीण क्षेत्रमा हुन्छ जहाँ आपतकालीन सेवाहरू ढिलो आउँछन्। RoadSoS पूर्णतः अफलाइन काम गर्छ — पहिचान र अलर्टका लागि इन्टरनेट चाहिँदैन।',
  },
  {
    icon: '🕐', color: 'rgba(0,212,255,.06)', border: 'rgba(0,212,255,.2)',
    en: 'The Response Gap', np: 'प्रतिक्रिया अन्तर',
    enBody: 'Average manual emergency calls take 8+ minutes from crash to dispatch. RoadSoS automates the entire pipeline — from AI detection to GPS-pinned SOS — in under 10 seconds, closing the gap that costs thousands of lives each year.',
    npBody: 'औसत म्यानुअल आपतकालीन कलमा दुर्घटनादेखि डिस्प्याचसम्म ८+ मिनेट लाग्छ। RoadSoS ले पूरै पाइपलाइन स्वचालित गर्छ — AI पहिचानदेखि GPS-पिन SOS सम्म — १० सेकेन्डभन्दा कममा।',
  },
];

export function Impact() {
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
    <section id="impact" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
          <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
          <T en="Impact" np="प्रभाव" />
        </div>
        <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', lineHeight:1.1, marginBottom:14 }}>
          <T en="Why RoadSoS Matters" np="RoadSoS किन महत्त्वपूर्ण छ" />
        </h2>
        <p style={{ color:'var(--muted)', fontSize:'.98rem', maxWidth:480, lineHeight:1.7, marginBottom:'3.5rem' }}>
          <T en="The problem is urgent. The solution is here. Every second we save is a life we protect." np="समस्या जरुरी छ। समाधान यहाँ छ। हामीले बचाउने हर सेकेन्ड एउटा जीवन जोगाउँछ।" />
        </p>

        <div ref={ref} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }} className="impact-grid">
          {impacts.map((item, i) => (
            <div key={i} style={{ background: item.color, border: `1px solid ${item.border}`, borderRadius:20, padding:32, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)', transition:`all .7s cubic-bezier(.16,1,.3,1) ${i*.15}s` }}>
              <div style={{ fontSize:'2.5rem', marginBottom:20 }}>{item.icon}</div>
              <h3 style={{ fontSize:'1.15rem', fontWeight:800, color:'var(--text)', marginBottom:12 }}>
                <T en={item.en} np={item.np} />
              </h3>
              <p style={{ fontSize:'.88rem', color:'var(--muted)', lineHeight:1.75 }}>
                <T en={item.enBody} np={item.npBody} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:860px){.impact-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
