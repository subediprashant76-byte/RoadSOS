import React, { useState } from 'react';

const LOCATIONS = [
  { id: 'ratna', name: 'Ratna Park', np: 'रत्नपार्क', lat: 27.7041, lng: 85.3145 },
  { id: 'koteshwor', name: 'Koteshwor', np: 'कोटेश्वर', lat: 27.6866, lng: 85.3479 },
  { id: 'balaju', name: 'Balaju', np: 'बालाजु', lat: 27.7331, lng: 85.2966 },
  { id: 'lagankhel', name: 'Lagankhel', np: 'लगनखेल', lat: 27.6670, lng: 85.3166 },
  { id: 'gongabu', name: 'Gongabu', np: 'गोंगाबु', lat: 27.7390, lng: 85.3200 },
  { id: 'thamel', name: 'Thamel', np: 'थमेल', lat: 27.7154, lng: 85.3123 },
];

const HOSPITALS = [
  {
    id: 'bir',
    name: 'Bir Hospital',
    np: 'वीर अस्पताल',
    type: 'Government Trauma Center',
    typeNp: 'सरकारी ट्रमा केन्द्र',
    phone: '01-4221988',
    address: 'Mahabauddha',
    addressNp: 'महाबौद्ध',
    lat: 27.7041,
    lng: 85.3145,
    beds: 24,
    rating: 4.2,
    specialty: 'Trauma & Emergency',
    specialtyNp: 'ट्रमा र आपतकाल',
    color: '#22c55e',
  },
  {
    id: 'tuth',
    name: 'Teaching Hospital (TUTH)',
    np: 'टिचिङ अस्पताल',
    type: 'Government Teaching Hospital',
    typeNp: 'सरकारी शिक्षण अस्पताल',
    phone: '01-4412505',
    address: 'Maharajgunj',
    addressNp: 'महाराजगञ्ज',
    lat: 27.7350,
    lng: 85.3296,
    beds: 18,
    rating: 4.5,
    specialty: 'Multi-Specialty',
    specialtyNp: 'बहु-विशेषता',
    color: '#3b82f6',
  },
  {
    id: 'grande',
    name: 'Grande Hospital',
    np: 'ग्रान्डे अस्पताल',
    type: 'Private Hospital',
    typeNp: 'निजी अस्पताल',
    phone: '01-5159266',
    address: 'Tokha Road',
    addressNp: 'टोखा रोड',
    lat: 27.7420,
    lng: 85.3234,
    beds: 12,
    rating: 4.7,
    specialty: 'Emergency & ICU',
    specialtyNp: 'आपतकाल र ICU',
    color: '#f59e0b',
  },
  {
    id: 'patan',
    name: 'Patan Hospital',
    np: 'पाटन अस्पताल',
    type: 'Government Hospital',
    typeNp: 'सरकारी अस्पताल',
    phone: '01-5522295',
    address: 'Lagankhel, Lalitpur',
    addressNp: 'लगनखेल, ललितपुर',
    lat: 27.6670,
    lng: 85.3166,
    beds: 20,
    rating: 4.3,
    specialty: 'General & Trauma',
    specialtyNp: 'सामान्य र ट्रमा',
    color: '#8b5cf6',
  },
  {
    id: 'mediciti',
    name: 'Nepal Mediciti',
    np: 'नेपाल मेडिसिटी',
    type: 'Private Multi-specialty',
    typeNp: 'निजी बहु-विशेषता',
    phone: '01-5159266',
    address: 'Bhaisepati',
    addressNp: 'भैसेपाटी',
    lat: 27.6580,
    lng: 85.2900,
    beds: 8,
    rating: 4.8,
    specialty: 'Advanced Emergency',
    specialtyNp: 'उन्नत आपतकाल',
    color: '#ec4899',
  },
];

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTrafficLabel(dist: number): { label: string; labelNp: string; color: string; time: number } {
  if (dist < 2) return { label: 'Low Traffic', labelNp: 'कम ट्राफिक', color: '#22c55e', time: Math.round(dist * 4) };
  if (dist < 4) return { label: 'Moderate Traffic', labelNp: 'मध्यम ट्राफिक', color: '#f59e0b', time: Math.round(dist * 6) };
  return { label: 'Heavy Traffic', labelNp: 'भारी ट्राफिक', color: '#ef4444', time: Math.round(dist * 9) };
}

