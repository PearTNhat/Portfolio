'use client';

import * as React from 'react';
import { Language, I18nDataBundle, I18nUiDictionary } from '@/lib/i18n/types';
import { VI_DATA } from '@/lib/i18n/dictionaries/vi';
import { EN_DATA } from '@/lib/i18n/dictionaries/en';
import { Profile } from '@/types/profile';
import { Project } from '@/types/project';
import { Experience } from '@/types/experience';
import { SkillCategory } from '@/types/skill';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  ui: I18nUiDictionary;
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  skillCategories: SkillCategory[];
  isHydrated: boolean;
}

const I18nContext = React.createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'portfolio_language';

const DATA_BUNDLES: Record<Language, I18nDataBundle> = {
  vi: VI_DATA,
  en: EN_DATA,
};

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('portfolio-language-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('portfolio-language-change', callback);
  };
}

function getSnapshot(): Language {
  if (typeof window === 'undefined') return 'vi';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'vi';
  } catch {
    return 'vi';
  }
}

function getServerSnapshot(): Language {
  return 'vi';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = React.useCallback((lang: Language) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(new Event('portfolio-language-change'));
    } catch {
      // Ignore
    }
  }, []);

  const toggleLanguage = React.useCallback(() => {
    const nextLang: Language = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  }, [language, setLanguage]);

  const activeBundle = DATA_BUNDLES[language] ?? VI_DATA;

  const value = React.useMemo<I18nContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      ui: activeBundle.ui,
      profile: activeBundle.profile,
      projects: activeBundle.projects,
      experiences: activeBundle.experiences,
      skillCategories: activeBundle.skillCategories,
      isHydrated: true,
    }),
    [language, setLanguage, toggleLanguage, activeBundle]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
