'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { SkillCategory } from '@/types/skill';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { SkillCard } from '@/features/skills/components/skill-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/store/i18n-provider';

export interface SkillsGridProps {
  categories?: SkillCategory[];
}

export function SkillsGridSkeleton() {
  return (
    <section id="skills" className="py-20 sm:py-28 bg-slate-100/40 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <Container size="xl">
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <Skeleton className="h-6 w-28 rounded-full mx-auto" />
          <Skeleton className="h-10 w-72 rounded-2xl mx-auto" />
          <Skeleton className="h-5 w-96 rounded-xl max-w-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-24 rounded-lg" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
              </div>
              <div className="space-y-2.5 pt-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SkillsGrid({ categories: initialCategories }: SkillsGridProps) {
  const { ui, skillCategories: contextCategories, isLoading } = useI18n();
  const categories = initialCategories || contextCategories;

  if (isLoading && !initialCategories) {
    return <SkillsGridSkeleton />;
  }

  return (
    <section id="skills" className="py-20 sm:py-28 bg-slate-100/40 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80 relative">
      <Container size="xl">
        <SectionHeader
          badge={ui.skillsSection.badge}
          title={ui.skillsSection.title}
          subtitle={ui.skillsSection.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <SkillCard category={cat} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
