'use client';

import * as React from 'react';
import { Language, I18nDataBundle, I18nUiDictionary } from '@/lib/i18n/types';
import { VI_DATA } from '@/lib/i18n/dictionaries/vi';
import { EN_DATA } from '@/lib/i18n/dictionaries/en';
import { Profile, DEFAULT_PROFILE } from '@/types/profile';
import { ProjectSummary } from '@/types/project';
import { Experience } from '@/types/experience';
import { SkillCategory } from '@/types/skill';
import { projectsService } from '@/services/projects.service';
import { profileService } from '@/services/profile.service';
import { experienceService } from '@/services/experience.service';
import { skillsService } from '@/services/skills.service';

export const PORTFOLIO_CACHE_PREFIX = 'portfolio_data_cache_v2_';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  ui: I18nUiDictionary;
  profile: Profile;
  projects: ProjectSummary[];
  experiences: Experience[];
  skillCategories: SkillCategory[];
  isHydrated: boolean;
  isLoading: boolean;
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
  const [liveProjects, setLiveProjects] = React.useState<ProjectSummary[] | null>(null);
  const [liveProfile, setLiveProfile] = React.useState<Profile | null>(null);
  const [liveExperiences, setLiveExperiences] = React.useState<Experience[] | null>(null);
  const [liveSkills, setLiveSkills] = React.useState<SkillCategory[] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Load from cache first (Stale-While-Revalidate pattern) and then fetch fresh data from Backend
  React.useEffect(() => {
    let isCancelled = false;
    const cacheKey = `${PORTFOLIO_CACHE_PREFIX}${language}`;

    // 1. Instant hydration from client cache if available
    let hasValidCache = false;
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && (cached.profile || cached.projects?.length || cached.experiences?.length || cached.skills?.length)) {
          if (cached.projects) setLiveProjects(cached.projects);
          if (cached.profile) setLiveProfile(cached.profile);
          if (cached.experiences) setLiveExperiences(cached.experiences);
          if (cached.skills) setLiveSkills(cached.skills);
          hasValidCache = true;
          setIsLoading(false); // Instant render without showing skeleton!
        }
      }
    } catch (e) {
      console.warn('[I18nProvider] Failed to read cache:', e);
    }

    if (!hasValidCache) {
      setIsLoading(true);
    }

    // 2. Fetch fresh real database data from Go Backend API
    const loadLiveData = () => {
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

          // Update cache for next instant load
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                projects: projects && projects.length > 0 ? projects : null,
                profile: profile || null,
                experiences: experiences && experiences.length > 0 ? experiences : null,
                skills: skills && skills.length > 0 ? skills : null,
                cachedAt: Date.now(),
              })
            );
          } catch {
            // QuotaExceeded or private browsing
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('[I18nProvider] Failed to fetch live data from Backend API:', err);
          // If no cache was present and BE failed, end loading so fallback can render
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    };

    loadLiveData();

    // Listen for manual cache invalidation (e.g., after admin edits)
    const handleInvalidate = () => {
      loadLiveData();
    };

    window.addEventListener('portfolio-cache-invalidated', handleInvalidate);

    return () => {
      isCancelled = true;
      window.removeEventListener('portfolio-cache-invalidated', handleInvalidate);
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
      profile: liveProfile || DEFAULT_PROFILE,
      projects: liveProjects || [],
      experiences: liveExperiences || [],
      skillCategories: liveSkills || [],
      isHydrated: true,
      isLoading,
    }),
    [language, setLanguage, toggleLanguage, activeBundle, liveProfile, liveProjects, liveExperiences, liveSkills, isLoading]
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

export function invalidatePortfolioCache() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${PORTFOLIO_CACHE_PREFIX}vi`);
    localStorage.removeItem(`${PORTFOLIO_CACHE_PREFIX}en`);
    window.dispatchEvent(new Event('portfolio-cache-invalidated'));
  } catch {
    // Ignore
  }
}
