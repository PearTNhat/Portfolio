import { profileService } from '@/services/profile.service';
import { projectsService } from '@/services/projects.service';
import { experienceService } from '@/services/experience.service';
import { skillsService } from '@/services/skills.service';
import { HeroSection } from '@/features/profile/components/hero-section';
import { SkillsGrid } from '@/features/skills/components/skills-grid';
import { ProjectGrid } from '@/features/projects/components/project-grid';
import { ExperienceTimeline } from '@/features/experience/components/experience-timeline';
import { ContactSection } from '@/features/contact/components/contact-section';

export default async function HomePage() {
  // Concurrently fetch all section data avoiding waterfalls per RULES.md
  const [profile, projects, experiences, skillCategories] = await Promise.all([
    profileService.getProfile(),
    projectsService.getProjects(),
    experienceService.getExperiences(),
    skillsService.getSkillCategories(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero & Interactive Terminal */}
      <HeroSection profile={profile} />

      {/* 2. Technical Arsenal & Skills (Immediately visible to recruiter) */}
      <SkillsGrid categories={skillCategories} />

      {/* 3. Featured Commercial & Personal Projects */}
      <ProjectGrid initialProjects={projects} />

      {/* 4. Work Experience & Education Timeline */}
      <ExperienceTimeline
        experiences={experiences}
        education={profile.education}
      />

      {/* 5. Contact Form & Direct Coordinates */}
      <ContactSection profile={profile} />
    </div>
  );
}
