import { HeroSection } from '@/features/profile/components/hero-section';
import { SkillsGrid } from '@/features/skills/components/skills-grid';
import { ProjectGrid } from '@/features/projects/components/project-grid';
import { ExperienceTimeline } from '@/features/experience/components/experience-timeline';
import { ContactSection } from '@/features/contact/components/contact-section';

export default function LocalizedHomePage() {
  return (
    <div className="flex flex-col w-full relative">
      {/* 1. Hero & Interactive Profile Overview */}
      <HeroSection />

      {/* 2. Featured Commercial & Personal Projects */}
      <ProjectGrid />

      {/* 3. Technical Arsenal & Skills */}
      <SkillsGrid />

      {/* 4. Work Experience & Education Timeline */}
      <ExperienceTimeline />

      {/* 5. Contact Form & Direct Coordinates */}
      <ContactSection />
    </div>
  );
}
