import * as React from 'react';
import Link from 'next/link';
import { Terminal, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { SITE_METADATA } from '@/lib/constants';
import { Container } from '@/components/layouts/container';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 transition-colors">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Summary */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="#overview"
              className="flex items-center gap-2.5 group"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-sm shadow-cyan-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 dark:bg-slate-900 text-cyan-400 font-black font-mono text-[11px] tracking-wider">
                  LTN
                </div>
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Lê Tuấn Nhật <span className="text-cyan-500 font-normal text-xs">/ Blockchain &amp; Go</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Building Layer 1 blockchain consensus architectures, EVM state trie engines, Rust/QUIC protocols, and high-performance Go backend systems.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={SITE_METADATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${SITE_METADATA.email}`}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${SITE_METADATA.phone}`}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#overview" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="#skills" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Skills & Stack
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Projects (Commercial & Personal)
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Work Experience
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 font-mono">
              Contact & Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{SITE_METADATA.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                <a href={`mailto:${SITE_METADATA.email}`} className="hover:underline">
                  {SITE_METADATA.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{SITE_METADATA.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} Lê Tuấn Nhật. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Opportunities
            </span>
            <Link
              href="#overview"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
