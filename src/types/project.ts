export type ProjectType = 'commercial' | 'personal';
export type ProjectCategory = 'all' | 'blockchain' | 'backend' | 'personal';

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
  videoDemoUrl?: string;
  docsUrl?: string;
  images?: string[];
  badgeText?: string;
  verificationStatus?: 'Production System' | 'Open Source Repo' | 'Live System' | 'Live Demo';
}