export const RouteMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedHospital, setSelectedHospital] = useState<typeof HOSPITALS[0] | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const hospitalsWithDist = HOSPITALS.map(h => {
    const dist = calcDistance(selectedLocation.lat, selectedLocation.lng, h.lat, h.lng);
    const traffic = getTrafficLabel(dist);
    return { ...h, dist, ...traffic };
  }).sort((a, b) => a.time - b.time);

  const best = hospitalsWithDist[0];

  const handleDispatch = () => {
    setDispatching(true);
    setDispatched(false);
    setTimeout(() => { setDispatching(false); setDispatched(true); }, 2200);
  };

  return (
    <section id="route" style={{ padding: '80px 20px', background: 'color-mix(in srgb, var(--bg) 97%, var(--r))' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-label">
            <span className="en-text">AI ROUTING</span>
            <span className="np-text">AI मार्गदर्शन</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 900, marginBottom: 16 }}>
            <span className="en-text">Smart <span className="text-r">Route</span> Suggestion</span>
            <span className="np-text">स्मार्ट <span className="text-r">मार्ग</span> सुझाव</span>
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 540, margin: '0 auto' }}>
            <span className="en-text">AI analyzes real-time traffic to find the fastest route to the nearest available hospital.</span>
            <span className="np-text">AI ले रियल-टाइम ट्राफिक विश्लेषण गरी नजिकको उपलब्ध अस्पतालमा द्रुत मार्ग सुझाउँछ।</span>
          </p>
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Left: Location picker + best route */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Location picker */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📍</span>
                <span className="en-text">Your Location</span>
                <span className="np-text">तपाईंको स्थान</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => { setSelectedLocation(loc); setSelectedHospital(null); setDispatched(false); }}
                    style={{
                      padding: '8px 12px', borderRadius: 8, border: '1px solid',
                      borderColor: selectedLocation.id === loc.id ? 'var(--r)' : 'var(--border)',
                      background: selectedLocation.id === loc.id ? 'color-mix(in srgb, var(--r) 15%, transparent)' : 'var(--bg)',
                      color: selectedLocation.id === loc.id ? 'var(--r)' : 'var(--text)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    <span className="en-text">{loc.name}</span>
                    <span className="np-text">{loc.np}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Best Route */}
            <div style={{
              background: 'var(--card)', border: '2px solid var(--r)',
              borderRadius: 16, padding: 20,
              boxShadow: '0 0 30px color-mix(in srgb, var(--r) 15%, transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ background: 'var(--r)', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                  🤖 AI RECOMMENDED
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: best.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏥</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>
                    <span className="en-text">{best.name}</span>
                    <span className="np-text">{best.np}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    <span className="en-text">{best.specialty}</span>
                    <span className="np-text">{best.specialtyNp}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { icon: '📏', val: `${best.dist.toFixed(1)} km`, valNp: `${best.dist.toFixed(1)} किमी`, label: 'Distance', labelNp: 'दूरी' },
                  { icon: '⏱️', val: `${best.time} min`, valNp: `${best.time} मिनेट`, label: 'ETA', labelNp: 'समय' },
                  { icon: '🛏️', val: `${best.beds}`, valNp: `${best.beds}`, label: 'Beds', labelNp: 'बेड' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18 }}>{item.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--r)' }}>
                      <span className="en-text">{item.val}</span>
                      <span className="np-text">{item.valNp}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      <span className="en-text">{item.label}</span>
                      <span className="np-text">{item.labelNp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, padding: '8px 12px', borderRadius: 8, background: `${best.color}22` }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: best.color, display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: best.color }}>
                  <span className="en-text">{best.label}</span>
                  <span className="np-text">{best.labelNp}</span>
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>{best.phone}</span>
              </div>

              {!dispatched ? (
                <button
                  onClick={handleDispatch}
                  disabled={dispatching}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                    background: dispatching ? 'var(--border)' : 'var(--r)',
                    color: '#fff', fontWeight: 700, fontSize: 14, cursor: dispatching ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {dispatching ? (
                    <span>⏳ <span className="en-text">Dispatching Ambulance...</span><span className="np-text">एम्बुलेन्स पठाउँदै...</span></span>
                  ) : (
                    <span>🚑 <span className="en-text">Dispatch Ambulance Now</span><span className="np-text">एम्बुलेन्स पठाउनुहोस्</span></span>
                  )}
                </button>
              ) : (
                <div style={{
                  padding: '12px', borderRadius: 10, background: '#22c55e22',
                  border: '1px solid #22c55e', textAlign: 'center', fontWeight: 700, color: '#22c55e', fontSize: 14,
                }}>
                  ✅ <span className="en-text">Ambulance Dispatched! ETA {best.time} min</span>
                  <span className="np-text">एम्बुलेन्स पठाइयो! ETA {best.time} मिनेट</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: All hospitals list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>
              <span className="en-text">ALL HOSPITALS — SORTED BY FASTEST ROUTE</span>
              <span className="np-text">सबै अस्पतालहरू — द्रुत मार्ग अनुसार</span>
            </div>
            {hospitalsWithDist.map((h, idx) => (
              <button
                key={h.id}
                onClick={() => setSelectedHospital(selectedHospital?.id === h.id ? null : h)}
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${selectedHospital?.id === h.id ? 'var(--r)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '14px 16px',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  boxShadow: idx === 0 ? '0 4px 20px rgba(255,28,53,0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: h.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>🏥</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        <span className="en-text">{h.name}</span>
                        <span className="np-text">{h.np}</span>
                      </span>
                      {idx === 0 && (
                        <span style={{ background: 'var(--r)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                          FASTEST
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      <span className="en-text">{h.address} · {h.specialty}</span>
                      <span className="np-text">{h.addressNp} · {h.specialtyNp}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--r)' }}>
                      <span className="en-text">{h.time} min</span>
                      <span className="np-text">{h.time} मि</span>
                    </div>
                    <div style={{ fontSize: 11, color: h.color, fontWeight: 600 }}>
                      <span className="en-text">{h.label}</span>
                      <span className="np-text">{h.labelNp}</span>
                    </div>
                  </div>
                </div>

                {selectedHospital?.id === h.id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Phone', labelNp: 'फोन', val: h.phone },
                      { label: 'Distance', labelNp: 'दूरी', val: `${h.dist.toFixed(1)} km` },
                      { label: 'Beds Available', labelNp: 'उपलब्ध बेड', val: String(h.beds) },
                      { label: 'Rating', labelNp: 'रेटिङ', val: `⭐ ${h.rating}` },
                    ].map((item, i) => (
                      <div key={i} style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                          <span className="en-text">{item.label}</span>
                          <span className="np-text">{item.labelNp}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{item.val}</div>
                      </div>
                    ))}
                    <a
                      href={`tel:${h.phone}`}
                      onClick={e => e.stopPropagation()}
                      style={{
                        gridColumn: '1 / -1', padding: '8px', borderRadius: 8,
                        background: 'var(--r)', color: '#fff', fontWeight: 700,
                        textDecoration: 'none', textAlign: 'center', fontSize: 13,
                      }}
                    >
                      📞 <span className="en-text">Call {h.phone}</span>
                      <span className="np-text">{h.phone} मा फोन गर्नुहोस्</span>
                    </a>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
