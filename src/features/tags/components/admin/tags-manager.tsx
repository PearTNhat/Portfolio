'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Tag as TagIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TagFormModal } from '@/features/tags/components/admin/tag-form-modal';
import { tagsService } from '@/services/tags.service';
import { Tag } from '@/types/tag';

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'language', label: 'Ngôn ngữ' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'devops', label: 'DevOps' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'general', label: 'Chung' },
];

const COLOR_MAP: Record<string, string> = {
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
};

export function TagsManager() {
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const [formTag, setFormTag] = React.useState<Tag | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [tagToDelete, setTagToDelete] = React.useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadTags = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await tagsService.getTags(selectedCategory);
      setTags(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách thẻ công nghệ.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    void loadTags();
  }, [loadTags]);

  const filteredTags = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [tags, query, selectedCategory]);

  const openCreateModal = () => {
    setFormTag(null);
    setIsFormOpen(true);
  };

  const openEditModal = (tag: Tag) => {
    setFormTag(tag);
    setIsFormOpen(true);
  };

  const handleSaved = (saved: Tag, mode: 'create' | 'update') => {
    setTags((current) => {
      if (mode === 'create') {
        return [saved, ...current];
      }
      return current.map((t) => (t.id === saved.id ? saved : t));
    });

    setSuccessMsg(
      mode === 'create'
        ? `Đã thêm thẻ công nghệ "${saved.name}" thành công!`
        : `Đã cập nhật thẻ công nghệ "${saved.name}"!`
    );

    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await tagsService.deleteTag(tagToDelete.id);
      setTags((current) => current.filter((t) => t.id !== tagToDelete.id));
      setSuccessMsg(`Đã xóa thẻ công nghệ "${tagToDelete.name}".`);
      setTagToDelete(null);

      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa thẻ này.');
      setTagToDelete(null);
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
              <TagIcon className="w-6 h-6 text-cyan-400" />
              <span>Quản lý Thẻ công nghệ (Tags)</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {tags.length} thẻ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý kho nhãn công nghệ (Go, Rust, Docker, Kafka...) dùng gắn vào các dự án portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadTags()}
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
            Thêm Tag mới
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

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên công nghệ, slug..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-950/40 text-slate-400 hover:text-slate-300 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
            <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
            <p>Đang tải danh sách thẻ công nghệ...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <TagIcon className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              {query || selectedCategory !== 'all'
                ? 'Không tìm thấy thẻ công nghệ phù hợp.'
                : 'Chưa có thẻ công nghệ nào.'}
            </p>
            <Button variant="outline" size="sm" onClick={openCreateModal}>
              Thêm Tag đầu tiên
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Thẻ công nghệ</th>
                  <th className="py-3 px-4 font-semibold">Slug URL</th>
                  <th className="py-3 px-4 font-semibold">Nhóm chuyên môn</th>
                  <th className="py-3 px-4 font-semibold">Mô tả</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTags.map((tag) => {
                  const colorClass = COLOR_MAP[tag.color || 'cyan'] || COLOR_MAP.cyan;

                  return (
                    <tr key={tag.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border font-semibold ${colorClass}`}
                        >
                          <span>{tag.name}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {tag.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 uppercase text-[10px]">
                        {tag.category || 'general'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {tag.description || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(tag)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Chỉnh sửa Tag"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTagToDelete(tag)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Xóa Tag"
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

      {/* Form Modal */}
      <TagFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        tag={formTag}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        title="Xác nhận xóa Thẻ công nghệ"
        maxWidth="sm"
      >
        <div className="space-y-4 text-sm">
          <p className="text-slate-300">
            Bạn có chắc muốn xóa thẻ{' '}
            <strong className="text-cyan-400 font-semibold">{tagToDelete?.name}</strong>?
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTagToDelete(null)}
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
              Xóa Tag
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
