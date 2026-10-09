'use client';

import * as React from 'react';
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ExperienceFormModal } from '@/features/experience/components/admin/experience-form-modal';
import { experienceService } from '@/services/experience.service';
import { RawExperience } from '@/types/experience';
import { invalidatePortfolioCache } from '@/store/i18n-provider';

export function ExperiencesManager() {
  const [experiences, setExperiences] = React.useState<RawExperience[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');

  const [selectedExp, setSelectedExp] = React.useState<RawExperience | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const [expToDelete, setExpToDelete] = React.useState<RawExperience | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadExperiences = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await experienceService.getRawExperiences();
      setExperiences(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách kinh nghiệm.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadExperiences();
  }, [loadExperiences]);

  const filteredExperiences = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return experiences.filter(
      (e) =>
        !q ||
        e.company?.vi?.toLowerCase().includes(q) ||
        e.company?.en?.toLowerCase().includes(q) ||
        e.position?.vi?.toLowerCase().includes(q) ||
        e.position?.en?.toLowerCase().includes(q) ||
        e.technologies?.some((t) => t.toLowerCase().includes(q))
    );
  }, [experiences, query]);

  const handleSaved = (saved: RawExperience, mode: 'create' | 'update') => {
    invalidatePortfolioCache();
    setExperiences((prev) => {
      if (mode === 'create') return [...prev, saved];
      return prev.map((e) => (e.id === saved.id ? saved : e));
    });

    setSuccessMsg(
      mode === 'create'
        ? `Đã tạo mới kinh nghiệm tại "${saved.company?.vi}"!`
        : `Đã cập nhật kinh nghiệm tại "${saved.company?.vi}"!`
    );
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = async () => {
    if (!expToDelete?.id) return;
    setIsDeleting(true);
    try {
      await experienceService.deleteExperience(expToDelete.id);
      invalidatePortfolioCache();
      setExperiences((prev) => prev.filter((e) => e.id !== expToDelete.id));
      setSuccessMsg(`Đã xóa kinh nghiệm tại "${expToDelete.company?.vi}".`);
      setTimeout(() => setSuccessMsg(null), 3500);
      setExpToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa kinh nghiệm thất bại.');
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
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kinh Nghiệm Làm Việc (Experiences)</h1>
            <p className="text-xs text-slate-400">Quản lý lịch sử công tác, dự án thực tế và công nghệ</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={loadExperiences}
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
              setSelectedExp(null);
              setIsFormOpen(true);
            }}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Thêm Kinh Nghiệm
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
          placeholder="Tìm theo công ty, vị trí, công nghệ..."
          className="bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* Experiences List */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <p>Đang tải danh sách kinh nghiệm...</p>
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs font-mono">
          Chưa có kinh nghiệm nào phù hợp. Nhấn &quot;Thêm Kinh Nghiệm&quot; để bắt đầu!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {exp.company?.vi}
                  </h3>
                  {exp.company?.en && exp.company.en !== exp.company.vi && (
                    <span className="text-xs text-slate-400">({exp.company.en})</span>
                  )}
                  {exp.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Hiện tại
                    </span>
                  )}
                </div>

                <div className="text-xs text-cyan-400 font-medium">
                  {exp.position?.vi}
                  {exp.position?.en && ` / ${exp.position.en}`}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate}
                  </span>
                  {exp.location?.vi && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {exp.location.vi}
                    </span>
                  )}
                </div>

                {exp.summary?.vi && (
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl line-clamp-2">
                    {exp.summary.vi}
                  </p>
                )}

                {/* Tech tags */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedExp(exp);
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
                  onClick={() => setExpToDelete(exp)}
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
      <ExperienceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        experience={selectedExp}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(expToDelete)}
        onClose={() => setExpToDelete(null)}
        title="Xác nhận xóa kinh nghiệm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Bạn có chắc chắn muốn xóa kinh nghiệm tại{' '}
            <strong className="text-white">{expToDelete?.company?.vi}</strong>? Hành động này không thể hoàn tác.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpToDelete(null)}
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
