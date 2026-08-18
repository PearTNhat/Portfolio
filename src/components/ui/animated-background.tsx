import * as React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Cyber Grid Layer */}
      <div className="absolute inset-0 cyber-grid opacity-75" />

      {/* Radial Gradient Ambient Lighting (Lightweight GPU-friendly background lights) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_50%_0%,rgba(0,173,216,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_85%_55%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_15%_75%,rgba(16,185,129,0.08),transparent_70%)]" />

      {/* Orb 1: Luminous Cyan Orb (Top-Right) */}
      <div
        className="absolute -top-32 right-10 w-[320px] sm:w-[420px] md:w-[480px] h-[320px] sm:h-[420px] md:h-[480px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-sky-400/20 to-transparent blur-[50px] sm:blur-[70px] md:blur-[80px] animate-orb-1 transform-gpu"
      />

      {/* Orb 2: Electric Indigo / Purple Orb (Center-Left) */}
      <div
        className="absolute top-1/3 -left-28 w-[340px] sm:w-[450px] md:w-[520px] h-[340px] sm:h-[450px] md:h-[520px] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-500/20 to-transparent blur-[50px] sm:blur-[70px] md:blur-[85px] animate-orb-2 transform-gpu"
      />

      {/* Orb 3: Emerald Web3 Blockchain Orb (Bottom-Right) */}
      <div
        className="absolute top-2/3 right-1/4 w-[300px] sm:w-[400px] md:w-[450px] h-[300px] sm:h-[400px] md:h-[450px] rounded-full bg-gradient-to-bl from-emerald-500/20 via-teal-400/15 to-transparent blur-[50px] sm:blur-[70px] md:blur-[80px] animate-orb-3 transform-gpu"
      />

      {/* Orb 4: Rose / Magenta Flare (Bottom-Left) */}
      <div
        className="absolute -bottom-20 left-1/3 w-[320px] sm:w-[420px] md:w-[500px] h-[320px] sm:h-[420px] md:h-[500px] rounded-full bg-gradient-to-tr from-pink-500/18 via-rose-400/15 to-transparent blur-[50px] sm:blur-[70px] md:blur-[85px] animate-orb-4 transform-gpu"
      />

      {/* Floating Constellation Tech Dust Particles (Desktop & Tablet only for zero mobile GPU penalty) */}
      <div className="hidden md:block absolute inset-0">
        {[
          { top: '15%', left: '20%', size: 'w-1 h-1', color: 'bg-cyan-400' },
          { top: '25%', left: '85%', size: 'w-1.5 h-1.5', color: 'bg-indigo-400' },
          { top: '45%', left: '10%', size: 'w-1 h-1', color: 'bg-emerald-400' },
          { top: '60%', left: '90%', size: 'w-1 h-1', color: 'bg-cyan-400' },
          { top: '75%', left: '30%', size: 'w-1.5 h-1.5', color: 'bg-purple-400' },
          { top: '88%', left: '70%', size: 'w-1 h-1', color: 'bg-pink-400' },
        ].map((particle, i) => (
          <div
            key={i}
            style={{
              top: particle.top,
              left: particle.left,
            }}
            className={`absolute rounded-full ${particle.size} ${particle.color} shadow-sm shadow-cyan-400/40 animate-pulse-glow transform-gpu`}
          />
        ))}
      </div>
    </div>
  );
}

