'use client';

import * as React from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useI18n } from '@/store/i18n-provider';
import { Language } from '@/lib/i18n/types';

interface LanguageToggleProps {
  className?: string;
  align?: 'left' | 'right';
}

export function LanguageToggle({ className = '', align = 'right' }: LanguageToggleProps) {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const options: { id: Language; code: string; flag: string; label: string; subLabel: string }[] = [
    { id: 'vi', code: 'VI', flag: '🇻🇳', label: 'Tiếng Việt', subLabel: 'Mặc định' },
    { id: 'en', code: 'EN', flag: '🇬🇧', label: 'English', subLabel: 'International' },
  ];

  const currentOption = options.find((opt) => opt.id === language) || options[0];

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langId: Language) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current language: ${currentOption.label}. Click to change language`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all shadow-xs cursor-pointer select-none group"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
          {currentOption.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Sổ Xuống */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute mt-2 w-48 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-50 ${
            align === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-cyan-500" />
            <span>Ngôn ngữ / Language</span>
          </div>

          <div className="space-y-1">
            {options.map((opt) => {
              const isSelected = language === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{opt.flag}</span>
                    <div className="text-left">
                      <div className="font-semibold leading-tight">{opt.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {opt.subLabel}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-cyan-500 text-slate-950 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
