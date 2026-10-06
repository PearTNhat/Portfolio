'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  ExternalLink,
  FolderKanban,
  Globe2,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  Link2,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/features/projects/components/admin/rich-text-editor';
import { projectsService } from '@/services/projects.service';
import { categoriesService } from '@/services/categories.service';
import { uploadService, formatMediaUrl } from '@/services/upload.service';
import { Project, ProjectCategory, ProjectType } from '@/types/project';
import { Category } from '@/types/category';

type ProjectPayload = Omit<Project, 'id'>;

interface LocalizedValues {
  title: string;
  subtitle: string;
  description: string;
  role: string;
  badgeText: string;
  contributions: string;
  architectureTitle: string;
  architectureDescription: string;
  architecturePoints: string;
}

interface ProjectFormValues {
  slug: string;
  type: ProjectType;
  category: Exclude<ProjectCategory, 'all'>;
  featured: boolean;
  period: string;
  teamSize: string;
  technologies: string[];
  metrics: string;
  githubUrl: string;
  githubServerUrl: string;
  liveUrl: string;
  playStoreUrl: string;
  videoDemoUrl: string;
  docsUrl: string;
  images: string;
  thumbnail: string;
  verificationStatus: string;
  // Bilingual contents
  vi: LocalizedValues;
  en: LocalizedValues;
}

const emptyLocalizedValues: LocalizedValues = {
  title: '',
  subtitle: '',
  description: '',
  role: '',
  badgeText: '',
  contributions: '',
  architectureTitle: '',
  architectureDescription: '',
  architecturePoints: '',
};

const emptyValues: ProjectFormValues = {
  slug: '',
  type: 'personal',
  category: 'blockchain',
  featured: false,
  period: '',
  teamSize: '',
  technologies: [],
  metrics: '',
  githubUrl: '',
  githubServerUrl: '',
  liveUrl: '',
  playStoreUrl: '',
  videoDemoUrl: '',
  docsUrl: '',
  images: '',
  thumbnail: '',
  verificationStatus: '',
  vi: { ...emptyLocalizedValues },
  en: { ...emptyLocalizedValues },
};

const COMMON_TECH_SUGGESTIONS = [
  'Go',
  'Rust',
  'C/C++',
  'TypeScript',
  'Next.js',
  'PostgreSQL',
  'Redis',
  'Apache Kafka',
  'Docker',
  'gRPC',
  'Protobuf',
  'Solidity',
  'RabbitMQ',
  'LevelDB',
  'Clean Architecture',
  'Microservices',
];

