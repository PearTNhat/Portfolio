'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, Mail, ArrowRight } from 'lucide-react';
import { SiGo, SiNodedotjs, SiReact } from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { Profile } from '@/types/profile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layouts/container';
import { ProfileFocusCard } from '@/features/profile/components/profile-focus-card';
import { AnimatedTyping } from '@/components/ui/animated-typing';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/store/i18n-provider';

export interface HeroSectionProps {
  profile?: Profile;
}

export function HeroSectionSkeleton() {
  return (
    <section id="overview" className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden bg-grid-pattern">
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-9 w-64 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-14 w-3/4 rounded-2xl" />
              <Skeleton className="h-8 w-1/2 rounded-xl" />
            </div>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-36 rounded-xl" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-5 w-full">
            <div className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded-lg" />
                    <Skeleton className="h-3 w-40 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="space-y-2.5">
                <Skeleton className="h-3 w-28 rounded" />
                <div className="grid grid-cols-2 gap-2.5">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
              </div>
              <div className="pt-2 space-y-2 border-t border-slate-200/80 dark:border-slate-800">
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function HeroSection({ profile: initialProfile }: HeroSectionProps) {
  const { ui, profile: contextProfile, isLoading } = useI18n();
  const profile = initialProfile || contextProfile;

  if (isLoading && !initialProfile) {
    return <HeroSectionSkeleton />;
  }

  return (
    <section id="overview" className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden bg-grid-pattern">
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
              <Badge variant="cyan" size="md" className="gap-1.5 font-semibold">
                <FaJava className="w-3.5 h-3.5 text-[#ED8B00]" /> {ui.hero.badges.java}
              </Badge>
              <Badge variant="emerald" size="md" className="gap-1.5 font-semibold">
                <SiNodedotjs className="w-3.5 h-3.5 text-[#5FA04E]" /> {ui.hero.badges.nodejs}
              </Badge>
              <Badge variant="indigo" size="md" className="gap-1.5 font-semibold">
                <SiGo className="w-3.5 h-3.5 text-[#00ADD8]" /> {ui.hero.badges.go}
              </Badge>
              <Badge variant="slate" size="md" className="gap-1.5 font-semibold">
                <SiReact className="w-3.5 h-3.5 text-[#61DAFB]" /> {ui.hero.badges.react}
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <Link href="#projects" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Layers className="w-4 h-4 sm:w-5 sm:h-5" />}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-0.5" />}
                  className="w-full sm:w-auto shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3"
                >
                  {ui.hero.exploreProjects}
                </Button>
              </Link>

              <Link href="#contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="w-full sm:w-auto text-xs sm:text-sm px-5 py-2.5 sm:py-3 border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800/50 text-slate-800 dark:text-slate-200"
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
      </Container>
    </section>
  );
}
