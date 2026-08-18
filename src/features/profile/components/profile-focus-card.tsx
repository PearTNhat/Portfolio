'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, MapPin, Mail, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { SITE_METADATA } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { SiGo, SiRust, SiEthereum, SiApachekafka } from 'react-icons/si';

export function ProfileFocusCard() {
  return (
    <Card className="p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      {/* Top ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/20 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-cyan-500/30 transition-all duration-500" />
      
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 opacity-80" />

      <div className="space-y-5 relative z-10">
        {/* Header: Verified Engineer */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400 font-bold text-lg font-mono">
                TN
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Lê Tuấn Nhật</h3>
                <span title="Verified Engineer">
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                PTIT Information Technology
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Open for Hire
          </div>
        </div>

        {/* Core Competencies Matrix */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            CORE DOMAINS & ENGINEERING FOCUS
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <SiGo className="w-5 h-5 text-[#00ADD8] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Go Backend</div>
                <div className="text-[10px] text-slate-500">Concurrency & cgo</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <SiEthereum className="w-5 h-5 text-[#627EEA] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Layer 1 & EVM</div>
                <div className="text-[10px] text-slate-500">DAG/BFT Consensus</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <SiRust className="w-5 h-5 text-[#DEA584] dark:text-[#F74C00] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Rust Systems</div>
                <div className="text-[10px] text-slate-500">QUIC & Tokio</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <SiApachekafka className="w-5 h-5 text-[#E535AB] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Microservices</div>
                <div className="text-[10px] text-slate-500">Kafka & gRPC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified GitHub Repository */}
        <div className="space-y-1.5 pt-1">
          <a
            href={SITE_METADATA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-colors group/link"
          >
            <div className="flex items-center gap-2.5">
              <GithubIcon className="w-4 h-4 text-slate-800 dark:text-slate-200 group-hover/link:text-cyan-500 transition-colors" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover/link:text-cyan-500 transition-colors">
                  github.com/PearTNhat
                </div>
                <div className="text-[10px] text-slate-500">Public Repositories & System Commits</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-cyan-500 transition-colors" />
          </a>
        </div>

        {/* Direct Contact & Zalo Phone Bar */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          {/* Click to Zalo Button */}
          <a
            href={SITE_METADATA.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-950/50 border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/15 text-blue-700 dark:text-blue-300 transition-all group/zalo"
            title="Chat directly on Zalo (0944477357)"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-blue-500 text-white shadow-xs">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <span>0944 477 357</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300">
                    Zalo Chat 💬
                  </span>
                </div>
                <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80">Direct chat on Zalo (0944 477 357)</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-blue-500 group-hover/zalo:translate-x-0.5 transition-transform" />
          </a>

          {/* Email & Location footer */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 font-mono">
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-cyan-500" />
              Ho Chi Minh City, VN
            </span>
            <a
              href={`mailto:${SITE_METADATA.email}`}
              className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <Mail className="w-3 h-3" />
              letuannhat105@gmail.com
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