function valuesFromProject(project: Project | null): ProjectFormValues {
  if (!project) return emptyValues;

  const viTitle = project.titleI18n?.vi || project.title || '';
  const enTitle = project.titleI18n?.en || project.title || '';

  const viSubtitle = project.subtitleI18n?.vi || project.subtitle || '';
  const enSubtitle = project.subtitleI18n?.en || project.subtitle || '';

  const viDesc = project.descriptionI18n?.vi || project.description || '';
  const enDesc = project.descriptionI18n?.en || project.description || '';

  const viRole = project.roleI18n?.vi || project.role || '';
  const enRole = project.roleI18n?.en || project.role || '';

  const viBadge = project.badgeTextI18n?.vi || project.badgeText || '';
  const enBadge = project.badgeTextI18n?.en || project.badgeText || '';

  const viContrib = project.contributionsI18n?.vi?.join('\n') || project.contributions?.join('\n') || '';
  const enContrib = project.contributionsI18n?.en?.join('\n') || project.contributions?.join('\n') || '';

  const viArchTitle = project.architectureI18n?.title?.vi || project.architecture?.title || '';
  const enArchTitle = project.architectureI18n?.title?.en || project.architecture?.title || '';

  const viArchDesc = project.architectureI18n?.description?.vi || project.architecture?.description || '';
  const enArchDesc = project.architectureI18n?.description?.en || project.architecture?.description || '';

  const viArchPoints = project.architectureI18n?.points?.vi?.join('\n') || project.architecture?.points?.join('\n') || '';
  const enArchPoints = project.architectureI18n?.points?.en?.join('\n') || project.architecture?.points?.join('\n') || '';

  return {
    slug: project.slug,
    type: project.type,
    category: project.category === 'all' ? 'blockchain' : project.category,
    featured: project.featured,
    period: project.period || '',
    teamSize: String(project.teamSize || ''),
    technologies: project.technologies || [],
    metrics: project.metrics?.map(({ label, value }) => `${label}: ${value}`).join('\n') || '',
    githubUrl: project.githubUrl || '',
    githubServerUrl: project.githubServerUrl || '',
    liveUrl: project.liveUrl || '',
    playStoreUrl: project.playStoreUrl || '',
    videoDemoUrl: project.videoDemoUrl || '',
    docsUrl: project.docsUrl || '',
    images: project.images?.join('\n') || '',
    thumbnail: project.thumbnail || '',
    verificationStatus: project.verificationStatus || '',
    vi: {
      title: viTitle,
      subtitle: viSubtitle,
      description: viDesc,
      role: viRole,
      badgeText: viBadge,
      contributions: viContrib,
      architectureTitle: viArchTitle,
      architectureDescription: viArchDesc,
      architecturePoints: viArchPoints,
    },
    en: {
      title: enTitle,
      subtitle: enSubtitle,
      description: enDesc,
      role: enRole,
      badgeText: enBadge,
      contributions: enContrib,
      architectureTitle: enArchTitle,
      architectureDescription: enArchDesc,
      architecturePoints: enArchPoints,
    },
  };
}

function toLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function toMetrics(value: string) {
  return toLines(value).flatMap((line) => {
    const separator = line.indexOf(':');
    if (separator < 1 || !line.slice(separator + 1).trim()) return [];
    return [{ label: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() }];
  });
}

