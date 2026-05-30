import { useState, useRef } from 'react';
import { T } from '../T';
import { Contact } from '../../hooks/useSimulation';

interface Props {
  contacts: Contact[];
  onAdd: (name: string, phone: string) => void;
  onRemove: (id: string) => void;
  addToast: (t: { title: string; type?: 'success'|'error'|'warning'|'default' }) => void;
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function Contacts({ contacts, onAdd, onRemove, addToast }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!name.trim()) { addToast({ title: 'Enter a name', type: 'error' }); return; }
    if (!phone.trim()) { addToast({ title: 'Enter a phone number', type: 'error' }); return; }
    onAdd(name.trim(), phone.trim());
    setName('');
    setPhone('');
    addToast({ title: `${name.trim()} added to emergency list`, type: 'success' });
  };

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'11px 14px', borderRadius:10,
    background:'rgba(255,255,255,.04)', border:'1px solid var(--border)',
    color:'var(--text)', fontFamily:'inherit', fontSize:'.9rem',
    outline:'none', transition:'border-color .2s',
  };

  return (
    <section id="contacts" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)', background:'var(--card-bg)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
          <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
          <T en="Emergency Contacts" np="आपतकालीन सम्पर्कहरू" />
        </div>
        <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', marginBottom:14 }}>
          <T en="Manage Contacts" np="सम्पर्कहरू व्यवस्थापन गर्नुहोस्" />
        </h2>
        <p style={{ color:'var(--muted)', fontSize:'.98rem', maxWidth:430, lineHeight:1.7, marginBottom:'3rem' }}>
          <T en="These contacts receive instant SOS alerts when an accident is confirmed." np="दुर्घटना पुष्टि हुँदा यी सम्पर्कहरूले तुरुन्त SOS अलर्ट पाउँछन्।" />
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', alignItems:'start' }} className="contacts-grid">
          {/* Form */}
          <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:20, padding:28 }}>
            <div style={{ fontSize:'1rem', fontWeight:700, color:'var(--text)', display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
              👤 <T en="Add Contact" np="सम्पर्क थप्नुहोस्" />
            </div>

            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'var(--muted)', marginBottom:6 }}>
                <T en="Full Name" np="पूरा नाम" />
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') phoneRef.current?.focus(); }}
                placeholder="e.g. Sita Sharma"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--r)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                data-testid="input-name"
              />
            </div>

            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:'.8rem', fontWeight:600, color:'var(--muted)', marginBottom:6 }}>
                <T en="Phone Number" np="फोन नम्बर" />
              </label>
              <input
                ref={phoneRef}
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                placeholder="+977-98XXXXXXXX"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--r)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                data-testid="input-phone"
              />
            </div>

            <button onClick={handleAdd}
              style={{ width:'100%', padding:'12px 20px', borderRadius:11, background:'linear-gradient(135deg, var(--r), #c0102a)', color:'#fff', border:'none', fontFamily:'inherit', fontWeight:700, fontSize:'.9rem', cursor:'pointer', transition:'all .3s', boxShadow:'0 4px 18px rgba(255,28,53,.3)' }}
              data-testid="btn-add-contact"
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              + <T en="Add to Emergency List" np="आपतकालीन सूचीमा थप्नुहोस्" />
            </button>
          </div>

          {/* Contact list */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:'.9rem', fontWeight:700, color:'var(--text)' }}>
                <T en="Saved Contacts" np="सुरक्षित सम्पर्कहरू" />
              </div>
              <div style={{ background:'rgba(255,28,53,.08)', border:'1px solid rgba(255,28,53,.2)', color:'var(--r)', borderRadius:100, padding:'3px 12px', fontSize:'.72rem', fontWeight:700 }}>
                {contacts.length}
              </div>
            </div>

            {contacts.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'3rem', color:'var(--muted)', textAlign:'center', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:20 }}>
                <span style={{ fontSize:'2rem', opacity:.25 }}>📒</span>
                <p style={{ fontSize:'.85rem' }}>
                  <T en="No contacts yet. Add someone above." np="अझै कुनै सम्पर्क छैन। माथि कसैलाई थप्नुहोस्।" />
                </p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {contacts.map(c => (
                  <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:14, padding:'12px 16px', transition:'border-color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,28,53,.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {initials(c.name)}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'.9rem', fontWeight:600, color:'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize:'.78rem', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{c.phone}</div>
                    </div>
                    <button
                      onClick={() => { onRemove(c.id); addToast({ title: 'Contact removed', type: 'default' }); }}
                      style={{ width:32, height:32, borderRadius:9, background:'rgba(255,28,53,.07)', border:'1px solid rgba(255,28,53,.15)', color:'var(--r)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', transition:'all .2s' }}
                      data-testid={`btn-delete-${c.id}`}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,28,53,.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,28,53,.07)'; }}>
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:820px){.contacts-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
