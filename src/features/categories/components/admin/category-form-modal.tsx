'use client';

import * as React from 'react';
import { AlertCircle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { categoriesService } from '@/services/categories.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSaved: (savedCategory: Category, mode: 'create' | 'update') => void;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSaved,
}: CategoryFormModalProps) {
  const isEditing = !!category;

  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [order, setOrder] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (category) {
      setName(category.name || '');
      setSlug(category.slug || '');
      setDescription(category.description || '');
      setOrder(category.order || 0);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setOrder(0);
    }
    setError(null);
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Vui lòng nhập tên danh mục.');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && category) {
        const updatePayload: UpdateCategoryInput = {
          name: cleanName,
          slug: slug.trim() || undefined,
          description: description.trim(),
          order: Number(order) || 0,
        };
        const updated = await categoriesService.updateCategory(category.id, updatePayload);
        onSaved(updated, 'update');
      } else {
        const createPayload: CreateCategoryInput = {
          name: cleanName,
          slug: slug.trim() || undefined,
          description: description.trim(),
          order: Number(order) || 0,
        };
        const created = await categoriesService.createCategory(createPayload);
        onSaved(created, 'create');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu danh mục.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
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
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tên danh mục</span>
            <span className="text-rose-400">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Blockchain, AI & ML, Storage..."
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
            placeholder="Tự động tạo từ tên nếu để trống (ví dụ: blockchain)"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Mô tả danh mục
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Mô tả ngắn gọn về nhóm dự án này..."
            disabled={isLoading}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Thứ tự hiển thị (Order)
          </label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            placeholder="0"
            disabled={isLoading}
          />
          <p className="text-[11px] font-mono text-slate-400">
            Số nhỏ hơn sẽ được ưu tiên hiển thị trước.
          </p>
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
            {isEditing ? 'Lưu thay đổi' : 'Tạo danh mục'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
