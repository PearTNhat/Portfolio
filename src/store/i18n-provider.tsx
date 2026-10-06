'use client';

import * as React from 'react';
import { Language, I18nDataBundle, I18nUiDictionary } from '@/lib/i18n/types';
import { VI_DATA } from '@/lib/i18n/dictionaries/vi';
import { EN_DATA } from '@/lib/i18n/dictionaries/en';
import { Profile } from '@/types/profile';
import { Project } from '@/types/project';
import { Experience } from '@/types/experience';
import { SkillCategory } from '@/types/skill';
import { projectsService } from '@/services/projects.service';
import { profileService } from '@/services/profile.service';
import { experienceService } from '@/services/experience.service';
import { skillsService } from '@/services/skills.service';

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

  // Live database data loaded from real Go Backend APIs
  const [liveProjects, setLiveProjects] = React.useState<Project[] | null>(null);
  const [liveProfile, setLiveProfile] = React.useState<Profile | null>(null);
  const [liveExperiences, setLiveExperiences] = React.useState<Experience[] | null>(null);
  const [liveSkills, setLiveSkills] = React.useState<SkillCategory[] | null>(null);

  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  React.useEffect(() => {
    let isCancelled = false;

    // Fetch all real database data from Go Backend API
    Promise.all([
      projectsService.getProjects('all', language),
      profileService.getProfile(language),
      experienceService.getExperiences(language),
      skillsService.getSkillCategories(language),
    ])
      .then(([projects, profile, experiences, skills]) => {
        if (isCancelled) return;
        if (projects && projects.length > 0) setLiveProjects(projects);
        if (profile) setLiveProfile(profile);
        if (experiences && experiences.length > 0) setLiveExperiences(experiences);
        if (skills && skills.length > 0) setLiveSkills(skills);
      })
      .catch((err) => {
        console.warn('[I18nProvider] Failed to fetch live data from Backend API:', err);
      });

    return () => {
      isCancelled = true;
    };
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
      profile: liveProfile || activeBundle.profile,
      projects: liveProjects || activeBundle.projects,
      experiences: liveExperiences || activeBundle.experiences,
      skillCategories: liveSkills || activeBundle.skillCategories,
      isHydrated: true,
    }),
    [language, setLanguage, toggleLanguage, activeBundle, liveProfile, liveProjects, liveExperiences, liveSkills]
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
