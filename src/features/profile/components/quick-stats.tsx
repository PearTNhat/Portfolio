'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { QuickStat } from '@/types/profile';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/store/i18n-provider';

export interface QuickStatsProps {
  stats?: QuickStat[];
}

export function QuickStats({ stats: initialStats }: QuickStatsProps) {
  const { profile } = useI18n();
  const stats = initialStats || profile.stats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card
            className="p-5 relative overflow-hidden group border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md hover:border-cyan-500/50 shadow-md hover:shadow-cyan-500/10 transition-all duration-300 h-full"
          >
            {/* Colorful top accent gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-1 relative z-10">
              {stat.highlight && (
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  {stat.highlight}
                </span>
              )}
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {stat.label}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 pt-0.5">
                {stat.description}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
