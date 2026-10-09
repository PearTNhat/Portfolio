import { I18nSlice, I18nString } from '@/types/project';

export interface ExperienceProject {
  name: string;
  role: string;
  technologies: string[];
  description: string;
  contributions: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  projects: ExperienceProject[];
  technologies: string[];
  order?: number;
}

export interface RawExperienceProject {
  name: I18nString;
  role: I18nString;
  technologies: string[];
  description: I18nString;
  contributions: I18nSlice;
}

export interface RawExperience {
  id?: string;
  company: I18nString;
  position: I18nString;
  location: I18nString;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: I18nString;
  projects: RawExperienceProject[];
  technologies: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
