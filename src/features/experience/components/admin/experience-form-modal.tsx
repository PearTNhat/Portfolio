'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { experienceService } from '@/services/experience.service';
import { RawExperience } from '@/types/experience';

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: RawExperience | null;
  onSaved: (saved: RawExperience, mode: 'create' | 'update') => void;
}

export function ExperienceFormModal({
  isOpen,
  onClose,
  experience,
  onSaved,
}: ExperienceFormModalProps) {
  const isEditing = Boolean(experience?.id);

  const [companyVi, setCompanyVi] = React.useState('');
  const [companyEn, setCompanyEn] = React.useState('');
  const [positionVi, setPositionVi] = React.useState('');
  const [positionEn, setPositionEn] = React.useState('');
  const [locationVi, setLocationVi] = React.useState('');
  const [locationEn, setLocationEn] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [current, setCurrent] = React.useState(false);
  const [summaryVi, setSummaryVi] = React.useState('');
  const [summaryEn, setSummaryEn] = React.useState('');
  const [technologies, setTechnologies] = React.useState('');
  const [order, setOrder] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (experience) {
      setCompanyVi(experience.company?.vi || '');
      setCompanyEn(experience.company?.en || '');
      setPositionVi(experience.position?.vi || '');
      setPositionEn(experience.position?.en || '');
      setLocationVi(experience.location?.vi || '');
      setLocationEn(experience.location?.en || '');
      setStartDate(experience.startDate || '');
      setEndDate(experience.endDate || '');
      setCurrent(Boolean(experience.current));
      setSummaryVi(experience.summary?.vi || '');
      setSummaryEn(experience.summary?.en || '');
      setTechnologies((experience.technologies || []).join(', '));
      setOrder(experience.order || 0);
    } else {
      setCompanyVi('');
      setCompanyEn('');
      setPositionVi('');
      setPositionEn('');
      setLocationVi('Hồ Chí Minh, Việt Nam');
      setLocationEn('Ho Chi Minh City, Vietnam');
      setStartDate('');
      setEndDate('');
      setCurrent(false);
      setSummaryVi('');
      setSummaryEn('');
      setTechnologies('Golang, PostgreSQL, Docker');
      setOrder(0);
    }
    setError(null);
  }, [experience, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyVi.trim() || !positionVi.trim()) {
      setError('Vui lòng nhập tên công ty và vị trí làm việc.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const techArray = technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: RawExperience = {
      id: experience?.id,
      company: { vi: companyVi.trim(), en: (companyEn || companyVi).trim() },
      position: { vi: positionVi.trim(), en: (positionEn || positionVi).trim() },
      location: { vi: locationVi.trim(), en: (locationEn || locationVi).trim() },
      startDate: startDate.trim(),
      endDate: current ? 'Hiện tại' : endDate.trim(),
      current,
      summary: { vi: summaryVi.trim(), en: (summaryEn || summaryVi).trim() },
      technologies: techArray,
      order: Number(order) || 0,
      projects: experience?.projects || [],
    };

    try {
      if (isEditing && experience?.id) {
        const updated = await experienceService.updateExperience(experience.id, payload);
        onSaved(updated, 'update');
      } else {
        const created = await experienceService.createExperience(payload);
        onSaved(created, 'create');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu kinh nghiệm.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Công ty (Tiếng Việt) <span className="text-rose-400">*</span>
            </label>
            <Input
              value={companyVi}
              onChange={(e) => setCompanyVi(e.target.value)}
              placeholder="VD: Metanode Blockchain"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Công ty (English)
            </label>
            <Input
              value={companyEn}
              onChange={(e) => setCompanyEn(e.target.value)}
              placeholder="VD: Metanode Blockchain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Vị trí / Chức danh (Tiếng Việt) <span className="text-rose-400">*</span>
            </label>
            <Input
              value={positionVi}
              onChange={(e) => setPositionVi(e.target.value)}
              placeholder="Kỹ Sư Backend (Golang)"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Vị trí / Chức danh (English)
            </label>
            <Input
              value={positionEn}
              onChange={(e) => setPositionEn(e.target.value)}
              placeholder="Backend Engineer (Golang)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Bắt đầu (Start Date)
            </label>
            <Input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="10/2023 hoặc 2023"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Kết thúc (End Date)
            </label>
            <Input
              value={endDate}
              disabled={current}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder={current ? 'Hiện tại' : '10/2024'}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Thứ tự ưu tiên</label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="current-exp"
            checked={current}
            onChange={(e) => setCurrent(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="current-exp" className="text-xs text-slate-300 cursor-pointer">
            Công việc hiện tại (Đang công tác tại đây)
          </label>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            Công nghệ sử dụng (phân cách bằng dấu phẩy)
          </label>
          <Input
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            placeholder="Golang, Rust, PostgreSQL, Docker, Redis"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            Tóm tắt đóng góp (Tiếng Việt)
          </label>
          <textarea
            value={summaryVi}
            onChange={(e) => setSummaryVi(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
            placeholder="Mô tả trách nhiệm cốt lõi, thành tựu..."
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            Tóm tắt đóng góp (English)
          </label>
          <textarea
            value={summaryEn}
            onChange={(e) => setSummaryEn(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
            placeholder="Key responsibilities and achievements..."
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
