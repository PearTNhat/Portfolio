'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FolderKanban,
  Users,
  ShieldCheck,
  ExternalLink,
  LogOut,
  X,
  Sparkles,
  Layers,
  Tag,
  UserCircle,
  Briefcase,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Nội dung & Dữ liệu',
    items: [
      {
        name: 'Dự án (Projects)',
        href: '/admin/projects',
        icon: FolderKanban,
        description: 'Quản lý bài viết portfolio',
      },
      {
        name: 'Hồ sơ cá nhân (Profile)',
        href: '/admin/profile',
        icon: UserCircle,
        description: 'Thông tin cá nhân & bio',
      },
      {
        name: 'Kinh nghiệm (Experiences)',
        href: '/admin/experiences',
        icon: Briefcase,
        description: 'Lịch sử làm việc & vị trí',
      },
      {
        name: 'Kỹ năng (Skills)',
        href: '/admin/skills',
        icon: Cpu,
        description: 'Nhóm kỹ năng & chuyên môn',
      },
      {
        name: 'Danh mục (Categories)',
        href: '/admin/categories',
        icon: Layers,
        description: 'Phân loại dự án (Blockchain, E-com...)',
      },
      {
        name: 'Thẻ công nghệ (Tags)',
        href: '/admin/tags',
        icon: Tag,
        description: 'Quản lý nhãn công nghệ (Go, Rust...)',
      },
    ],
  },
  {
    title: 'Hệ thống & Tài khoản',
    items: [
      {
        name: 'Quản lý Tài khoản',
        href: '/admin/users',
        icon: Users,
        description: 'Phân quyền & cấp tài khoản Admin',
        badge: 'Admin',
      },
    ],
  },
];

interface AdminSidebarProps {
  user: User | null;
  mobileOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ user, mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top brand header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin/projects" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner group-hover:border-cyan-400/60 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Admin Console
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Go REST API
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation sections */}
        <div className="p-3 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/5 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="leading-tight">{item.name}</div>
                          <div className="text-[10px] font-normal text-slate-400 group-hover:text-slate-400 line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-mono px-1.5 py-0.5 rounded border',
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700/60'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile and Quick actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-cyan-500/10 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {user?.role || 'admin'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {user?.email || 'letuannhat105@gmail.com'}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-slate-800/80 transition-colors"
            title="Mở portfolio công khai trong tab mới"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Portfolio</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
            title="Đăng xuất khỏi trang quản trị"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Thoát</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
