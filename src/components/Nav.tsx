import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Logo } from './Logo';

export const Nav = () => {
  const { theme, toggleTheme, lang, toggleLang } = useTheme();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo size={38} />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>
              Road<span className="text-r">SoS</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              <span className="en-text">AI Emergency Response</span>
              <span className="np-text">AI आपतकालीन प्रतिक्रिया</span>
            </div>
          </div>
        </a>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="hidden md:flex">
          <a href="#how-it-works" className="nav-link">
            <span className="en-text">How It Works</span>
            <span className="np-text">कसरी काम गर्छ</span>
          </a>
          <a href="#simulate" className="nav-link">
            <span className="en-text">Simulate</span>
            <span className="np-text">सिमुलेट</span>
          </a>
          <a href="#chatbot" className="nav-link">
            <span className="en-text">AI Chat</span>
            <span className="np-text">AI च्याट</span>
          </a>
          <a href="#route" className="nav-link">
            <span className="en-text">Routes</span>
            <span className="np-text">मार्गहरू</span>
          </a>
          <a href="#training" className="nav-link">
            <span className="en-text">Training</span>
            <span className="np-text">तालिम</span>
          </a>
          <a href="#dashboard" className="nav-link">
            <span className="en-text">Dashboard</span>
            <span className="np-text">ड्यासबोर्ड</span>
          </a>
          <a href="#contacts" className="nav-link">
            <span className="en-text">Contacts</span>
            <span className="np-text">सम्पर्क</span>
          </a>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={toggleLang} className="btn-ghost" style={{ padding: '6px 12px', borderRadius: '4px' }}>
            {lang === 'en' ? 'NP' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="btn-ghost" style={{ padding: '6px 12px', borderRadius: '4px' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#simulate" className="btn btn-primary">
            <span className="en-text">Try Demo</span>
            <span className="np-text">डेमो हेर्नुहोस्</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
