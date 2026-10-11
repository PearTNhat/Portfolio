'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  FilePlus2,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { projectsService } from '@/services/projects.service';
import { ProjectCategory, ProjectSummary } from '@/types/project';

const categoryLabels: Record<Exclude<ProjectCategory, 'all'>, string> = {
  blockchain: 'Blockchain',
  storage: 'Storage',
  ecommerce: 'E-commerce',
};

export function ProjectsManager() {
  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<ProjectCategory>('all');
  const [projectToDelete, setProjectToDelete] = React.useState<ProjectSummary | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadProjects = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await projectsService.getAdminProjects();
      setProjects(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách dự án.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProjects]);

  const visibleProjects = React.useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === 'all' || project.category === category;
      const searchable = [project.title, project.subtitle, project.slug, ...project.technologies]
        .join(' ')
        .toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, projects, query]);

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await projectsService.deleteProject(projectToDelete.id);
      setProjects((current) => current.filter((project) => project.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa dự án.');
      setProjectToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-cyan-400">
            <FolderKanban className="h-5 w-5" />
            <span className="text-xs font-mono uppercase tracking-wider">Portfolio CMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Quản lý dự án
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Tạo, cập nhật hoặc gỡ các dự án hiển thị trên portfolio.
          </p>
        </div>
        <Link href="/admin/projects/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Thêm dự án</Button>
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên, slug hoặc công nghệ…"
            className="border-slate-700 bg-slate-950/60 pl-10 text-slate-100"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as ProjectCategory)}
          className="h-11 rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="blockchain">Blockchain</option>
          <option value="storage">Storage</option>
          <option value="ecommerce">E-commerce</option>
        </select>
        <Button
          variant="outline"
          size="md"
          onClick={() => void loadProjects()}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Tải lại
        </Button>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <div className="flex gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => void loadProjects()}
            className="shrink-0 text-xs font-semibold text-rose-200 underline cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <p className="text-sm font-semibold text-slate-200">{visibleProjects.length} dự án</p>
          <p className="text-xs text-slate-500">Dữ liệu được lưu trực tiếp qua Go API</p>
        </div>

        {isLoading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-sm text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            Đang tải dự án…
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 px-6 text-center">
            <FilePlus2 className="h-8 w-8 text-slate-600" />
            <div>
              <p className="font-medium text-slate-300">Chưa có dự án phù hợp</p>
              <p className="mt-1 text-sm text-slate-500">Tạo dự án đầu tiên hoặc thay đổi bộ lọc.</p>
            </div>
            <Link href="/admin/projects/create">
              <Button variant="outline" size="sm">
                Thêm dự án
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500 font-mono">
                <tr>
                  <th className="px-5 py-3 font-medium">Dự án</th>
                  <th className="px-4 py-3 font-medium">Danh mục</th>
                  <th className="px-4 py-3 font-medium">Công nghệ</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {visibleProjects.map((project) => (
                  <tr key={project.id} className="transition-colors hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-semibold text-slate-100 hover:text-cyan-400 transition-colors block"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-1 font-mono text-xs text-slate-500">/{project.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300">
                        {categoryLabels[project.category === 'all' ? 'blockchain' : project.category]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-56 truncate text-xs text-slate-400">
                        {project.technologies?.join(', ') || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Thường</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400 inline-flex items-center justify-center"
                          title={`Chỉnh sửa ${project.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                          title={`Xóa ${project.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        title="Xóa dự án"
        maxWidth="sm"
      >
        <div className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Bạn có chắc muốn xóa{' '}
            <strong className="text-slate-900 dark:text-white">
              {projectToDelete?.title}
            </strong>
            ? Thao tác này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setProjectToDelete(null)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleDelete()}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Xóa dự án
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
