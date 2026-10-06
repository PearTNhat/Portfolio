'use client';

import * as React from 'react';
import { Project } from '@/types/project';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { getTechIcon } from '@/components/ui/tech-icons';
import { GithubIcon } from '@/components/ui/icons';
import { CheckCircle2, ExternalLink, Layers, Smartphone } from 'lucide-react';
import { useI18n } from '@/store/i18n-provider';
import { RichTextContent } from '@/features/projects/components/rich-text-content';
import { formatMediaUrl } from '@/services/upload.service';

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { ui, language } = useI18n();
  if (!project) return null;

  const title = project.titleI18n?.[language] || project.title;
  const subtitle = project.subtitleI18n?.[language] || project.subtitle;
  const description = project.descriptionI18n?.[language] || project.description;
  const role = project.roleI18n?.[language] || project.role;
  const contributions = project.contributionsI18n?.[language] || project.contributions;
  const architecture = project.architectureI18n
    ? {
        title: project.architectureI18n.title[language] || project.architecture?.title || '',
        description: project.architectureI18n.description[language] || project.architecture?.description || '',
        points: project.architectureI18n.points[language] || project.architecture?.points || [],
      }
    : project.architecture;

  const coverImage = project.thumbnail || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="3xl" title={title}>
      <div className="space-y-6 text-sm">
        {/* Optional Cover / Brand Banner */}
        {coverImage && (
          <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-2xl bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-radial from-slate-800/30 to-slate-950/90 pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formatMediaUrl(coverImage)}
              alt={title}
              className="max-h-full max-w-full object-contain relative z-10 drop-shadow-md"
            />
          </div>
        )}

        {/* Header Badges & Proof Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs sm:text-sm">
              {subtitle}
            </div>
            {role && (
              <div className="text-slate-500 dark:text-slate-400 text-xs pt-1">
                {ui.projectsSection.modalRole}: <span className="text-slate-900 dark:text-slate-200 font-semibold">{role}</span>
                {project.teamSize !== undefined && (
                  <span>
                    {' '}• {ui.projectsSection.modalTeamSize}: <span className="text-slate-900 dark:text-slate-200 font-semibold">{project.teamSize}</span>
                  </span>
                )}
                {project.period && <span> • {project.period}</span>}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.playStoreUrl && (
              <a
                href={project.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm font-mono font-bold"
                title="Production Android Client on Google Play"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{ui.projectsSection.playStore}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm font-mono font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{ui.projectsSection.liveDemo}</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-100 border border-slate-800 dark:border-slate-700 transition-colors shadow-sm"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>{project.githubServerUrl ? ui.projectsSection.githubFrontend : ui.projectsSection.githubSource}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {project.githubServerUrl && (
              <a
                href={project.githubServerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-100 border border-slate-800 dark:border-slate-700 transition-colors shadow-sm"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>{ui.projectsSection.githubBackend}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <RichTextContent content={description} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base" />

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

        {/* Key Deliverables & Responsibilities */}
        {contributions && contributions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {ui.projectsSection.keyDeliverables}
            </h4>
            <ul className="space-y-2.5">
              {contributions.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug text-xs sm:text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Architecture Specs */}
        {architecture && (
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 font-mono text-xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-tight font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              {architecture.title || ui.projectsSection.techArchitecture}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
              {architecture.description}
            </p>
            {architecture.points && (
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 pt-1">
                {architecture.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-1.5 font-sans">
                    <span className="text-cyan-500 font-mono font-bold">→</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Technologies Used */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            {ui.projectsSection.techStack}
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
        <div className="pt-3 flex items-center justify-end border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            {ui.projectsSection.close}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
