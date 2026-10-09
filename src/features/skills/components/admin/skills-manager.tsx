'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
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
import { SkillFormModal } from '@/features/skills/components/admin/skill-form-modal';
import { skillsService } from '@/services/skills.service';
import { RawSkillCategory } from '@/types/skill';
import { invalidatePortfolioCache } from '@/store/i18n-provider';

export function SkillsManager() {
  const [categories, setCategories] = React.useState<RawSkillCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');

  const [selectedCat, setSelectedCat] = React.useState<RawSkillCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [catToDelete, setCatToDelete] = React.useState<RawSkillCategory | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadSkills = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await skillsService.getRawSkillCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách kỹ năng.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  const filteredCategories = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter(
      (c) =>
        !q ||
        c.title?.vi?.toLowerCase().includes(q) ||
        c.title?.en?.toLowerCase().includes(q) ||
        c.subtitle?.vi?.toLowerCase().includes(q) ||
        c.skills?.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [categories, query]);

  const handleSaved = (saved: RawSkillCategory, mode: 'create' | 'update') => {
    invalidatePortfolioCache();
    setCategories((prev) => {
      if (mode === 'create') return [...prev, saved];
      return prev.map((c) => (c.id === saved.id ? saved : c));
    });

    setSuccessMsg(
      mode === 'create'
        ? `Đã tạo nhóm kỹ năng "${saved.title?.vi}"!`
        : `Đã cập nhật nhóm kỹ năng "${saved.title?.vi}"!`
    );
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async () => {
    if (!catToDelete?.id) return;
    setIsDeleting(true);
    try {
      await skillsService.deleteSkillCategory(catToDelete.id);
      invalidatePortfolioCache();
      setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
      setSuccessMsg(`Đã xóa nhóm kỹ năng "${catToDelete.title?.vi}".`);
      setTimeout(() => setSuccessMsg(null), 3500);
      setCatToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa nhóm kỹ năng thất bại.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kỹ Năng Chuyên Môn (Skills)</h1>
            <p className="text-xs text-slate-400">Quản lý các nhóm kỹ năng, công nghệ và phân loại</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={loadSkills}
            disabled={isLoading}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Làm mới
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedCat(null);
              setIsFormOpen(true);
            }}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm Nhóm Kỹ Năng
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên nhóm, công nghệ..."
          className="bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <p>Đang tải danh sách kỹ năng...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs font-mono">
          Chưa có nhóm kỹ năng nào. Nhấn &quot;Thêm Nhóm Kỹ Năng&quot; để tạo mới!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono">
                      <Layers className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {cat.title?.vi}
                      </h3>
                      {cat.subtitle?.vi && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {cat.subtitle.vi}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                    Order: {cat.order || 0}
                  </span>
                </div>

                {/* Sub skills pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(cat.skills || []).map((s, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="font-semibold text-white">{s.name}</span>
                      {s.note?.vi && (
                        <span className="text-[10px] text-slate-400 font-mono max-w-[120px] truncate">
                          • {s.note.vi}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/60">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCat(cat);
                    setIsFormOpen(true);
                  }}
                  className="text-xs"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Sửa
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCatToDelete(cat)}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <SkillFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCat}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(catToDelete)}
        onClose={() => setCatToDelete(null)}
        title="Xác nhận xóa nhóm kỹ năng"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Bạn có chắc chắn muốn xóa nhóm kỹ năng{' '}
            <strong className="text-white">{catToDelete?.title?.vi}</strong>? Hành động này không thể hoàn tác.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCatToDelete(null)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-rose-600 hover:bg-rose-500"
            >
              Xóa Vĩnh Viễn
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
