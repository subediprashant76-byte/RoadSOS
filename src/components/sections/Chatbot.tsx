import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const SUGGESTIONS_EN = [
  "Nearest trauma center?",
  "What to do after accident?",
  "Emergency first aid guidance",
  "How to do CPR?",
  "Signs of internal bleeding",
  "Ambulance number Nepal",
];

const SUGGESTIONS_NP = [
  "नजिकको ट्रमा केन्द्र?",
  "दुर्घटना पछि के गर्ने?",
  "प्राथमिक उपचार मार्गदर्शन",
  "CPR कसरी गर्ने?",
  "एम्बुलेन्स नम्बर नेपाल",
];

type QAKey =
  | 'trauma' | 'accident' | 'first aid' | 'cpr' | 'bleeding'
  | 'ambulance' | 'hospital' | 'fracture' | 'burn' | 'shock'
  | 'choking' | 'default';

const KB: Record<QAKey, { en: string; np: string }> = {
  trauma: {
    en: `🏥 **Nearest Trauma Centers in Kathmandu:**\n\n1. **Bir Hospital** — Mahabauddha, 01-4221988 (24/7 Trauma)\n2. **TUTH (Teaching Hospital)** — Maharajgunj, 01-4412505\n3. **Kathmandu Model Hospital** — Tahachal, 01-4274874\n4. **Nepal Mediciti** — Bhaisepati, 01-5159266\n5. **Grande Hospital** — Tokha Rd, 01-5159266\n\n📍 Call **102** for ambulance dispatch with GPS routing.`,
    np: `🏥 **काठमाडौंका नजिकका ट्रमा केन्द्रहरू:**\n\n1. **वीर अस्पताल** — महाबौद्ध, 01-4221988\n2. **TUTH** — महाराजगञ्ज, 01-4412505\n3. **काठमाडौं मोडल अस्पताल** — ताहाचल\n4. **नेपाल मेडिसिटी** — भैसेपाटी\n\n📍 एम्बुलेन्सको लागि **102** मा फोन गर्नुहोस्।`,
  },
  accident: {
    en: `🚨 **Immediate steps after a road accident:**\n\n1. **Stay calm** — Don't panic, assess the situation\n2. **Call 102** (ambulance) or **100** (police) immediately\n3. **Don't move injured person** unless fire risk exists\n4. **Stop bleeding** — apply firm pressure with clean cloth\n5. **Keep victim warm** — use jacket/blanket to prevent shock\n6. **Clear the area** — warn oncoming traffic with hazard lights\n7. **Document the scene** — photos for insurance/police\n\n⚠️ Never give food or water to an unconscious person.`,
    np: `🚨 **सडक दुर्घटना पछि तुरुन्त के गर्ने:**\n\n1. **शान्त रहनुहोस्** — अवस्था मूल्याङ्कन गर्नुहोस्\n2. तुरुन्त **102** (एम्बुलेन्स) वा **100** (प्रहरी) मा फोन गर्नुहोस्\n3. **घाइतेलाई नसार्नुहोस्** — आगो नलागेसम्म\n4. **रगत बन्द गर्नुहोस्** — सफा कपडाले थिच्नुहोस्\n5. **न्यानो राख्नुहोस्** — शक रोक्न\n6. **दृश्य कहिल्यै नछोड्नुहोस्** — प्रहरी आउनुअघि`,
  },
  'first aid': {
    en: `🩹 **Emergency First Aid Guidance:**\n\n**For Wounds:**\n• Rinse with clean water, apply pressure to stop bleeding\n• Elevate injured limb above heart level\n\n**For Burns:**\n• Cool with running water for 10+ minutes\n• Do NOT apply ice, butter or toothpaste\n\n**For Fractures:**\n• Immobilize — don't try to set the bone\n• Use splint or padding to stabilize\n\n**Unconscious person:**\n• Recovery position (on their side)\n• Check breathing every 2 minutes\n• Call 102 immediately\n\n**Golden Hour:** Get to hospital within 60 minutes for best survival odds.`,
    np: `🩹 **प्राथमिक उपचार मार्गदर्शन:**\n\n**घाउको लागि:**\n• सफा पानीले धुनुहोस्, रगत रोक्न थिच्नुहोस्\n\n**डढेलोको लागि:**\n• १०+ मिनेट बग्दो पानीले चिसो गर्नुहोस्\n• बरफ, मक्खन नलगाउनुहोस्\n\n**भाँचिएको हड्डी:**\n• नहल्लाउनुहोस्, तत्काल 102 मा फोन गर्नुहोस्\n\n**बेहोस व्यक्ति:**\n• छेउमा राख्नुहोस् (Recovery position)\n• श्वास जाँच गर्नुहोस्`,
  },
  cpr: {
    en: `❤️ **CPR Steps (Adult):**\n\n1. **Check scene safety** — ensure it's safe to approach\n2. **Check responsiveness** — tap shoulder, shout "Are you OK?"\n3. **Call 102** — or ask someone nearby to call\n4. **30 chest compressions:**\n   • Heel of hand on center of chest\n   • Push hard & fast — 2 inches deep\n   • 100–120 compressions per minute\n5. **2 rescue breaths** (if trained)\n   • Tilt head, lift chin, pinch nose\n   • Breathe for 1 second, watch chest rise\n6. **Repeat 30:2** until help arrives\n\n💡 Use the beat of *Stayin' Alive* to keep the right rhythm!`,
    np: `❤️ **CPR कसरी गर्ने (वयस्क):**\n\n1. **सुरक्षा जाँच गर्नुहोस्**\n2. **प्रतिक्रिया जाँच्नुहोस्** — काँध थिच्नुहोस्\n3. तुरुन्त **102** मा फोन गर्नुहोस्\n4. **३० छाती दबाउनुहोस्:**\n   • छातीको बीचमा हत्केला राख्नुहोस्\n   • ५ सेमी गहिरो दबाउनुहोस्\n   • प्रति मिनेट १००-१२० पटक\n5. **२ श्वास** (तालिम प्राप्त भएमा)\n6. **३०:२ दोहोर्याउनुहोस्**`,
  },
  bleeding: {
    en: `🩸 **Signs of Internal Bleeding:**\n\n⚠️ **Warning Signs:**\n• Bruising around abdomen, flanks, or groin\n• Rigid or swollen abdomen (board-like)\n• Blood in urine (red/dark brown)\n• Coughing or vomiting blood\n• Pale, cold, clammy skin\n• Rapid weak pulse\n• Dizziness or confusion\n• Unexplained drop in blood pressure\n\n🚨 **CALL 102 IMMEDIATELY** if you suspect internal bleeding.\n\nDo NOT give aspirin. Keep person lying down, legs elevated.`,
    np: `🩸 **आन्तरिक रक्तस्रावका संकेतहरू:**\n\n⚠️ **चेतावनी संकेतहरू:**\n• पेट वा कम्मरमा नीलडाम\n• कठोर वा सुन्निएको पेट\n• पिसाबमा रगत\n• रगत बान्ता\n• फिक्का, चिसो छाला\n• छिटो-कमजोर नाडी\n• रिंगटा वा भ्रम\n\n🚨 तुरुन्त **102** मा फोन गर्नुहोस्!`,
  },
  ambulance: {
    en: `🚑 **Emergency Numbers in Nepal:**\n\n| Service | Number |\n|---------|--------|\n| **Ambulance** | **102** |\n| **Police** | **100** |\n| **Fire Brigade** | **101** |\n| **Nepal Red Cross** | 01-4270650 |\n| **TUTH Emergency** | 01-4412505 |\n| **Bir Hospital** | 01-4221988 |\n| **Grande Hospital** | 01-5159266 |\n\n📱 RoadSoS dispatches the nearest available ambulance automatically using GPS.`,
    np: `🚑 **नेपालमा आपतकालीन नम्बरहरू:**\n\n| सेवा | नम्बर |\n|------|-------|\n| **एम्बुलेन्स** | **102** |\n| **प्रहरी** | **100** |\n| **दमकल** | **101** |\n| **नेपाल रेडक्रस** | 01-4270650 |\n| **वीर अस्पताल** | 01-4221988 |\n\n📱 RoadSoS GPS प्रयोग गरी नजिकको एम्बुलेन्स स्वतः पठाउँछ।`,
  },
  hospital: {
    en: `🏥 **Major Hospitals in Kathmandu Valley:**\n\n**Government:**\n• Bir Hospital (Trauma): 01-4221988\n• Patan Hospital: 01-5522295\n• TUTH: 01-4412505\n\n**Private:**\n• Grande International: 01-5159266\n• Nepal Mediciti: 01-5159266\n• B&B Hospital: 01-5546500\n• Norvic Hospital: 01-4258554\n\n**24/7 Emergency Available at all listed hospitals.**\n\n📍 Use RoadSoS Smart Route to find the fastest path to any of these.`,
    np: `🏥 **काठमाडौं उपत्यकाका प्रमुख अस्पतालहरू:**\n\n**सरकारी:**\n• वीर अस्पताल: 01-4221988\n• पाटन अस्पताल: 01-5522295\n• TUTH: 01-4412505\n\n**निजी:**\n• ग्रान्डे इन्टरनेशनल: 01-5159266\n• नेपाल मेडिसिटी: 01-5159266`,
  },
  fracture: {
    en: `🦴 **Managing Fractures at the Scene:**\n\n1. **Do NOT try to realign the bone** — leave it as is\n2. **Immobilize** the area above and below the break\n3. Use a splint (stiff material) + bandage to stabilize\n4. **Apply ice pack** wrapped in cloth (20 min on, 20 off)\n5. **Elevate** if it's a limb fracture\n6. Watch for signs of shock (pale skin, rapid breathing)\n7. **Transport carefully** to nearest hospital\n\n⚠️ Suspected spine/neck fracture: Do NOT move the person. Call 102 and wait.`,
    np: `🦴 **भाँचिएको हड्डीको व्यवस्थापन:**\n\n1. हड्डी मिलाउने प्रयास नगर्नुहोस्\n2. माथि र तल दुवै तर्फ स्थिर गर्नुहोस्\n3. स्प्लिन्ट + पट्टीले बाँध्नुहोस्\n4. बरफ लगाउनुहोस् (कपडामा बेरेर)\n5. अस्पतालमा सावधानीपूर्वक लैजानुहोस्\n\n⚠️ ढाड/घाँटी भाँचिएको शंका छ भने: नहल्लाउनुहोस्, 102 मा फोन गर्नुहोस्।`,
  },
  burn: {
    en: `🔥 **Burn Treatment Guide:**\n\n**Minor Burns (redness only):**\n• Cool under running water 10–20 mins\n• Cover with sterile non-stick dressing\n• Take paracetamol for pain\n\n**Major Burns (blisters, deep, large area):**\n• Call 102 immediately\n• Cool with running water (NOT ice)\n• Do NOT pop blisters\n• Do NOT apply butter, oil, or toothpaste\n• Cover loosely with clean wrap\n• Keep victim warm\n\n**Chemical burns:** Flush with large amounts of water for 20+ minutes.`,
    np: `🔥 **डढेलोको उपचार:**\n\n**सामान्य डढेलो:**\n• १०-२० मिनेट बग्दो पानीले चिसो गर्नुहोस्\n• बाँझो पट्टीले ढाक्नुहोस्\n\n**ठूलो डढेलो:**\n• तुरुन्त 102 मा फोन गर्नुहोस्\n• बरफ, मक्खन, तेल नलगाउनुहोस्\n• फोका नफुटाउनुहोस्`,
  },
  shock: {
    en: `⚡ **Recognizing & Treating Shock:**\n\n**Signs of Shock:**\n• Pale, cold, clammy skin\n• Rapid, weak pulse (>100 bpm)\n• Rapid shallow breathing\n• Confusion or anxiety\n• Nausea or vomiting\n• Thirst\n\n**What to Do:**\n1. Lay person flat, elevate legs 12 inches (unless head/spine injury)\n2. Keep them warm with a blanket\n3. Loosen tight clothing\n4. Do NOT give food or water\n5. Talk calmly to reassure them\n6. **Call 102** — shock is life-threatening\n\n⚠️ Do not leave them alone.`,
    np: `⚡ **शकको पहिचान र उपचार:**\n\n**शकका संकेतहरू:**\n• फिक्का, चिसो, पसिनायुक्त छाला\n• छिटो कमजोर नाडी\n• उथलो श्वास\n• भ्रम वा बेचैनी\n\n**के गर्ने:**\n1. सुताउनुहोस्, खुट्टा माथि उठाउनुहोस्\n2. न्यानो राख्नुहोस्\n3. खाना/पानी नदिनुहोस्\n4. तुरुन्त **102** मा फोन गर्नुहोस्`,
  },
  choking: {
    en: `😮 **Choking — Heimlich Maneuver:**\n\n**If they can cough:** Encourage them to keep coughing.\n\n**If they CANNOT cough/breathe:**\n1. Stand behind them, one foot forward for balance\n2. Lean them slightly forward\n3. Give **5 firm back blows** between shoulder blades\n4. If still blocked: **5 abdominal thrusts**\n   • Hands clasped below ribcage\n   • Pull sharply inward & upward\n5. Alternate 5 back blows + 5 thrusts until clear\n\n**Infant (under 1yr):** Face down, 5 back blows + 5 chest thrusts.\n\n🚨 If unconscious: Start CPR, call 102.`,
    np: `😮 **दम थुनिएमा — Heimlich Maneuver:**\n\n**खोक्न सक्छन् भने:** खोक्न प्रोत्साहन दिनुहोस्\n\n**खोक्न/सास फेर्न सक्दैनन् भने:**\n1. पछाडि उभिनुहोस्\n2. अलि अगाडि झुकाउनुहोस्\n3. काँधको बीचमा **५ पटक थिच्नुहोस्**\n4. पेटमा **५ पटक धक्का दिनुहोस्**\n5. ठीक नभएसम्म दोहोर्याउनुहोस्\n\n🚨 बेहोस भयो भने: CPR सुरु गर्नुहोस्, 102 मा फोन गर्नुहोस्।`,
  },
  default: {
    en: `🤖 I'm RoadSoS AI, your emergency response assistant.\n\nI can help you with:\n• 🏥 **Nearest trauma centers** — hospital locations & contacts\n• 🚨 **Post-accident steps** — what to do immediately\n• 🩹 **First aid guidance** — wounds, burns, fractures\n• ❤️ **CPR instructions** — step-by-step guide\n• 🩸 **Internal bleeding signs** — when to act fast\n• 🚑 **Ambulance numbers** — Nepal emergency contacts\n• 🏥 **Hospital directory** — Kathmandu valley\n• 🦴 **Fracture management** — stabilization tips\n• ⚡ **Shock treatment** — recognition & response\n• 😮 **Choking help** — Heimlich maneuver\n\nType your question or pick a suggestion below.`,
    np: `🤖 म RoadSoS AI हुँ, तपाईंको आपतकालीन सहायक।\n\nम यी कुरामा मद्दत गर्न सक्छु:\n• 🏥 नजिकको ट्रमा केन्द्र\n• 🚨 दुर्घटना पछि के गर्ने\n• 🩹 प्राथमिक उपचार मार्गदर्शन\n• ❤️ CPR निर्देशन\n• 🩸 आन्तरिक रक्तस्राव संकेत\n• 🚑 एम्बुलेन्स नम्बरहरू\n\nतलका सुझावहरू मध्ये छान्नुहोस् वा आफ्नो प्रश्न टाइप गर्नुहोस्।`,
  },
};

