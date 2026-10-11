export type ProjectType = 'commercial' | 'personal';
export type ProjectCategory = 'all' | 'blockchain' | 'storage' | 'ecommerce';

export type I18nString = Record<string, string>;
export type I18nSlice = Record<string, string[]>;

export interface I18nArchitectureDetail {
  title: I18nString;
  description: I18nString;
  points: I18nSlice;
}

export interface ArchitectureDetail {
  title: string;
  description: string;
  points: string[];
}

export interface ProjectMedia {
  type: 'image' | 'video' | 'diagram';
  url: string;
  caption: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  type: ProjectType;
  category: ProjectCategory;
  featured: boolean;
  order: number;
  period?: string;
  role?: string;
  teamSize?: string | number;
  metrics?: {
    label: string;
    value: string;
  }[];
  technologies: string[];
  contributions: string[];
  architecture?: ArchitectureDetail;
  // Proof of Work & Verification links
  githubUrl?: string;
  githubServerUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  videoDemoUrl?: string;
  docsUrl?: string;
  images?: string[];
  thumbnail?: string;
  badgeText?: string;
  verificationStatus?: 'Production System' | 'Open Source Repo' | 'Live System' | 'Live Demo';

  // Bilingual / Multi-language support (JSONB raw maps)
  titleI18n?: I18nString;
  subtitleI18n?: I18nString;
  descriptionI18n?: I18nString;
  roleI18n?: I18nString;
  badgeTextI18n?: I18nString;
  contributionsI18n?: I18nSlice;
  architectureI18n?: I18nArchitectureDetail;
}

export type ProjectSummary = Pick<
  Project,
  | 'id'
  | 'slug'
  | 'title'
  | 'subtitle'
  | 'description'
  | 'type'
  | 'category'
  | 'featured'
  | 'order'
  | 'metrics'
  | 'technologies'
  | 'githubUrl'
  | 'githubServerUrl'
  | 'liveUrl'
  | 'playStoreUrl'
  | 'thumbnail'
  | 'badgeText'
  | 'verificationStatus'
>;
