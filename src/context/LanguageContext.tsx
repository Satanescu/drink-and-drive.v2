import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import ro from '../locales/ro.json';

const translations = { en, ro };

type Language = 'en' | 'ro';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage || 'ro';
  });

  const setLanguage = (language: Language) => {
    localStorage.setItem('language', language);
    setLanguageState(language);
  };

  const t = (key: keyof typeof en) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};