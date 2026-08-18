'use client';

import * as React from 'react';
import { ShieldCheck, ExternalLink, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { SITE_METADATA } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { SiGo, SiRust, SiEthereum, SiApachekafka } from 'react-icons/si';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function ProfileFocusCard() {
  const { isCopied: isPhoneCopied, copy: copyPhone } = useCopyToClipboard();
  const { isCopied: isEmailCopied, copy: copyEmail } = useCopyToClipboard();

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-black text-sm font-mono tracking-wide">
                LTN
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

        {/* Direct Contact, Zalo & One-Click Copy Bar */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5">
          {/* Zalo Phone & Copy Bar */}
          <div className="p-3 rounded-2xl bg-blue-500/10 dark:bg-blue-950/50 border border-blue-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-blue-500 text-white shadow-xs shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-blue-200 flex items-center gap-1.5 font-mono">
                    <span>0944 477 357</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 font-semibold">
                      Zalo
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80">Phone &amp; Direct Messaging</div>
                </div>
              </div>

              <a
                href={SITE_METADATA.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-all hover:scale-105"
                title="Chat directly on Zalo"
              >
                <span>Chat Zalo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Prominent Copy Phone Button */}
            <div className="pt-1 border-t border-blue-500/20">
              <button
                type="button"
                onClick={() => copyPhone(SITE_METADATA.phone)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700/80 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                title="Copy phone number: 0944477357"
              >
                {isPhoneCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Copied: 0944 477 357!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-500" />
                    <span>Copy Phone: 0944 477 357</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email & Copy Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono">
            <a
              href={`mailto:${SITE_METADATA.email}`}
              className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:underline truncate flex-1 min-w-0"
              title="Click to send email"
            >
              <Mail className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
              <span className="truncate">{SITE_METADATA.email}</span>
            </a>

            <button
              type="button"
              onClick={() => copyEmail(SITE_METADATA.email)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-600 transition-all cursor-pointer shrink-0 ml-2 shadow-xs"
              title="Copy email"
            >
              {isEmailCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
