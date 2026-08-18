export interface QuickStat {
  id: string;
  label: string;
  value: string;
  description: string;
  highlight?: string;
}

export interface SocialLink {
  platform: 'github' | 'email' | 'phone' | 'location' | 'linkedin' | 'telegram';
  label: string;
  value: string;
  href: string;
  icon: string;
}

export interface Profile {
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
  resumeUrl: string;
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
