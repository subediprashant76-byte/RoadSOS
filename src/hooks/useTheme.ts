import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<'en' | 'np'>('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('rsos_theme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
    else {
      // Default to dark
      document.documentElement.classList.add('dark');
    }
    
    const savedLang = localStorage.getItem('rsos_lang') as 'en' | 'np' | null;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rsos_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    if (lang === 'np') {
      document.documentElement.classList.add('lang-np');
      document.documentElement.classList.remove('lang-en');
    } else {
      document.documentElement.classList.add('lang-en');
      document.documentElement.classList.remove('lang-np');
    }
    localStorage.setItem('rsos_lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(l => l === 'en' ? 'np' : 'en');

  return { theme, toggleTheme, lang, toggleLang };
}
