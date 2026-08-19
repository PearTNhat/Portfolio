'use client';

import * as React from 'react';
import { Mail, MapPin, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { SocialLink } from '@/types/profile';
import { Card } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { SITE_METADATA } from '@/lib/constants';
import { useI18n } from '@/store/i18n-provider';

export interface SocialCardProps {
  socials: SocialLink[];
  email: string;
  phone: string;
  location: string;
  github: string;
}

export function SocialCard({ email, phone, location, github }: SocialCardProps) {
  const { ui } = useI18n();
  const { isCopied: isEmailCopied, copy: copyEmail } = useCopyToClipboard();
  const { isCopied: isPhoneCopied, copy: copyPhone } = useCopyToClipboard();

  return (
    <div className="space-y-4">
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md space-y-5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {ui.contactSection.coordinatesTitle}
        </h3>

        <div className="space-y-4 text-sm">
          {/* Phone / Zalo */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-500/10 dark:bg-blue-950/40 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 uppercase font-semibold">
                  {ui.profileCard.phoneZaloTitle}
                </div>
                <a
                  href={SITE_METADATA.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
                >
                  <span>{phone}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300">
                    {ui.contactSection.openZalo}
                  </span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={SITE_METADATA.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                title="Chat Zalo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => copyPhone(phone)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title={ui.profileCard.copyTooltip}
              >
                {isPhoneCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">{ui.profileCard.emailTitle}</div>
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-slate-800 dark:text-slate-200 hover:text-cyan-500"
                >
                  {email}
                </a>
              </div>
            </div>

            <button
              onClick={() => copyEmail(email)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={ui.profileCard.copyTooltip}
            >
              {isEmailCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">{ui.profileCard.locationTitle}</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{location}</div>
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <GithubIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">GitHub Profile</div>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-800 dark:text-slate-200 hover:text-cyan-500"
                >
                  github.com/PearTNhat
                </a>
              </div>
            </div>

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Open GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
