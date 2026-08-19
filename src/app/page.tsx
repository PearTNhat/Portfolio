import { HeroSection } from '@/features/profile/components/hero-section';
import { SkillsGrid } from '@/features/skills/components/skills-grid';
import { ProjectGrid } from '@/features/projects/components/project-grid';
import { ExperienceTimeline } from '@/features/experience/components/experience-timeline';
import { ContactSection } from '@/features/contact/components/contact-section';
import { AnimatedBackground } from '@/components/ui/animated-background';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full relative">
      {/* Dynamic Animated Cyber Background with Glowing Orbs & Tech Constellations */}
      <AnimatedBackground />

      {/* 1. Hero & Interactive Profile Overview */}
      <HeroSection />

      {/* 2. Technical Arsenal & Skills (Immediately visible to recruiter) */}
      <SkillsGrid />

      {/* 3. Featured Commercial & Personal Projects */}
      <ProjectGrid />

      {/* 4. Work Experience & Education Timeline */}
      <ExperienceTimeline />

      {/* 5. Contact Form & Direct Coordinates */}
      <ContactSection />
    </div>
  );
}