function getResponse(q: string, lang: 'en' | 'np'): string {
  const lower = q.toLowerCase();
  let key: QAKey = 'default';
  if (lower.includes('trauma') || lower.includes('nearest') || lower.includes('नजिक')) key = 'trauma';
  else if (lower.includes('accident') || lower.includes('दुर्घटना')) key = 'accident';
  else if (lower.includes('first aid') || lower.includes('प्राथमिक')) key = 'first aid';
  else if (lower.includes('cpr') || lower.includes('chest')) key = 'cpr';
  else if (lower.includes('bleed') || lower.includes('रक्त')) key = 'bleeding';
  else if (lower.includes('ambulance') || lower.includes('number') || lower.includes('एम्बुलेन्स') || lower.includes('नम्बर')) key = 'ambulance';
  else if (lower.includes('hospital') || lower.includes('अस्पताल')) key = 'hospital';
  else if (lower.includes('fracture') || lower.includes('bone') || lower.includes('हड्डी')) key = 'fracture';
  else if (lower.includes('burn') || lower.includes('डढेलो')) key = 'burn';
  else if (lower.includes('shock') || lower.includes('शक')) key = 'shock';
  else if (lower.includes('chok') || lower.includes('दम')) key = 'choking';
  return KB[key][lang];
}

function formatText(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} style={{ fontWeight: 700, marginTop: 6 }}>{line.slice(2, -2)}</div>;
    }
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <div key={i} style={{ marginTop: line.startsWith('•') || line.startsWith('1.') || line.startsWith('2.') ? 2 : 4 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
      </div>
    );
  });
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('rsos_lang') || 'en';
    setLang(stored as 'en' | 'np');
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now(), role: 'user', text, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = getResponse(text, lang);
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, delay);
  };

  const suggestions = lang === 'en' ? SUGGESTIONS_EN : SUGGESTIONS_NP;

  return (
    <section id="chatbot" style={{ padding: '80px 20px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-label">
            <span className="en-text">AI ASSISTANT</span>
            <span className="np-text">AI सहायक</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 900, marginBottom: 16 }}>
            <span className="en-text">AI Emergency <span className="text-r">Chatbot</span></span>
            <span className="np-text">AI आपतकालीन <span className="text-r">च्याटबोट</span></span>
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 540, margin: '0 auto' }}>
            <span className="en-text">Ask anything about emergencies — hospitals, first aid, CPR, ambulance numbers, and more.</span>
            <span className="np-text">आपतकालीन अवस्थाबारे जे पनि सोध्नुहोस् — अस्पताल, प्राथमिक उपचार, CPR र थप।</span>
          </p>
        </div>

        <div className="reveal" style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          {/* Chat header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
            background: 'var(--r)', borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>RoadSoS AI</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                <span className="en-text">Online · Emergency Response Expert</span>
                <span className="np-text">अनलाइन · आपतकालीन विशेषज्ञ</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button
                onClick={() => setLang('en')}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: lang === 'en' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >EN</button>
              <button
                onClick={() => setLang('np')}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: lang === 'np' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >NP</button>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ height: 400, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 60, fontSize: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
                <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  {lang === 'en' ? 'How can I help you today?' : 'आज म तपाईंलाई कसरी मद्दत गर्न सक्छु?'}
                </div>
                <div>{lang === 'en' ? 'Ask an emergency question or pick a suggestion below.' : 'तलका सुझावहरूबाट छान्नुहोस् वा प्रश्न सोध्नुहोस्।'}</div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8, alignItems: 'flex-end',
              }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user' ? 'var(--r)' : 'var(--bg)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text)',
                  border: msg.role === 'ai' ? '1px solid var(--border)' : 'none',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px', fontSize: 13, lineHeight: 1.5,
                }}>
                  {formatText(msg.text)}
                  <div style={{ fontSize: 10, color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--muted)', marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: 'var(--r)',
                      display: 'inline-block',
                      animation: 'bounce 1.2s infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                style={{
                  padding: '6px 12px', borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)', color: 'var(--text)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--r)'; (e.target as HTMLElement).style.color = 'var(--r)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text)'; }}
              >{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            display: 'flex', gap: 10, padding: '12px 16px 16px',
            borderTop: '1px solid var(--border)',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder={lang === 'en' ? 'Ask an emergency question...' : 'आपतकालीन प्रश्न सोध्नुहोस्...'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--bg)',
                color: 'var(--text)', fontSize: 14, outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--r)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              style={{
                padding: '10px 18px', borderRadius: 10,
                background: input.trim() && !typing ? 'var(--r)' : 'var(--border)',
                color: '#fff', border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              }}
            >
              {lang === 'en' ? 'Send' : 'पठाउ'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
