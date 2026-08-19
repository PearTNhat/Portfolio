'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { SkillCategory } from '@/types/skill';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { SkillCard } from '@/features/skills/components/skill-card';
import { useI18n } from '@/store/i18n-provider';

export interface SkillsGridProps {
  categories?: SkillCategory[];
}

export function SkillsGrid({ categories: initialCategories }: SkillsGridProps) {
  const { ui, skillCategories: contextCategories } = useI18n();
  const categories = initialCategories || contextCategories;

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
