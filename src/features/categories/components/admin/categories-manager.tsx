'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FolderTree,
  Layers,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { CategoryFormModal } from '@/features/categories/components/admin/category-form-modal';
import { categoriesService } from '@/services/categories.service';
import { Category } from '@/types/category';

export function CategoriesManager() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');

  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadCategories = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await categoriesService.getCategories();
      setCategories(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách danh mục.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const filteredCategories = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter(
      (cat) =>
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q)
    );
  }, [categories, query]);

  const openCreateModal = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setSelectedCategory(cat);
    setIsFormOpen(true);
  };

  const handleSaved = (saved: Category, mode: 'create' | 'update') => {
    setCategories((current) => {
      if (mode === 'create') {
        return [...current, saved];
      }
      return current.map((c) => (c.id === saved.id ? saved : c));
    });

    setSuccessMsg(
      mode === 'create'
        ? `Đã tạo danh mục "${saved.name}" thành công!`
        : `Đã cập nhật danh mục "${saved.name}"!`
    );

    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await categoriesService.deleteCategory(categoryToDelete.id);
      setCategories((current) => current.filter((c) => c.id !== categoryToDelete.id));
      setSuccessMsg(`Đã xóa danh mục "${categoryToDelete.name}".`);
      setCategoryToDelete(null);

      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa danh mục này.');
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-cyan-400" />
              <span>Quản lý Danh mục (Categories)</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {categories.length} danh mục
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Phân loại các dự án portfolio (ví dụ: Blockchain, Storage, E-Commerce...).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadCategories()}
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
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            Thêm danh mục
          </Button>
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
            className="text-xs text-rose-400 hover:text-rose-200 underline font-mono cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-400 hover:text-emerald-200 underline font-mono cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên danh mục, slug..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
            <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
            <p>Đang tải danh mục dự án...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FolderTree className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              {query ? 'Không tìm thấy danh mục phù hợp.' : 'Chưa có danh mục nào.'}
            </p>
            <Button variant="outline" size="sm" onClick={openCreateModal}>
              Thêm danh mục đầu tiên
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold w-16 text-center">Thứ tự</th>
                  <th className="py-3 px-4 font-semibold">Tên danh mục</th>
                  <th className="py-3 px-4 font-semibold">Slug URL</th>
                  <th className="py-3 px-4 font-semibold">Mô tả</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-cyan-400 font-semibold">
                      #{cat.order}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{cat.name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Chỉnh sửa danh mục"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCategory}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Xác nhận xóa danh mục"
        maxWidth="sm"
      >
        <div className="space-y-4 text-sm">
          <p className="text-slate-300">
            Bạn có chắc muốn xóa danh mục{' '}
            <strong className="text-white font-semibold">{categoryToDelete?.name}</strong>?
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoryToDelete(null)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
            >
              Xóa danh mục
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