function buildPayload(values: ProjectFormValues, previous: Project | null, editorLang: 'vi' | 'en'): ProjectPayload {
  const viArchPoints = toLines(values.vi.architecturePoints);
  const enArchPoints = toLines(values.en.architecturePoints);
  const hasArchitecture =
    Boolean(values.vi.architectureTitle || values.en.architectureTitle ||
    values.vi.architectureDescription || values.en.architectureDescription ||
    viArchPoints.length > 0 || enArchPoints.length > 0);

  const primary = values[editorLang].title.trim()
    ? values[editorLang]
    : values.vi.title.trim()
    ? values.vi
    : values.en;

  const fallbackTitle = primary.title.trim() || values.vi.title.trim() || values.en.title.trim();
  const fallbackSubtitle = primary.subtitle.trim() || values.vi.subtitle.trim() || values.en.subtitle.trim();
  const fallbackDesc = primary.description || values.vi.description || values.en.description;
  const fallbackRole = primary.role.trim() || values.vi.role.trim() || values.en.role.trim();
  const fallbackBadge = primary.badgeText.trim() || values.vi.badgeText.trim() || values.en.badgeText.trim();
  const fallbackContrib = toLines(primary.contributions).length > 0
    ? toLines(primary.contributions)
    : toLines(values.vi.contributions).length > 0
    ? toLines(values.vi.contributions)
    : toLines(values.en.contributions);

  return {
    slug: values.slug.trim(),
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    description: fallbackDesc,
    type: values.type,
    category: values.category,
    featured: values.featured,
    order: previous?.order || 0,
    period: values.period.trim() || undefined,
    role: fallbackRole || undefined,
    teamSize: values.teamSize.trim() || undefined,
    metrics: toMetrics(values.metrics),
    technologies: values.technologies,
    contributions: fallbackContrib,
    architecture: hasArchitecture
      ? {
          title: primary.architectureTitle.trim() || values.vi.architectureTitle.trim() || values.en.architectureTitle.trim(),
          description: primary.architectureDescription.trim() || values.vi.architectureDescription.trim() || values.en.architectureDescription.trim(),
          points: toLines(primary.architecturePoints).length > 0 ? toLines(primary.architecturePoints) : (viArchPoints.length > 0 ? viArchPoints : enArchPoints),
        }
      : undefined,
    githubUrl: values.githubUrl.trim() || undefined,
    githubServerUrl: values.githubServerUrl.trim() || undefined,
    liveUrl: values.liveUrl.trim() || undefined,
    playStoreUrl: values.playStoreUrl.trim() || undefined,
    videoDemoUrl: values.videoDemoUrl.trim() || undefined,
    docsUrl: values.docsUrl.trim() || undefined,
    images: toLines(values.images),
    thumbnail: values.thumbnail.trim() || undefined,
    badgeText: fallbackBadge || undefined,
    verificationStatus: (values.verificationStatus.trim() as Project['verificationStatus']) || undefined,

    // Rich Bilingual Dictionaries
    titleI18n: {
      vi: values.vi.title.trim() || values.en.title.trim(),
      en: values.en.title.trim() || values.vi.title.trim(),
    },
    subtitleI18n: {
      vi: values.vi.subtitle.trim() || values.en.subtitle.trim(),
      en: values.en.subtitle.trim() || values.vi.subtitle.trim(),
    },
    descriptionI18n: {
      vi: values.vi.description || values.en.description,
      en: values.en.description || values.vi.description,
    },
    roleI18n: {
      vi: values.vi.role.trim() || values.en.role.trim(),
      en: values.en.role.trim() || values.vi.role.trim(),
    },
    badgeTextI18n: {
      vi: values.vi.badgeText.trim() || values.en.badgeText.trim(),
      en: values.en.badgeText.trim() || values.vi.badgeText.trim(),
    },
    contributionsI18n: {
      vi: toLines(values.vi.contributions),
      en: toLines(values.en.contributions),
    },
    architectureI18n: hasArchitecture
      ? {
          title: {
            vi: values.vi.architectureTitle.trim() || values.en.architectureTitle.trim(),
            en: values.en.architectureTitle.trim() || values.vi.architectureTitle.trim(),
          },
          description: {
            vi: values.vi.architectureDescription.trim() || values.en.architectureDescription.trim(),
            en: values.en.architectureDescription.trim() || values.vi.architectureDescription.trim(),
          },
          points: {
            vi: viArchPoints,
            en: enArchPoints,
          },
        }
      : undefined,
  };
}

interface ProjectEditorProps {
  mode: 'create' | 'edit';
  projectId?: string;
}

