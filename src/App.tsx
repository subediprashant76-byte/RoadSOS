import { useEffect, useRef } from 'react';
import { Nav } from './components/Nav';
import { StatusBar } from './components/StatusBar';
import { Ticker } from './components/Ticker';
import { ToastContainer } from './components/Toast';
import { Hero } from './components/sections/Hero';
import { HowItWorks } from './components/sections/HowItWorks';
import { Simulation } from './components/sections/Simulation';
import { Dashboard } from './components/sections/Dashboard';
import { Training } from './components/sections/Training';
import { Contacts } from './components/sections/Contacts';
import { Features } from './components/sections/Features';
import { Impact } from './components/sections/Impact';
import { Footer } from './components/sections/Footer';
import { Chatbot } from './components/sections/Chatbot';
import { RouteMap } from './components/sections/RouteMap';
import { useToast } from './hooks/useToast';
import { useSimulationData } from './hooks/useSimulation';
import { useTheme } from './hooks/useTheme';

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0), my = useRef(0), rx = useRef(0), ry = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; };
    document.addEventListener('mousemove', onMove);
    const loop = () => {
      if (dotRef.current) { dotRef.current.style.left = mx.current + 'px'; dotRef.current.style.top = my.current + 'px'; }
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = rx.current + 'px'; ringRef.current.style.top = ry.current + 'px'; }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}

function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

const Divider = () => <div style={{ height: 1, background: 'var(--border)' }} />;

export default function App() {
  useTheme();
  const { toasts, addToast, removeToast } = useToast();
  const { incidents, contacts, addIncident, addContact, removeContact, clearIncidents } = useSimulationData();

  return (
    <>
      <CustomCursor />
      <ScrollReveal />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <StatusBar />
      <Nav />

      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <Divider />
        <Simulation contacts={contacts} onIncident={addIncident} addToast={addToast} />
        <Divider />
        <Chatbot />
        <Divider />
        <RouteMap />
        <Divider />
        <Dashboard incidents={incidents} onClear={clearIncidents} />
        <Divider />
        <Training />
        <Divider />
        <Contacts contacts={contacts} onAdd={addContact} onRemove={removeContact} addToast={addToast} />
        <Divider />
        <Features />
        <Divider />
        <Impact />
      </main>

      <Footer />
    </>
  );
}
