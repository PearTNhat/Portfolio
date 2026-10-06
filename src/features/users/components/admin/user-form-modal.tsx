'use client';

import * as React from 'react';
import { Eye, EyeOff, KeyRound, Mail, ShieldAlert, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { usersService } from '@/services/users.service';
import { AdminUser, CreateUserInput, UpdateUserInput } from '@/types/user';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSaved: (savedUser: AdminUser, mode: 'create' | 'update') => void;
}

export function UserFormModal({
  isOpen,
  onClose,
  user,
  onSaved,
}: UserFormModalProps) {
  const isEditing = !!user;

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('admin');
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPassword('');
      setRole(user.role || 'admin');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('admin');
    }
    setError(null);
    setShowPassword(false);
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('Vui lòng nhập họ và tên.');
      return;
    }

    if (!isEditing && !cleanEmail) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      setError('Mật khẩu bắt buộc có ít nhất 6 ký tự.');
      return;
    }

    if (isEditing && password && password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing) {
        const updatePayload: UpdateUserInput = {
          name: cleanName,
          role,
          ...(password ? { password } : {}),
        };
        const updated = await usersService.updateUser(user.id, updatePayload);
        onSaved(updated, 'update');
      } else {
        const createPayload: CreateUserInput = {
          name: cleanName,
          email: cleanEmail,
          password,
          role,
        };
        const created = await usersService.createUser(createPayload);
        onSaved(created, 'create');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa tài khoản quản trị' : 'Tạo tài khoản Admin mới'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Họ và tên</span>
            <span className="text-rose-400">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Lê Tuấn Nhật"
            required
            disabled={isLoading}
          />
        </div>

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Email đăng nhập</span>
            <span className="text-rose-400">*</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@letuannhat.dev"
            required
            disabled={isEditing || isLoading}
            className={isEditing ? 'opacity-60 cursor-not-allowed' : ''}
          />
          {isEditing && (
            <p className="text-[11px] font-mono text-slate-400">
              Email dùng làm định danh đăng nhập và không thể sửa đổi sau khi tạo.
            </p>
          )}
        </div>

        {/* Password input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditing ? 'Mật khẩu mới (Tùy chọn)' : 'Mật khẩu'}</span>
              {!isEditing && <span className="text-rose-400">*</span>}
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3 h-3" /> Ẩn mật khẩu
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> Hiện mật khẩu
                </>
              )}
            </button>
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              isEditing ? 'Để trống nếu muốn giữ nguyên mật khẩu cũ' : 'Tối thiểu 6 ký tự'
            }
            minLength={password ? 6 : undefined}
            required={!isEditing}
            disabled={isLoading}
          />
          <p className="text-[11px] font-mono text-slate-400">
            {isEditing
              ? 'Chỉ nhập nếu bạn muốn đổi mật khẩu cho tài khoản này (tối thiểu 6 ký tự).'
              : 'Mật khẩu được mã hóa an toàn bằng Bcrypt trên Go backend.'}
          </p>
        </div>

        {/* Role selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Vai trò & Quyền hạn</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'admin'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white">Quản trị viên (Admin)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Toàn quyền thêm, sửa, xóa dự án & quản lý tài khoản</div>
            </button>

            <button
              type="button"
              onClick={() => setRole('editor')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'editor'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white">Biên tập viên (Editor)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Quyền cập nhật và biên tập nội dung dự án</div>
            </button>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            {isEditing ? 'Lưu thay đổi' : 'Tạo tài khoản'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
