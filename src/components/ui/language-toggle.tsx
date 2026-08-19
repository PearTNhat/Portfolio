'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/store/i18n-provider';
import { Language } from '@/lib/i18n/types';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useI18n();

  const options: { id: Language; label: string; flag: string; fullLabel: string }[] = [
    { id: 'vi', label: 'VI', flag: '🇻🇳', fullLabel: 'Tiếng Việt' },
    { id: 'en', label: 'EN', flag: '🇬🇧', fullLabel: 'English' },
  ];

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-700/80 backdrop-blur-md shadow-xs ${className}`}
    >
      {options.map((opt) => {
        const isActive = language === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLanguage(opt.id)}
            title={opt.fullLabel}
            aria-pressed={isActive}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none ${
              isActive
                ? 'text-cyan-700 dark:text-cyan-300'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="active-lang-pill"
                className="absolute inset-0 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-cyan-500/30 dark:border-cyan-400/30"
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            )}
            <span className="relative z-10 text-xs">{opt.flag}</span>
            <span className="relative z-10 text-[11px] font-bold">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
