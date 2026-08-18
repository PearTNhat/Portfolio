'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, FileDown, MessageCircle, ChevronDown } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { NAV_ITEMS, SITE_METADATA } from '@/lib/constants';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layouts/container';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = React.useState(false);
  const resumeDropdownRef = React.useRef<HTMLDivElement>(null);
  const sectionIds = NAV_ITEMS.map((item) => item.href.replace('#', ''));
  const activeSection = useScrollSpy(sectionIds);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(event.target as Node)) {
        setResumeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md transition-colors">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand Monogram */}
          <Link
            href="#overview"
            className="flex items-center gap-2.5 group"
            aria-label="Lê Tuấn Nhật (LTN) Portfolio"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-sm shadow-cyan-500/20 group-hover:shadow-md group-hover:shadow-cyan-500/30 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-400 font-black font-mono text-xs tracking-wider group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                LTN
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Lê Tuấn Nhật
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400/90 -mt-0.5 font-medium">
                Blockchain &amp; Go
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const id = item.href.replace('#', '');
              const isActive = activeSection === id;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Targeted Resume Dropdown */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Direct Zalo link */}
            <a
              href={SITE_METADATA.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold transition-all shadow-xs"
              title="Direct Zalo Chat: 0944 477 357"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Zalo: 0944 477 357</span>
              <span className="lg:hidden">Zalo</span>
            </a>

            <a
              href={SITE_METADATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            <ThemeToggle />

            {/* Resume Dropdown */}
            <div className="relative" ref={resumeDropdownRef}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileDown className="w-4 h-4" />}
                rightIcon={<ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${resumeMenuOpen ? 'rotate-180' : ''}`} />}
                onClick={() => setResumeMenuOpen(!resumeMenuOpen)}
                className="font-bold shadow-sm shadow-cyan-500/20"
              >
                Resume
              </Button>

              {resumeMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Select Target CV (PDF)
                  </div>
                  <a
                    href="/cv/CV-LeTuanNhat-Go.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="CV-LeTuanNhat-Go.pdf"
                    onClick={() => setResumeMenuOpen(false)}
                    className="flex flex-col p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                        CV Golang Backend
                      </span>
                      <FileDown className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      Target: Go Backend &amp; Systems
                    </span>
                  </a>

                  <a
                    href="/cv/CV-LeTuanNhat-Blockchain.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="CV-LeTuanNhat-Blockchain.pdf"
                    onClick={() => setResumeMenuOpen(false)}
                    className="flex flex-col p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                        CV Blockchain Engineer
                      </span>
                      <FileDown className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      Target: Layer 1, EVM &amp; Web3
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1 font-bold">
              Download Targeted CV (PDF)
            </div>
            <div className="grid grid-cols-1 gap-2">
              <a
                href="/cv/CV-LeTuanNhat-Go.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="CV-LeTuanNhat-Go.pdf"
                className="w-full"
              >
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-start text-xs font-bold"
                  leftIcon={<FileDown className="w-4 h-4" />}
                >
                  CV Golang Backend
                </Button>
              </a>

              <a
                href="/cv/CV-LeTuanNhat-Blockchain.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="CV-LeTuanNhat-Blockchain.pdf"
                className="w-full"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start text-xs font-bold border-cyan-500/30 text-cyan-700 dark:text-cyan-300"
                  leftIcon={<FileDown className="w-4 h-4" />}
                >
                  CV Blockchain Developer
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
