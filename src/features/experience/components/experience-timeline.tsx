'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/types/experience';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { ExperienceCard } from '@/features/experience/components/experience-card';
import { GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface ExperienceTimelineProps {
  experiences: Experience[];
  education: {
    institution: string;
    degree: string;
    period: string;
    major: string;
  };
}

export function ExperienceTimeline({
  experiences,
  education,
}: ExperienceTimelineProps) {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-slate-100/40 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <Container size="xl">
        <SectionHeader
          badge="Work History"
          title="Experience & Education"
          subtitle="Commercial development experience in blockchain and distributed backend systems."
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
                      {education.degree} • Major in {education.major}
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
