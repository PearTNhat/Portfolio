'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCategory, ProjectSummary } from '@/types/project';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { ProjectCard } from '@/features/projects/components/project-card';
import { ProjectFilter } from '@/features/projects/components/project-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/store/i18n-provider';
import { useRouter } from 'next/navigation';

export interface ProjectGridProps {
  initialProjects?: ProjectSummary[];
}

export function ProjectGridSkeleton() {
  return (
    <section id="projects" className="pt-6 sm:pt-8 pb-20 sm:pb-28 relative">
      <Container size="xl">
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <Skeleton className="h-6 w-28 rounded-full mx-auto" />
          <Skeleton className="h-10 w-72 rounded-2xl mx-auto" />
          <Skeleton className="h-5 w-96 rounded-xl max-w-full mx-auto" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {/* Project Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-sm"
            >
              <Skeleton className="h-52 w-full rounded-xl" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-7 w-3/4 rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const { ui, projects: contextProjects, isLoading } = useI18n();
  const projects = initialProjects || contextProjects;
  const [selectedCategory, setSelectedCategory] = React.useState<ProjectCategory>('all');
  const router = useRouter();

  if (isLoading && !initialProjects) {
    return <ProjectGridSkeleton />;
  }

  // Compute counts per category
  const counts: Record<ProjectCategory, number> = {
    all: projects.length,
    blockchain: projects.filter((p) => p.category === 'blockchain').length,
    storage: projects.filter((p) => p.category === 'storage').length,
    ecommerce: projects.filter((p) => p.category === 'ecommerce').length,
  };

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleViewDetails = (project: ProjectSummary) => {
    router.push(`/projects/${encodeURIComponent(project.slug)}`);
  };

  return (
    <section id="projects" className="pt-6 sm:pt-8 pb-20 sm:pb-28 relative">
      <Container size="xl">
        <SectionHeader
          badge={ui.projectsSection.badge}
          title={ui.projectsSection.title}
          subtitle={ui.projectsSection.subtitle}
        />

        {/* Filters */}
        <ProjectFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={counts}
        />

        {/* Projects Grid with AnimatePresence & layout animations */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </Container>
    </section>
  );
}
