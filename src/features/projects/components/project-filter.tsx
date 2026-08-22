'use client';

import * as React from 'react';
import { ProjectCategory } from '@/types/project';
import { useI18n } from '@/store/i18n-provider';

export interface ProjectFilterProps {
  selectedCategory: ProjectCategory;
  onSelectCategory: (category: ProjectCategory) => void;
  counts: Record<ProjectCategory, number>;
}

export function ProjectFilter({
  selectedCategory,
  onSelectCategory,
  counts,
}: ProjectFilterProps) {
  const { ui } = useI18n();

  const filters: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: ui.projectsSection.filters.all },
    { id: 'blockchain', label: ui.projectsSection.filters.blockchain },
    { id: 'storage', label: ui.projectsSection.filters.storage },
    { id: 'ecommerce', label: ui.projectsSection.filters.ecommerce },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
      {filters.map((f) => {
        const isActive = selectedCategory === f.id;
        const count = counts[f.id] ?? 0;

        return (
          <button
            key={f.id}
            onClick={() => onSelectCategory(f.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              isActive
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                isActive
                  ? 'bg-slate-950 text-cyan-400 font-mono'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
