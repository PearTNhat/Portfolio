'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { UserFormModal } from '@/features/users/components/admin/user-form-modal';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { User as AuthUser } from '@/types/auth';
import { AdminUser } from '@/types/user';

export function UsersManager() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');

  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);

  // Form modal state
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // Delete modal state
  const [userToDelete, setUserToDelete] = React.useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadUsers = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await usersService.getUsers();
      setUsers(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể kết nối đến máy chủ. Vui lòng đảm bảo Backend đã chạy.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, query, roleFilter]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSaved = (savedUser: AdminUser, mode: 'create' | 'update') => {
    setUsers((current) => {
      if (mode === 'create') {
        return [savedUser, ...current];
      }
      return current.map((u) => (u.id === savedUser.id ? savedUser : u));
    });

    setSuccessMsg(
      mode === 'create'
        ? `Đã tạo tài khoản quản trị thành công cho "${savedUser.email}".`
        : `Đã cập nhật thông tin tài khoản "${savedUser.email}".`
    );

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await usersService.deleteUser(userToDelete.id);
      setUsers((current) => current.filter((u) => u.id !== userToDelete.id));
      setSuccessMsg(`Đã xóa tài khoản "${userToDelete.email}".`);
      setUserToDelete(null);

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa tài khoản này.');
      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const totalAdmins = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-cyan-400" />
              <span>Quản lý Tài khoản & Phân quyền</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {users.length} tài khoản
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cấp quyền và quản lý danh sách tài khoản được phép đăng nhập vào trang quản trị website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadUsers()}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            disabled={isLoading}
            className="text-xs"
          >
            Tải lại
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            Thêm tài khoản Admin
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">Tổng tài khoản</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{users.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            Hệ thống xác thực qua JWT & Bcrypt
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">Quản trị viên (Admin)</p>
              <h3 className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{totalAdmins}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            Có quyền chỉnh sửa dự án & user
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">Đang đăng nhập</p>
              <h3 className="text-sm font-bold text-emerald-400 mt-1 truncate max-w-[180px]">
                {currentUser?.email || 'Chưa xác định'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400/80 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Phiên hoạt động an toàn
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs text-rose-400 hover:text-rose-200 underline font-mono"
          >
            Đóng
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-400 hover:text-emerald-200 underline font-mono"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, email, vai trò..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-400 mr-1.5 hidden sm:inline">
            Lọc vai trò:
          </span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'admin', label: 'Admin' },
            { id: 'editor', label: 'Editor' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setRoleFilter(role.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                roleFilter === role.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-950/40 text-slate-400 hover:text-slate-300 border border-slate-800'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
            <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
            <p>Đang tải danh sách tài khoản quản trị từ backend...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-400">
              {query || roleFilter !== 'all'
                ? 'Không tìm thấy tài khoản phù hợp với tìm kiếm.'
                : 'Chưa có tài khoản nào trong hệ thống.'}
            </p>
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setRoleFilter('all');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Tài khoản & Người dùng</th>
                  <th className="py-3 px-4 font-semibold">Vai trò</th>
                  <th className="py-3 px-4 font-semibold">Ngày tạo</th>
                  <th className="py-3 px-4 font-semibold">Nhận diện</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id || currentUser?.email === user.email;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isCurrent ? 'bg-cyan-500/[0.02]' : ''
                      }`}
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-slate-800 border border-cyan-500/20 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border font-medium ${
                            user.role === 'admin'
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {isCurrent ? (
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="text-slate-400">Được kích hoạt</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                            title="Chỉnh sửa thông tin / mật khẩu"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(user)}
                            disabled={isCurrent || users.length <= 1}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCurrent || users.length <= 1
                                ? 'opacity-30 cursor-not-allowed text-slate-400'
                                : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer'
                            }`}
                            title={
                              isCurrent
                                ? 'Không thể tự xóa tài khoản của bạn'
                                : users.length <= 1
                                ? 'Không thể xóa tài khoản Admin duy nhất còn lại'
                                : 'Xóa tài khoản này'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={selectedUser}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Xác nhận xóa tài khoản"
        maxWidth="md"
      >
        <div className="space-y-4 text-sm">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 space-y-1">
              <p className="font-semibold">Hành động này không thể hoàn tác!</p>
              <p>
                Tài khoản sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu. Sau khi xóa, người này sẽ không
                thể đăng nhập vào trang quản trị nữa.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1">
            <p className="text-slate-400">
              Tên: <span className="text-white font-semibold">{userToDelete?.name}</span>
            </p>
            <p className="text-slate-400">
              Email: <span className="text-cyan-400 font-semibold">{userToDelete?.email}</span>
            </p>
            <p className="text-slate-400">
              Vai trò: <span className="text-indigo-400">{userToDelete?.role}</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
            >
              Xác nhận xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
