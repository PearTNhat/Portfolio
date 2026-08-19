'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, FileDown, MessageCircle, ChevronDown } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { SITE_METADATA } from '@/lib/constants';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layouts/container';
import { useI18n } from '@/store/i18n-provider';

export function Navbar() {
  const { ui } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = React.useState(false);
  const resumeDropdownRef = React.useRef<HTMLDivElement>(null);

  const navItems = React.useMemo(
    () => [
      { label: ui.navbar.overview, href: '#overview' },
      { label: ui.navbar.skills, href: '#skills' },
      { label: ui.navbar.projects, href: '#projects' },
      { label: ui.navbar.experience, href: '#experience' },
      { label: ui.navbar.contact, href: '#contact' },
    ],
    [ui.navbar]
  );

  const sectionIds = navItems.map((item) => item.href.replace('#', ''));
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
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo / Brand Monogram */}
          <Link
            href="#overview"
            className="flex items-center gap-2.5 group shrink-0"
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

          {/* Desktop Navigation Links (Shown on Desktop >= 1024px) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const id = item.href.replace('#', '');
              const isActive = activeSection === id;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-150 ${
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

          {/* Right Action Bar (Responsive) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Direct Zalo link (Desktop >= 1024px) */}
            <a
              href={SITE_METADATA.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold transition-all shadow-xs"
              title="Direct Zalo Chat: 0944 477 357"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{ui.navbar.zaloButton}</span>
              <span className="xl:hidden">Zalo</span>
            </a>

            {/* GitHub Profile Link (Tablet & Desktop >= 768px) */}
            <a
              href={SITE_METADATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Language Switcher Dropdown (Always visible, compact) */}
            <LanguageToggle />

            {/* Resume Dropdown Button (Tablet & Desktop >= 640px) */}
            <div className="hidden sm:block relative" ref={resumeDropdownRef}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileDown className="w-4 h-4" />}
                rightIcon={<ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${resumeMenuOpen ? 'rotate-180' : ''}`} />}
                onClick={() => setResumeMenuOpen(!resumeMenuOpen)}
                className="font-bold shadow-sm shadow-cyan-500/20 text-xs sm:text-sm"
              >
                {ui.navbar.resume}
              </Button>

              {resumeMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {ui.navbar.selectTargetCv}
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
                        {ui.navbar.cvGolang}
                      </span>
                      <FileDown className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      {ui.navbar.cvGolangDesc}
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
                        {ui.navbar.cvBlockchain}
                      </span>
                      <FileDown className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      {ui.navbar.cvBlockchainDesc}
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Hamburger Menu Button (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="space-y-1">
            {navItems.map((item) => {
              const id = item.href.replace('#', '');
              const isActive = activeSection === id;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Actions in Mobile Menu */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2 px-1">
              <a
                href={SITE_METADATA.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Zalo</span>
              </a>

              <a
                href={SITE_METADATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

            {/* Target Resume Downloads */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1 font-bold">
                {ui.navbar.selectTargetCv}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    {ui.navbar.cvGolang}
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
                    {ui.navbar.cvBlockchain}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
