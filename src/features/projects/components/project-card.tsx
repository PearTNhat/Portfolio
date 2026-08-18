'use client';

import * as React from 'react';
import { ChevronRight, Zap, Database, Server, UserCheck, Briefcase, ExternalLink, Video, ShieldCheck, Check } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { getTechIcon } from '@/components/ui/tech-icons';
import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blockchain':
        return <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />;
      case 'backend':
        return <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
      case 'personal':
        return <Server className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      default:
        return <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />;
    }
  };

  const isPersonal = project.type === 'personal';

  return (
    <Card
      hoverable
      className="flex flex-col justify-between h-full group border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
    >
      {/* Colorful Accent top line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-opacity opacity-75 group-hover:opacity-100 ${
          isPersonal
            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
            : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500'
        }`}
      />

      <div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              {getCategoryIcon(project.category)}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant={isPersonal ? 'emerald' : 'cyan'} size="sm">
                {isPersonal ? (
                  <span className="flex items-center gap-1 font-semibold">
                    <UserCheck className="w-3.5 h-3.5" /> Personal Project
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold">
                    <Briefcase className="w-3.5 h-3.5" /> Commercial
                  </span>
                )}
              </Badge>

              {project.verificationStatus && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  <ShieldCheck className="w-3 h-3" />
                  {project.verificationStatus}
                </span>
              )}
            </div>
          </div>

          <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {project.title}
          </CardTitle>
          <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold pt-0.5">
            {project.subtitle}
          </div>
          <CardDescription className="pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3.5">
          {/* Key Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 text-center font-mono">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-tight font-medium">{m.label}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-cyan-300">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Technology Badges with vector icons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80"
              >
                <span className="w-3.5 h-3.5 inline-flex items-center justify-center scale-90">
                  {getTechIcon(tech)}
                </span>
                <span>{tech}</span>
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="text-[11px] text-slate-400 self-center pl-1 font-mono">
                +{project.technologies.length - 5} more
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(project)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          View Specs & Proof
        </Button>

        {/* Action Proof Links */}
        <div className="flex items-center gap-1.5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors"
              title="View Repository & Code Proof"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 transition-colors"
              title="Live Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Proof</span>
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
