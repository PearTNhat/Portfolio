'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/layouts/admin-header';
import { AdminSidebar } from '@/components/layouts/admin-sidebar';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const isLoginPage = pathname === '/admin/login';

  React.useEffect(() => {
    // If on login page, no need to enforce authentication
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    if (!authService.isAuthenticated()) {
      router.replace('/admin/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsCheckingAuth(false);
  }, [pathname, isLoginPage, router]);

  // For login page, render clean without admin sidebar or header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying credentials
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <p>Đang kiểm tra phiên làm việc...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300 flex">
      {/* Sidebar navigation */}
      <AdminSidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
