import { Profile } from '@/types/profile';
import { Project } from '@/types/project';
import { Experience } from '@/types/experience';
import { SkillCategory } from '@/types/skill';

export type Language = 'vi' | 'en';

export interface I18nUiDictionary {
  navbar: {
    overview: string;
    skills: string;
    projects: string;
    experience: string;
    contact: string;
    resume: string;
    selectTargetCv: string;
    cvGolang: string;
    cvGolangDesc: string;
    cvBlockchain: string;
    cvBlockchainDesc: string;
    zaloButton: string;
  };
  hero: {
    readyBadge: {
      prefix: string;
      role1: string;
      and: string;
      role2: string;
    };
    greeting: string;
    focusPrefix: string;
    typingRoles: string[];
    downloadCvGo: string;
    downloadCvBlockchain: string;
    contactMe: string;
  };
  profileCard: {
    verifiedEngineer: string;
    ptitEducation: string;
    openForHire: string;
    coreDomains: string;
    githubDesc: string;
    phoneZaloTitle: string;
    emailTitle: string;
    locationTitle: string;
    copyTooltip: string;
    copiedTooltip: string;
  };
  skillsSection: {
    badge: string;
    title: string;
    subtitle: string;
  };
  projectsSection: {
    badge: string;
    title: string;
    subtitle: string;
    filters: {
      all: string;
      blockchain: string;
      backend: string;
      personal: string;
    };
    personalProject: string;
    commercialProject: string;
    liveDemo: string;
    viewSpecs: string;
    modalRole: string;
    modalTeamSize: string;
    keyDeliverables: string;
    techArchitecture: string;
    techStack: string;
    close: string;
    moreTech: string;
  };
  experienceSection: {
    badge: string;
    title: string;
    subtitle: string;
    present: string;
    responsibilities: string;
    stackAndTools: string;
    educationMajor: string;
  };
  contactSection: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sending: string;
    sendMessage: string;
    successMessage: string;
    errorMessage: string;
    requiredFieldsError: string;
    coordinatesTitle: string;
    openZalo: string;
  };
  footer: {
    summary: string;
    navigation: string;
    contactAndInfo: string;
    allRightsReserved: string;
    availableForWork: string;
    backToTop: string;
  };
  notFound: {
    badge: string;
    title: string;
    description: string;
    returnHome: string;
  };
}

export interface I18nDataBundle {
  ui: I18nUiDictionary;
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  skillCategories: SkillCategory[];
}
