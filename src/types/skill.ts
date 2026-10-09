import { I18nString } from '@/types/project';

export interface SkillItem {
  name: string;
  note?: string;
  icon?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  skills: SkillItem[];
  order?: number;
}

export interface RawSkillItem {
  name: string;
  note?: I18nString;
  icon?: string;
}

export interface RawSkillCategory {
  id?: string;
  title: I18nString;
  subtitle: I18nString;
  icon: string;
  skills: RawSkillItem[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
