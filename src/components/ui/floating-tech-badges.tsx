'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { SiRust, SiApachekafka } from 'react-icons/si';
import { Zap } from 'lucide-react';

export function FloatingTechBadges() {
  return (
    <>
      {/* Floating Badge 1: 12K TPS DAG/BFT - Top Left */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: [0, -10, 0],
          rotate: [0, 1.5, 0],
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.6 },
        }}
        className="hidden xl:flex absolute -top-5 -left-6 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-cyan-500/40 shadow-xl shadow-cyan-500/15 backdrop-blur-sm z-20 pointer-events-none transform-gpu"
      >
        <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-500">
          <Zap className="w-4 h-4" />
        </div>
        <div className="font-mono text-xs">
          <div className="font-black text-slate-900 dark:text-cyan-300">12,000 TPS</div>
          <div className="text-[10px] text-slate-500">DAG + BFT L1</div>
        </div>
      </motion.div>

      {/* Floating Badge 2: Rust QUIC - Center Right */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: [0, 10, 0],
          rotate: [0, -1.5, 0],
        }}
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          opacity: { duration: 0.6, delay: 0.2 },
        }}
        className="hidden xl:flex absolute top-1/4 -right-7 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-orange-500/40 shadow-xl shadow-orange-500/15 backdrop-blur-sm z-20 pointer-events-none transform-gpu"
      >
        <div className="p-1 rounded-lg bg-orange-500/15 text-orange-500">
          <SiRust className="w-4 h-4 text-[#DEA584] dark:text-[#F74C00]" />
        </div>
        <div className="font-mono text-xs">
          <div className="font-black text-slate-900 dark:text-orange-300">Rust QUIC</div>
          <div className="text-[10px] text-slate-500">Zero TCP Blocking</div>
        </div>
      </motion.div>

      {/* Floating Badge 3: Kafka Streaming - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: [0, -10, 0],
          rotate: [0, 1.5, 0],
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          opacity: { duration: 0.6, delay: 0.4 },
        }}
        className="hidden xl:flex absolute -bottom-5 -left-5 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-pink-500/40 shadow-xl shadow-pink-500/15 backdrop-blur-sm z-20 pointer-events-none transform-gpu"
      >
        <div className="p-1 rounded-lg bg-pink-500/15 text-pink-500">
          <SiApachekafka className="w-4 h-4 text-[#E535AB]" />
        </div>
        <div className="font-mono text-xs">
          <div className="font-black text-slate-900 dark:text-pink-300">Kafka &amp; gRPC</div>
          <div className="text-[10px] text-slate-500">Event-Driven IPC</div>
        </div>
      </motion.div>
    </>
  );
}

