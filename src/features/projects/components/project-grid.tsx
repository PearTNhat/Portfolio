'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectCategory } from '@/types/project';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { ProjectCard } from '@/features/projects/components/project-card';
import { ProjectFilter } from '@/features/projects/components/project-filter';
import { ProjectModal } from '@/features/projects/components/project-modal';

export interface ProjectGridProps {
  initialProjects: Project[];
}

export function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ProjectCategory>('all');
  const [activeProject, setActiveProject] = React.useState<Project | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Compute counts per category
  const counts: Record<ProjectCategory, number> = {
    all: initialProjects.length,
    blockchain: initialProjects.filter((p) => p.category === 'blockchain').length,
    backend: initialProjects.filter((p) => p.category === 'backend').length,
    personal: initialProjects.filter((p) => p.category === 'personal').length,
  };

  const filteredProjects = selectedCategory === 'all'
    ? initialProjects
    : initialProjects.filter((p) => p.category === selectedCategory);

  const handleViewDetails = (project: Project) => {
    setActiveProject(project);
    setModalOpen(true);
  };

  return (
    <section id="projects" className="py-20 sm:py-28 relative">
      <Container size="xl">
        <SectionHeader
          badge="Featured Engineering"
          title="Commercial & Personal Projects"
          subtitle="Real-world production engineering on Layer 1 blockchains, QUIC protocols, Web3 RPCs, and event-driven Go microservices."
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

        {/* Project Details Modal */}
        <ProjectModal
          project={activeProject}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Container>
    </section>
  );
}
