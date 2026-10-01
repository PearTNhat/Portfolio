'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/admin/projects');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.login(email.trim(), password);
      router.push('/admin/projects');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('letuannhat105@gmail.com');
    setPassword('Admin@123456');
    setError(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Portfolio Admin
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Go API
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Bảng điều khiển quản lý dự án & hệ thống</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-400 text-xs animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="block text-xs font-medium text-slate-300">
            Email quản trị
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500 pointer-events-none" />
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-10 bg-slate-950/60 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="admin-password" className="block text-xs font-medium text-slate-300">
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((isVisible) => !isVisible)}
              className="text-[11px] text-cyan-400/80 hover:text-cyan-300 transition-colors"
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500 pointer-events-none" />
            <Input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-10 bg-slate-950/60 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2 font-medium bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          Đăng nhập quản trị
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px]">Tài khoản mẫu:</span>
        <button
          type="button"
          onClick={fillDefaultCredentials}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
        >
          <KeyRound className="w-3 h-3" />
          Điền tài khoản mặc định
        </button>
      </div>
    </div>
  );
}
