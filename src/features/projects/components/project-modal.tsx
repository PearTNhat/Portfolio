'use client';

import * as React from 'react';
import { Project } from '@/types/project';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { getTechIcon } from '@/components/ui/tech-icons';
import { GithubIcon } from '@/components/ui/icons';
import { CheckCircle2, ExternalLink, ShieldCheck, Layers } from 'lucide-react';

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl" title={project.title}>
      <div className="space-y-6 text-sm">
        {/* Header Badges & Proof Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs sm:text-sm">
              {project.subtitle}
            </div>
            {project.role && (
              <div className="text-slate-500 dark:text-slate-400 text-xs pt-1">
                Role: <span className="text-slate-900 dark:text-slate-200 font-semibold">{project.role}</span> • {project.period}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-100 border border-slate-800 dark:border-slate-700 transition-colors shadow-sm"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>GitHub Source</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          {project.description}
        </p>

        {/* Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-center font-mono">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-tight font-medium">
                  {m.label}
                </div>
                <div className="text-sm sm:text-base font-black text-cyan-600 dark:text-cyan-400">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Core Contributions & Verification */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Key Deliverables & Verified Tasks
          </h4>
          <ul className="space-y-2.5">
            {project.contributions.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug text-xs sm:text-sm">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture & Engineering Specs */}
        {project.architecture && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 space-y-3">
            <h4 className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              {project.architecture.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.architecture.description}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
              {project.architecture.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">→</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies with Vector Icons */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Technologies & Tools Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <span className="w-4 h-4 inline-flex items-center justify-center">
                  {getTechIcon(t)}
                </span>
                <span>{t}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            Proof of Work verified by Lê Tuấn Nhật
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </Modal>
  );
}
