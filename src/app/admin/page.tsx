'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function AdminIndexPage() {
  const router = useRouter();

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/admin/projects');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 font-mono text-sm gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      <p>Đang kiểm tra quyền truy cập...</p>
    </div>
  );
}