export function ProjectEditor({ mode, projectId }: ProjectEditorProps) {
  const router = useRouter();
  const [project, setProject] = React.useState<Project | null>(null);
  const [values, setValues] = React.useState<ProjectFormValues>(emptyValues);
  const [editorLang, setEditorLang] = React.useState<'vi' | 'en'>('vi');
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(mode === 'edit');
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    categoriesService
      .getCategories()
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      })
      .catch(() => {});
  }, []);

  // New technology input buffer
  const [techInput, setTechInput] = React.useState('');

  // Media & Thumbnail upload refs and states
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
  const mediaInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = React.useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = React.useState(false);

  const isEditing = mode === 'edit';

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    try {
      const res = await uploadService.uploadFile(file);
      const url = formatMediaUrl(res.url);
      updateCommon('thumbnail', url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Tải ảnh đại diện thất bại.');
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const res = await uploadService.uploadFile(file);
      const url = formatMediaUrl(res.url);
      const current = values.images.trim();
      updateCommon('images', current ? `${current}\n${url}` : url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Tải ảnh lên thất bại.');
    } finally {
      setIsUploadingMedia(false);
      if (mediaInputRef.current) mediaInputRef.current.value = '';
    }
  };

  React.useEffect(() => {
    if (!isEditing || !projectId) return;

    let isMounted = true;
    setIsLoading(true);

    void projectsService
      .getProjectById(projectId)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError('Không tìm thấy thông tin dự án.');
          return;
        }
        setProject(data);
        setValues(valuesFromProject(data));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu dự án.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isEditing, projectId]);

  const updateCommon = <Key extends keyof ProjectFormValues>(key: Key, value: ProjectFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateLocalized = <Key extends keyof LocalizedValues>(key: Key, value: LocalizedValues[Key]) => {
    setValues((current) => ({
      ...current,
      [editorLang]: {
        ...current[editorLang],
        [key]: value,
      },
    }));
  };

  // Add technology chip
  const handleAddTechnology = (tech: string) => {
    const clean = tech.trim();
    if (!clean) return;
    if (!values.technologies.includes(clean)) {
      updateCommon('technologies', [...values.technologies, clean]);
    }
    setTechInput('');
  };

  const handleRemoveTechnology = (tech: string) => {
    updateCommon(
      'technologies',
      values.technologies.filter((t) => t !== tech)
    );
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTechnology(techInput);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const activeText = values[editorLang];
    const descriptionText = (activeText.description || values.vi.description || values.en.description)
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    if (!activeText.title.trim() && !values.vi.title.trim() && !values.en.title.trim()) {
      setError('Vui lòng nhập tên dự án (ít nhất một ngôn ngữ).');
      return;
    }

    if (!descriptionText) {
      setError('Vui lòng nhập mô tả chi tiết cho dự án.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const payload = buildPayload(values, project, editorLang);
      let savedProject: Project;

      if (isEditing && project) {
        savedProject = await projectsService.updateProject(project.id, payload);
        setSuccessMsg(`Đã cập nhật dự án "${savedProject.title}" thành công!`);
      } else {
        savedProject = await projectsService.createProject(payload);
        setSuccessMsg(`Đã tạo mới dự án "${savedProject.title}" thành công!`);
        setTimeout(() => {
          router.push(`/admin/projects/${savedProject.id}`);
        }, 1200);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu dự án.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p>Đang tải dữ liệu dự án...</p>
      </div>
    );
  }

  const activeTitle = values[editorLang].title || values.vi.title || values.en.title;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-14 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
            title="Quay lại danh sách dự án"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider hidden sm:inline">
                {isEditing ? 'Chỉnh sửa' : 'Tạo mới'}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <h1 className="text-base sm:text-lg font-bold text-white truncate">
                {activeTitle || (isEditing ? 'Dự án không có tiêu đề' : 'Dự án mới')}
              </h1>
            </div>
            {values.slug && (
              <p className="text-[11px] font-mono text-slate-400 truncate">
                /{values.slug}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/projects')}
            disabled={isSaving}
            className="text-xs"
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            {isEditing ? 'Lưu thay đổi' : 'Tạo dự án'}
          </Button>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 underline font-mono cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 underline font-mono cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Bilingual Language Switcher Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Quản lý Đa ngôn ngữ (Bilingual CMS)</h3>
            <p className="text-xs text-slate-400">
              Chuyển đổi giữa 2 tab để soạn thảo song ngữ cho Tiêu đề, Mô tả, Đóng góp, và Kiến trúc.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setEditorLang('vi')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              editorLang === 'vi'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇻🇳</span>
            <span>Tiếng Việt</span>
            {values.vi.title.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setEditorLang('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              editorLang === 'en'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
            {values.en.title.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: PRIMARY CONTENT ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Project Info */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  Thông tin dự án ({editorLang === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {editorLang.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Tên dự án ({editorLang === 'vi' ? 'Tiếng Việt' : 'English'}) <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={values[editorLang].title}
                  onChange={(e) => updateLocalized('title', e.target.value)}
                  placeholder={
                    editorLang === 'vi'
                      ? 'Ví dụ: MetaNode Blockchain (Layer 1)'
                      : 'e.g. Metanode Layer 1 Blockchain'
                  }
                  className="text-base font-semibold"
                  required={editorLang === 'vi'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Slug URL (Dùng chung)
                  </label>
                  <Input
                    value={values.slug}
                    onChange={(e) => updateCommon('slug', e.target.value)}
                    placeholder="Tự tạo từ tên tiếng Anh nếu để trống"
                  />
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Đường dẫn: /projects/{values.slug || 'slug-du-an'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Tiêu đề phụ ({editorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                  </label>
                  <Input
                    value={values[editorLang].subtitle}
                    onChange={(e) => updateLocalized('subtitle', e.target.value)}
                    placeholder={
                      editorLang === 'vi'
                        ? 'Ví dụ: Engine Blockchain Layer 1 Thông Lượng Cao'
                        : 'e.g. High-Throughput Layer 1 Blockchain Engine'
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Mô tả chi tiết ({editorLang === 'vi' ? 'Tiếng Việt' : 'English'}) <span className="text-rose-400">*</span>
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-800">
                  <RichTextEditor
                    key={editorLang}
                    value={values[editorLang].description}
                    onChange={(val) => updateLocalized('description', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contributions */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  Đóng góp kỹ thuật ({editorLang === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {editorLang.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Nhập các điểm đóng góp chính của bạn trong dự án này (mỗi dòng là một gạch đầu dòng):
              </p>
              <textarea
                value={values[editorLang].contributions}
                onChange={(e) => updateLocalized('contributions', e.target.value)}
                rows={5}
                placeholder={
                  editorLang === 'vi'
                    ? 'Phát triển đường ống thực thi giao dịch đạt 12.000 TPS...\nKhắc phục goroutine deadlock và memory leak qua pprof...\nXây dựng kiến trúc lưu trữ 2 tầng với LevelDB...'
                    : 'Engineered high-throughput transaction execution pipeline handling up to 12,000 TPS...\nIdentified and mitigated severe thread contention and goroutine deadlocks...'
                }
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-mono leading-relaxed"
              />
            </div>
          </div>

          {/* Card 3: Architecture Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  Kiến trúc hệ thống ({editorLang === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {editorLang.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Tiêu đề kiến trúc ({editorLang.toUpperCase()})
                </label>
                <Input
                  value={values[editorLang].architectureTitle}
                  onChange={(e) => updateLocalized('architectureTitle', e.target.value)}
                  placeholder={
                    editorLang === 'vi'
                      ? 'Ví dụ: Pipeline Tối Ưu Xử Lý Đồng Thời: DAG Ordering + BFT Quorum'
                      : 'e.g. DAG Ordering + BFT Quorum Concurrency Pipeline'
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Mô tả kiến trúc ({editorLang.toUpperCase()})
                </label>
                <textarea
                  value={values[editorLang].architectureDescription}
                  onChange={(e) => updateLocalized('architectureDescription', e.target.value)}
                  rows={3}
                  placeholder={
                    editorLang === 'vi'
                      ? 'Tổng quan giải pháp kiến trúc, luồng phân phối dữ liệu...'
                      : 'Architecture overview, data flow...'
                  }
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Điểm nổi bật kiến trúc (Mỗi dòng một gạch đầu dòng)
                </label>
                <textarea
                  value={values[editorLang].architecturePoints}
                  onChange={(e) => updateLocalized('architecturePoints', e.target.value)}
                  rows={3}
                  placeholder={
                    editorLang === 'vi'
                      ? 'Xác thực giao dịch đa giai đoạn không lock...\nLiên kết FFI/cgo zero-copy với Rust...'
                      : 'Concurrent multi-stage verification...\nZero-copy FFI with Rust modules...'
                  }
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Technical Metrics */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Chỉ số kỹ thuật (Benchmarks / Metrics)
              </h2>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Định dạng: <code className="text-cyan-400">Tên chỉ số: Giá trị</code> (mỗi dòng một cặp):
              </p>
              <textarea
                value={values.metrics}
                onChange={(e) => updateCommon('metrics', e.target.value)}
                rows={3}
                placeholder="Peak Throughput: 12,000 TPS&#10;Finality: < 1s Sub-second&#10;Hot-Path Latency: < 2ms In-Memory"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: METADATA & SIDEBAR ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box 0: Cover / Brand Thumbnail */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ảnh đại diện / Thương hiệu</span>
              </h3>
              {values.thumbnail && (
                <button
                  type="button"
                  onClick={() => updateCommon('thumbnail', '')}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa ảnh</span>
                </button>
              )}
            </div>

            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleThumbnailUpload}
              className="hidden"
            />

            {/* Thumbnail Preview or Upload Placeholder */}
            {values.thumbnail ? (
              <div className="space-y-3">
                <div className="relative group rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950/80 aspect-video flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formatMediaUrl(values.thumbnail)}
                    alt="Cover Thumbnail"
                    className="max-h-full max-w-full object-contain rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={isUploadingThumbnail}
                      className="text-xs h-8"
                    >
                      {isUploadingThumbnail ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        'Đổi ảnh'
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                    Đường dẫn ảnh:
                  </label>
                  <Input
                    value={values.thumbnail}
                    onChange={(e) => updateCommon('thumbnail', e.target.value)}
                    placeholder="https://... hoặc /uploads/..."
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-950/70 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                >
                  {isUploadingThumbnail ? (
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-slate-400" />
                  )}
                  <span className="text-xs font-medium text-slate-300">
                    {isUploadingThumbnail ? 'Đang tải ảnh lên...' : 'Tải ảnh logo / cover từ máy'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    PNG, JPG, SVG, WebP (Tối đa 10MB)
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                    Hoặc nhập URL ảnh trực tiếp:
                  </label>
                  <Input
                    value={values.thumbnail}
                    onChange={(e) => updateCommon('thumbnail', e.target.value)}
                    placeholder="https://..."
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Box 1: Classification & Visibility */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono pb-2 border-b border-slate-800">
              Phân loại & Hiển thị
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Danh mục</label>
                <select
                  value={values.category}
                  onChange={(e) => updateCommon('category', e.target.value as Exclude<ProjectCategory, 'all'>)}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-xs text-slate-100 outline-none focus:border-cyan-400"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="blockchain">Blockchain</option>
                      <option value="storage">Storage</option>
                      <option value="ecommerce">E-commerce</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Loại dự án</label>
                <select
                  value={values.type}
                  onChange={(e) => updateCommon('type', e.target.value as ProjectType)}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-xs text-slate-100 outline-none focus:border-cyan-400"
                >
                  <option value="personal">Dự án cá nhân (Personal)</option>
                  <option value="commercial">Dự án thương mại (Commercial)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Trạng thái xác thực (Verification)
                </label>
                <select
                  value={values.verificationStatus}
                  onChange={(e) => updateCommon('verificationStatus', e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-xs text-slate-100 outline-none focus:border-cyan-400"
                >
                  <option value="">Không có</option>
                  <option value="Production System">Production System</option>
                  <option value="Open Source Repo">Open Source Repo</option>
                  <option value="Live System">Live System</option>
                  <option value="Live Demo">Live Demo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Huy hiệu nổi bật ({editorLang.toUpperCase()})
                </label>
                <Input
                  value={values[editorLang].badgeText}
                  onChange={(e) => updateLocalized('badgeText', e.target.value)}
                  placeholder={editorLang === 'vi' ? 'Ví dụ: Hệ thống Cốt lõi • 12K TPS' : 'e.g. Core System • 12,000 TPS'}
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.featured}
                    onChange={(e) => updateCommon('featured', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <div>
                    <span className="font-semibold text-white block">Đặt làm dự án nổi bật</span>
                    <span className="text-[11px] text-slate-400">Hiển thị ưu tiên tại đầu danh sách</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Box 2: Tech Stack */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Công nghệ sử dụng ({values.technologies.length})</span>
              </h3>
            </div>

            {/* Selected chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              {values.technologies.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic py-1 px-1">
                  Chưa gắn thẻ công nghệ nào...
                </span>
              ) : (
                values.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 group"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="text-cyan-400/60 hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input to add technology */}
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                placeholder="Nhập tên rồi ấn Enter..."
                className="flex-1 h-9 rounded-xl border border-slate-800 bg-slate-950/80 px-3 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTechnology(techInput)}
                className="h-9 px-3 text-xs"
              >
                Thêm
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <p className="text-[11px] font-mono text-slate-400 mb-1.5">Gợi ý nhanh:</p>
              <div className="flex flex-wrap gap-1">
                {COMMON_TECH_SUGGESTIONS.map((tech) => {
                  const isSelected = values.technologies.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveTechnology(tech);
                        } else {
                          handleAddTechnology(tech);
                        }
                      }}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border-slate-800'
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Box 3: Role & Team */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vai trò & Nhóm</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Thời gian thực hiện
              </label>
              <Input
                value={values.period}
                onChange={(e) => updateCommon('period', e.target.value)}
                placeholder="Ví dụ: 2024 - Present hoặc 2025"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Vai trò của bạn ({editorLang.toUpperCase()})
              </label>
              <Input
                value={values[editorLang].role}
                onChange={(e) => updateLocalized('role', e.target.value)}
                placeholder={editorLang === 'vi' ? 'Ví dụ: Kỹ sư Blockchain Cốt lõi' : 'e.g. Core Blockchain Engineer'}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Quy mô nhóm (Team Size)
              </label>
              <Input
                value={values.teamSize}
                onChange={(e) => updateCommon('teamSize', e.target.value)}
                placeholder="Ví dụ: 1 hoặc 3 người"
              />
            </div>
          </div>

          {/* Box 4: Links */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Liên kết & Kho mã nguồn</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  GitHub Client / Core Repo
                </label>
                <Input
                  value={values.githubUrl}
                  onChange={(e) => updateCommon('githubUrl', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  GitHub Server / Backend Repo
                </label>
                <Input
                  value={values.githubServerUrl}
                  onChange={(e) => updateCommon('githubServerUrl', e.target.value)}
                  placeholder="https://github.com/...-server"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Website / Live Demo
                </label>
                <Input
                  value={values.liveUrl}
                  onChange={(e) => updateCommon('liveUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Google Play Store
                </label>
                <Input
                  value={values.playStoreUrl}
                  onChange={(e) => updateCommon('playStoreUrl', e.target.value)}
                  placeholder="https://play.google.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Video Demo URL
                </label>
                <Input
                  value={values.videoDemoUrl}
                  onChange={(e) => updateCommon('videoDemoUrl', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          {/* Box 5: Media & Images */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Hình ảnh & Sơ đồ đính kèm
              </h3>
              <button
                type="button"
                onClick={() => mediaInputRef.current?.click()}
                disabled={isUploadingMedia}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isUploadingMedia ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3" />
                )}
                <span>{isUploadingMedia ? 'Đang tải...' : 'Tải ảnh thêm'}</span>
              </button>
            </div>

            <input
              ref={mediaInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={handleMediaUpload}
              className="hidden"
            />

            <div>
              <p className="text-[11px] text-slate-400 mb-2">
                Danh sách đường dẫn ảnh (mỗi dòng một URL ảnh):
              </p>
              <textarea
                value={values.images}
                onChange={(e) => updateCommon('images', e.target.value)}
                rows={3}
                placeholder="https://.../screenshot1.png&#10;https://.../architecture.svg"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
