'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { skillsService } from '@/services/skills.service';
import { RawSkillCategory, RawSkillItem } from '@/types/skill';

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: RawSkillCategory | null;
  onSaved: (saved: RawSkillCategory, mode: 'create' | 'update') => void;
}

export function SkillFormModal({
  isOpen,
  onClose,
  category,
  onSaved,
}: SkillFormModalProps) {
  const isEditing = Boolean(category?.id);

  const [titleVi, setTitleVi] = React.useState('');
  const [titleEn, setTitleEn] = React.useState('');
  const [subtitleVi, setSubtitleVi] = React.useState('');
  const [subtitleEn, setSubtitleEn] = React.useState('');
  const [icon, setIcon] = React.useState('Cpu');
  const [order, setOrder] = React.useState(0);
  const [skills, setSkills] = React.useState<RawSkillItem[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (category) {
      setTitleVi(category.title?.vi || '');
      setTitleEn(category.title?.en || '');
      setSubtitleVi(category.subtitle?.vi || '');
      setSubtitleEn(category.subtitle?.en || '');
      setIcon(category.icon || 'Cpu');
      setOrder(category.order || 0);
      setSkills(category.skills || []);
    } else {
      setTitleVi('');
      setTitleEn('');
      setSubtitleVi('');
      setSubtitleEn('');
      setIcon('Cpu');
      setOrder(0);
      setSkills([
        { name: 'Golang', note: { vi: 'Chuyên sâu concurrency & microservices', en: 'Deep concurrency & microservices' } },
      ]);
    }
    setError(null);
  }, [category, isOpen]);

  const handleAddSkill = () => {
    setSkills((prev) => [...prev, { name: '', note: { vi: '', en: '' } }]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index: number, field: string, value: string) => {
    setSkills((prev) => {
      const copy = [...prev];
      if (field === 'name') {
        copy[index] = { ...copy[index], name: value };
      } else if (field === 'noteVi') {
        copy[index] = {
          ...copy[index],
          note: { ...(copy[index].note || {}), vi: value },
        };
      } else if (field === 'noteEn') {
        copy[index] = {
          ...copy[index],
          note: { ...(copy[index].note || {}), en: value },
        };
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleVi.trim()) {
      setError('Vui lòng nhập tên nhóm kỹ năng.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const validSkills = skills.filter((s) => s.name.trim().length > 0);

    const payload: RawSkillCategory = {
      id: category?.id,
      title: { vi: titleVi.trim(), en: (titleEn || titleVi).trim() },
      subtitle: { vi: subtitleVi.trim(), en: (subtitleEn || subtitleVi).trim() },
      icon: icon.trim() || 'Cpu',
      order: Number(order) || 0,
      skills: validSkills,
    };

    try {
      if (isEditing && category?.id) {
        const updated = await skillsService.updateSkillCategory(category.id, payload);
        onSaved(updated, 'update');
      } else {
        const created = await skillsService.createSkillCategory(payload);
        onSaved(created, 'create');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu nhóm kỹ năng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa nhóm kỹ năng' : 'Thêm nhóm kỹ năng mới'}
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
              Tên nhóm kỹ năng (VI) <span className="text-rose-400">*</span>
            </label>
            <Input
              value={titleVi}
              onChange={(e) => setTitleVi(e.target.value)}
              placeholder="VD: Backend Engineering"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Tên nhóm kỹ năng (EN)
            </label>
            <Input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="VD: Backend Engineering"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Mô tả ngắn / Phụ đề (VI)
            </label>
            <Input
              value={subtitleVi}
              onChange={(e) => setSubtitleVi(e.target.value)}
              placeholder="Hệ thống phân tán, vi dịch vụ..."
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Mô tả ngắn / Phụ đề (EN)
            </label>
            <Input
              value={subtitleEn}
              onChange={(e) => setSubtitleEn(e.target.value)}
              placeholder="Distributed systems, microservices..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Biểu tượng (Icon key)
            </label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Cpu, Server, Database, Layers, Blocks"
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

        {/* Skills List inside Category */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-slate-300">
              Danh sách kỹ năng con ({skills.length})
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddSkill}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm kỹ năng
            </Button>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5"
              >
                <div className="w-32 shrink-0">
                  <Input
                    value={skill.name}
                    onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                    placeholder="Tên (VD: Go)"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={skill.note?.vi || ''}
                    onChange={(e) => handleSkillChange(idx, 'noteVi', e.target.value)}
                    placeholder="Ghi chú chi tiết / Điểm nổi bật..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
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
