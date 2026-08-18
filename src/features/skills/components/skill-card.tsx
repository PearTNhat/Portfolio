'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Layers, Database, Cpu } from 'lucide-react';
import { SkillCategory } from '@/types/skill';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTechIcon } from '@/components/ui/tech-icons';

export interface SkillCardProps {
  category: SkillCategory;
}

export function SkillCard({ category }: SkillCardProps) {
  const getHeaderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
      default:
        return <Terminal className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />;
    }
  };

  return (
    <Card className="p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-between h-full hover:border-cyan-500/60 shadow-md hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group">
      <div>
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
              {getHeaderIcon(category.icon)}
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                {category.title}
              </CardTitle>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {category.subtitle}
          </p>
        </CardHeader>

        <CardContent className="p-0 pt-2 space-y-2">
          {category.skills.map((skill, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-2.5 rounded-xl transition-all duration-200 border flex items-start gap-3 bg-slate-50/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/50 hover:bg-cyan-500/5 dark:hover:bg-cyan-950/30 hover:shadow-md cursor-default"
            >
              {/* Technology Icon with hover glow */}
              <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 shadow-xs group-hover/skill:scale-110 transition-transform">
                {getTechIcon(skill.name)}
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {skill.name}
                </div>

                {skill.note && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {skill.note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </div>
    </Card>
  );
}
