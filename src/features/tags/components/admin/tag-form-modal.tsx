'use client';

import * as React from 'react';
import { AlertCircle, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { tagsService } from '@/services/tags.service';
import { CreateTagInput, Tag, UpdateTagInput } from '@/types/tag';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag | null;
  onSaved: (savedTag: Tag, mode: 'create' | 'update') => void;
}

const COLOR_PRESETS = [
  { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { name: 'Violet', value: 'violet', bg: 'bg-violet-500/20 text-violet-300 border-violet-500/40' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { name: 'Sky', value: 'sky', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
];

const CATEGORY_OPTIONS = [
  { value: 'language', label: 'Ngôn ngữ (Language)' },
  { value: 'backend', label: 'Backend & Framework' },
  { value: 'database', label: 'Cơ sở dữ liệu (Database)' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'blockchain', label: 'Blockchain & Web3' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'general', label: 'Chung (General)' },
];

export function TagFormModal({ isOpen, onClose, tag, onSaved }: TagFormModalProps) {
  const isEditing = !!tag;

  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [category, setCategory] = React.useState('general');
  const [color, setColor] = React.useState('cyan');
  const [description, setDescription] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (tag) {
      setName(tag.name || '');
      setSlug(tag.slug || '');
      setCategory(tag.category || 'general');
      setColor(tag.color || 'cyan');
      setDescription(tag.description || '');
    } else {
      setName('');
      setSlug('');
      setCategory('general');
      setColor('cyan');
      setDescription('');
    }
    setError(null);
  }, [tag, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Vui lòng nhập tên thẻ công nghệ.');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && tag) {
        const updatePayload: UpdateTagInput = {
          name: cleanName,
          slug: slug.trim() || undefined,
          category,
          color,
          description: description.trim(),
        };
        const updated = await tagsService.updateTag(tag.id, updatePayload);
        onSaved(updated, 'update');
      } else {
        const createPayload: CreateTagInput = {
          name: cleanName,
          slug: slug.trim() || undefined,
          category,
          color,
          description: description.trim(),
        };
        const created = await tagsService.createTag(createPayload);
        onSaved(created, 'create');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu Tag.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa Thẻ công nghệ' : 'Thêm Thẻ công nghệ mới'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tên thẻ công nghệ</span>
            <span className="text-rose-400">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Go, Rust, Apache Kafka, Docker..."
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Slug URL (Tùy chọn)
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Tự động tạo từ tên nếu để trống (ví dụ: go, rust)"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Nhóm chuyên môn
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-xs text-slate-100 outline-none focus:border-cyan-400"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Màu hiển thị badge
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((p) => {
              const isSelected = color === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setColor(p.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    isSelected
                      ? `${p.bg} ring-2 ring-cyan-400 font-bold`
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Mô tả ngắn gọn
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Mô tả tóm tắt về công nghệ này..."
            disabled={isLoading}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

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
            {isEditing ? 'Lưu thay đổi' : 'Tạo Tag'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
