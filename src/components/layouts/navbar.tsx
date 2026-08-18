'use client';

import * as React from 'react';
import Link from 'next/link';
import { Terminal, Menu, X, FileDown, MessageCircle } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { NAV_ITEMS, SITE_METADATA } from '@/lib/constants';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layouts/container';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const sectionIds = NAV_ITEMS.map((item) => item.href.replace('#', ''));
  const activeSection = useScrollSpy(sectionIds);

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
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 dark:bg-slate-900 text-cyan-400 font-black font-mono text-xs tracking-wider group-hover:text-white transition-colors">
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Zalo Direct Chat */}
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

            <a
              href="/cv/CV-LeTuanNhat-Blockchain.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="CV-LeTuanNhat-Blockchain.pdf"
            >
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileDown className="w-4 h-4" />}
              >
                Resume
              </Button>
            </a>
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
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <a
              href="/cv/CV-LeTuanNhat-Blockchain.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="CV-LeTuanNhat-Blockchain.pdf"
              className="flex-1"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full"
                leftIcon={<FileDown className="w-4 h-4" />}
              >
                Download CV
              </Button>
            </a>
            <a
              href={SITE_METADATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
