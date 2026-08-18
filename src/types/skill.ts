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
}
