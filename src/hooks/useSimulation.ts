import { useState, useCallback } from 'react';

export interface Incident {
  id: string;
  timestamp: number;
  place: string;
  lat: number;
  lng: number;
  confidence: number;
  eta: number;
  contacts: string[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  color: string;
}

const COLORS = ['#FF1C35','#7c3aed','#0891b2','#059669','#d97706','#b45309'];

const LS_INCIDENTS = 'rsos_incidents';
const LS_CONTACTS = 'rsos_contacts';

function loadIncidents(): Incident[] {
  try { return JSON.parse(localStorage.getItem(LS_INCIDENTS) || '[]'); } catch { return []; }
}
function loadContacts(): Contact[] {
  try { return JSON.parse(localStorage.getItem(LS_CONTACTS) || '[]'); } catch { return []; }
}

export function useSimulationData() {
  const [incidents, setIncidents] = useState<Incident[]>(loadIncidents);
  const [contacts, setContacts] = useState<Contact[]>(loadContacts);

  const addIncident = useCallback((inc: Omit<Incident, 'id'>) => {
    const newInc: Incident = { ...inc, id: 'ACC-' + String(Date.now()).slice(-7) };
    setIncidents(prev => {
      const next = [newInc, ...prev];
      localStorage.setItem(LS_INCIDENTS, JSON.stringify(next));
      return next;
    });
  }, []);

  const addContact = useCallback((name: string, phone: string) => {
    setContacts(prev => {
      const newC: Contact = {
        id: Math.random().toString(36).slice(2),
        name, phone,
        color: COLORS[prev.length % COLORS.length]
      };
      const next = [...prev, newC];
      localStorage.setItem(LS_CONTACTS, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(LS_CONTACTS, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearIncidents = useCallback(() => {
    setIncidents([]);
    localStorage.removeItem(LS_INCIDENTS);
  }, []);

  return { incidents, contacts, addIncident, addContact, removeContact, clearIncidents };
}
