import { I18nSlice, I18nString } from '@/types/project';

export interface QuickStat {
  id: string;
  label: string;
  value: string;
  description: string;
  highlight?: string;
}

export interface SocialLink {
  platform: 'github' | 'email' | 'phone' | 'location' | 'linkedin' | 'telegram' | string;
  label: string;
  value: string;
  href: string;
  icon: string;
}

export interface Profile {
  id?: string;
  name: string;
  title: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  githubUsername: string;
  avatarUrl?: string;
  stats: QuickStat[];
  socials: SocialLink[];
  highlights: string[];
  education: {
    institution: string;
    degree: string;
    period: string;
    major: string;
  };
}

export const DEFAULT_PROFILE: Profile = {
  name: 'Lê Tuấn Nhật',
  title: 'Kỹ Sư Backend (Golang) & Blockchain',
  tagline: 'Phát triển hệ thống backend bằng Golang, kiến trúc Blockchain Layer 1 và giao thức Rust/QUIC.',
  summary: '',
  location: 'Hồ Chí Minh, Việt Nam',
  email: 'letuannhat105@gmail.com',
  phone: '0944477357',
  github: 'https://github.com/PearTNhat',
  githubUsername: 'PearTNhat',
  stats: [],
  socials: [],
  highlights: [],
  education: {
    institution: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
    degree: 'Kỹ sư Công nghệ Thông tin',
    period: '2021 - 2026',
    major: 'Công nghệ Thông tin',
  },
};

export interface RawQuickStat {
  id: string;
  label: I18nString;
  value: string;
  description: I18nString;
  highlight?: I18nString;
}

export interface RawSocialLink {
  platform: string;
  label: I18nString;
  value: string;
  href: string;
  icon: string;
}

export interface RawEducation {
  institution: I18nString;
  degree: I18nString;
  period: string;
  major: I18nString;
}

export interface RawProfile {
  id?: string;
  name: string;
  title: I18nString;
  tagline: I18nString;
  summary: I18nString;
  location: I18nString;
  email: string;
  phone: string;
  github: string;
  githubUsername: string;
  avatarUrl?: string;
  stats?: RawQuickStat[];
  socials?: RawSocialLink[];
  highlights?: I18nSlice;
  education?: RawEducation;
  createdAt?: string;
  updatedAt?: string;
}
