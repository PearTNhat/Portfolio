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
}
