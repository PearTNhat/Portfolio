'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/types/experience';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/store/i18n-provider';

export interface ExperienceTimelineProps {
  experiences?: Experience[];
  education?: {
    institution: string;
    degree: string;
    period: string;
    major: string;
  };
}

export function ExperienceTimelineSkeleton() {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-slate-100/40 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <Container size="xl">
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <Skeleton className="h-6 w-28 rounded-full mx-auto" />
          <Skeleton className="h-10 w-72 rounded-2xl mx-auto" />
          <Skeleton className="h-5 w-96 rounded-xl max-w-full mx-auto" />
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                  <Skeleton className="h-7 w-48 rounded-lg" />
                </div>
                <Skeleton className="h-5 w-36 rounded-md" />
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          ))}

          {/* Education card skeleton */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ExperienceTimeline({
  experiences: initialExperiences,
  education: initialEducation,
}: ExperienceTimelineProps) {
  const { ui, experiences: contextExperiences, profile, isLoading } = useI18n();
  const experiences = initialExperiences || contextExperiences;
  const education = initialEducation || profile.education;

  if (isLoading && !initialExperiences) {
    return <ExperienceTimelineSkeleton />;
  }

  return (
    <section id="experience" className="py-20 sm:py-28 bg-slate-100/40 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <Container size="xl">
        <SectionHeader
          badge={ui.experienceSection.badge}
          title={ui.experienceSection.title}
          subtitle={ui.experienceSection.subtitle}
        />

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Work Experience */}
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ExperienceCard experience={exp} />
              </motion.div>
            ))}
          </div>

          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 shrink-0 border border-indigo-500/20">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {education.institution}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {education.degree} • {ui.experienceSection.educationMajor} {education.major}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/25 self-start sm:self-auto">
                  {education.period}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
