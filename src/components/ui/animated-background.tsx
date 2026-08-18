'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Cyber Grid Layer */}
      <div className="absolute inset-0 cyber-grid opacity-75" />

      {/* Radial Gradient Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,rgba(0,173,216,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_60%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_20%_80%,rgba(16,185,129,0.08),transparent_70%)]" />

      {/* Orb 1: Luminous Cyan Orb (Top-Right) */}
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 right-10 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-sky-400/20 to-transparent blur-[90px]"
      />

      {/* Orb 2: Electric Indigo / Purple Orb (Center-Left) */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-500/20 to-transparent blur-[100px]"
      />

      {/* Orb 3: Emerald Web3 Blockchain Orb (Bottom-Right) */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-2/3 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-emerald-500/20 via-teal-400/15 to-transparent blur-[95px]"
      />

      {/* Orb 4: Rose / Magenta Flare (Bottom-Left) */}
      <motion.div
        animate={{
          x: [0, -30, 50, 0],
          y: [0, 50, -40, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-pink-500/18 via-rose-400/15 to-transparent blur-[100px]"
      />

      {/* Floating Constellation Tech Dust Particles */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '20%', size: 4, delay: 0, duration: 6, color: 'bg-cyan-400' },
          { top: '25%', left: '85%', size: 5, delay: 1, duration: 7, color: 'bg-indigo-400' },
          { top: '45%', left: '10%', size: 3, delay: 2, duration: 8, color: 'bg-emerald-400' },
          { top: '60%', left: '90%', size: 4, delay: 1.5, duration: 6.5, color: 'bg-cyan-400' },
          { top: '75%', left: '30%', size: 5, delay: 0.5, duration: 7.5, color: 'bg-purple-400' },
          { top: '88%', left: '70%', size: 3, delay: 3, duration: 9, color: 'bg-pink-400' },
          { top: '35%', left: '50%', size: 4, delay: 2.5, duration: 8.5, color: 'bg-sky-400' },
        ].map((particle, i) => (
          <motion.div
            key={i}
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute rounded-full ${particle.color} shadow-lg shadow-cyan-400/50`}
          />
        ))}
      </div>
    </div>
  );
}
