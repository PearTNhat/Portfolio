'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

interface AdminHeaderProps {
  user: User | null;
  onToggleSidebar?: () => void;
}

export function AdminHeader({ user, onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/admin/login');
  };

  // Compute breadcrumb title
  const getPageTitle = () => {
    if (pathname.startsWith('/admin/users')) {
      return { title: 'Quản lý Tài khoản', subtitle: 'Danh sách và phân quyền quản trị viên' };
    }
    if (pathname.startsWith('/admin/categories')) {
      return { title: 'Quản lý Danh mục', subtitle: 'Phân loại các dự án portfolio' };
    }
    if (pathname.startsWith('/admin/tags')) {
      return { title: 'Quản lý Thẻ công nghệ', subtitle: 'Danh sách công nghệ, kỹ năng và nhãn dán' };
    }
    if (pathname === '/admin/projects/create') {
      return { title: 'Tạo Dự án Mới', subtitle: 'Soạn thảo và đăng tải dự án vào portfolio' };
    }
    if (pathname.startsWith('/admin/projects/') && pathname !== '/admin/projects') {
      return { title: 'Chỉnh sửa Dự án', subtitle: 'Cập nhật thông tin chi tiết và kiến trúc hệ thống' };
    }
    if (pathname.startsWith('/admin/projects')) {
      return { title: 'Quản lý Dự án', subtitle: 'Danh mục dự án và chi tiết kỹ thuật' };
    }
    return { title: 'Admin Console', subtitle: 'Bảng điều khiển hệ thống' };
  };

  const pageInfo = getPageTitle();

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-semibold tracking-tight text-white">
              {pageInfo.title}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              CMS
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 hidden xs:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Nav & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
          title="Xem trang Portfolio công khai"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Xem Portfolio</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
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
