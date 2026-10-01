'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

interface AdminHeaderProps {
  user: User | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/admin/login');
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & User identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-slate-100">
              Admin Console
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Go REST API
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            {user ? `${user.name} • ${user.email}` : 'Quản trị viên'}
          </p>
        </div>
      </div>

      {/* Quick Nav & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-colors"
          title="Xem trang Portfolio công khai"
        >
          <span>Xem Portfolio</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
          className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
        >
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
}
