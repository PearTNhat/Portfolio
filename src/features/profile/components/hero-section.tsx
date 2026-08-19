'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileDown, Mail, ArrowRight, ShieldCheck, Cpu, Database, Network } from 'lucide-react';
import { Profile } from '@/types/profile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layouts/container';
import { ProfileFocusCard } from '@/features/profile/components/profile-focus-card';
import { QuickStats } from '@/features/profile/components/quick-stats';
import { AnimatedTyping } from '@/components/ui/animated-typing';
import { useI18n } from '@/store/i18n-provider';

export interface HeroSectionProps {
  profile?: Profile;
}

export function HeroSection({ profile: initialProfile }: HeroSectionProps) {
  const { ui, profile: contextProfile } = useI18n();
  const profile = initialProfile || contextProfile;

  return (
    <section id="overview" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-grid-pattern">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bio & Core Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Animated Status indicator - High Visibility for Recruiters */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/50 border-2 border-emerald-500/40 dark:border-emerald-500/50 text-slate-900 dark:text-white shadow-lg shadow-emerald-500/10 backdrop-blur-md"
            >
              <span className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-sm" />
              </span>
              <div className="text-xs sm:text-sm font-bold tracking-tight">
                <span className="text-slate-700 dark:text-slate-200">{ui.hero.readyBadge.prefix}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  {ui.hero.readyBadge.role1}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{ui.hero.readyBadge.and}</span>
                <span className="text-cyan-600 dark:text-cyan-300 font-black">
                  {ui.hero.readyBadge.role2}
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                {ui.hero.greeting}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-sky-400 text-gradient-animated">
                  {profile.name}
                </span>
              </h1>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-slate-600 dark:text-slate-300">{ui.hero.focusPrefix}</span>
                <AnimatedTyping words={ui.hero.typingRoles} />
              </div>
            </div>

            {/* Summary */}
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              {profile.summary}
            </p>

            {/* Technical Highlights Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="cyan" size="md">
                <Cpu className="w-3.5 h-3.5 mr-1" /> Golang Backend
              </Badge>
              <Badge variant="indigo" size="md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Rust Systems
              </Badge>
              <Badge variant="emerald" size="md">
                <Database className="w-3.5 h-3.5 mr-1" /> Blockchain & EVM
              </Badge>
              <Badge variant="slate" size="md">
                <Network className="w-3.5 h-3.5 mr-1" /> ReactJS & Next.js
              </Badge>
            </div>

            {/* CTA Buttons - Dual Targeted CV Downloads */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="/cv/CV-LeTuanNhat-Go.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="CV-LeTuanNhat-Go.pdf"
                className="group/cv"
              >
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<FileDown className="w-5 h-5 group-hover/cv:-translate-y-0.5 transition-transform" />}
                  className="shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-bold"
                >
                  {ui.hero.downloadCvGo}
                </Button>
              </a>

              <a
                href="/cv/CV-LeTuanNhat-Blockchain.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="CV-LeTuanNhat-Blockchain.pdf"
                className="group/cv"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<FileDown className="w-5 h-5 group-hover/cv:-translate-y-0.5 transition-transform" />}
                  className="border border-cyan-500/35 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold"
                >
                  {ui.hero.downloadCvBlockchain}
                </Button>
              </a>

              <Link href="#contact">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Mail className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  {ui.hero.contactMe}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Engineering Focus & Verification Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 w-full relative"
          >
            <ProfileFocusCard />
          </motion.div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-14 sm:mt-20">
          <QuickStats stats={profile.stats} />
        </div>
      </Container>
    </section>
  );
}
