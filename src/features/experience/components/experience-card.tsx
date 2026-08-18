import * as React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Experience } from '@/types/experience';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTechIcon } from '@/components/ui/tech-icons';

export interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="p-0 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                {experience.position}
              </span>
              {experience.current && (
                <Badge variant="emerald" size="sm">
                  Present
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {experience.company}
            </CardTitle>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-500" />
              {experience.startDate} — {experience.endDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              {experience.location}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          {experience.summary}
        </p>
      </CardHeader>

      <CardContent className="p-0 pt-5 space-y-4">
        <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
          Core Responsibilities & Deliverables
        </h4>

        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          {experience.projects[0]?.contributions.map((c, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        {/* Technologies overall */}
        <div className="pt-2">
          <div className="text-xs font-mono text-slate-400 mb-2 font-semibold">
            STACK & TOOLS:
          </div>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
              >
                <span className="w-3.5 h-3.5 inline-flex items-center justify-center scale-90">
                  {getTechIcon(tech)}
                </span>
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
