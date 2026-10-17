'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Layers, CheckCircle2 } from 'lucide-react';
import { Project } from '@/types/project';
import { useI18n } from '@/store/i18n-provider';
import { RichTextContent } from './rich-text-content';
import { formatMediaUrl } from '@/services/upload.service';
import { ProjectContents } from './project-contents';

const accentStyles = [
  'border-cyan-400/30 bg-cyan-400/10 text-cyan-800 dark:text-cyan-200',
  'border-violet-400/30 bg-violet-400/10 text-violet-800 dark:text-violet-200',
  'border-amber-400/30 bg-amber-400/10 text-amber-800 dark:text-amber-200',
];

export function ProjectDetail({ project: p, previewLanguage }: { project: Project; previewLanguage?: 'vi' | 'en' }) {
  const { language } = useI18n();
  const locale = previewLanguage || language;
  const vi = locale === 'vi';
  const title = p.titleI18n?.[locale] || p.title;
  const subtitle = p.subtitleI18n?.[locale] || p.subtitle;
  const description = p.descriptionI18n?.[locale] || p.description;
  const role = p.roleI18n?.[locale] || p.role;
  const contributions = p.contributionsI18n?.[locale] || p.contributions || [];
  const architecture = p.architectureI18n ? {
    title: p.architectureI18n.title?.[locale] || p.architecture?.title,
    description: p.architectureI18n.description?.[locale] || p.architecture?.description,
    points: p.architectureI18n.points?.[locale] || p.architecture?.points || [],
  } : p.architecture;
  const images = [...new Set([p.thumbnail, ...(p.images || [])].filter((url): url is string => Boolean(url)))];
  const links = [
    ['Live demo', p.liveUrl], ['GitHub', p.githubUrl], ['Backend source', p.githubServerUrl],
    ['Google Play', p.playStoreUrl], ['Video demo', p.videoDemoUrl], [vi ? 'Tài liệu' : 'Documentation', p.docsUrl],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const hasArchitecture = Boolean(architecture && (architecture.title || architecture.description || architecture.points?.length));
  const sections = [
    { id: 'overview', label: vi ? 'Tổng quan' : 'Overview' },
    ...(contributions.length ? [{ id: 'contributions', label: vi ? 'Đóng góp' : 'Contributions' }] : []),
    ...(hasArchitecture ? [{ id: 'architecture', label: vi ? 'Kiến trúc' : 'Architecture' }] : []),
    { id: 'stack', label: vi ? 'Công nghệ' : 'Tech stack' },
    ...(images.length ? [{ id: 'gallery', label: vi ? 'Hình ảnh' : 'Gallery' }] : []),
  ];
  const sectionClass = 'scroll-mt-44 lg:scroll-mt-28 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 p-4 sm:p-6 shadow-sm';
  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-14">
      <Link href={`/${locale}#projects`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-500"><ArrowLeft size={16} />{vi ? 'Tất cả dự án' : 'All projects'}</Link>
      <header className="relative overflow-hidden mt-5 rounded-3xl border border-violet-400/30 bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 p-5 sm:p-7 text-white shadow-xl shadow-violet-500/10">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-400" />
        <div aria-hidden="true" className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300"><span>Project case study</span><span> / {p.category}</span><span> / {p.type}</span></div>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-bold tracking-tight leading-tight break-words">{title}</h1>
          <div className="mt-3 min-w-0">
          <p className="max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-300">{subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">{links.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm hover:bg-cyan-500 hover:text-slate-950 transition-colors">{label}<ArrowUpRight size={16} /></a>)}</div>
          <dl className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 border-t border-white/15 pt-4">{[[vi ? 'Vai trò' : 'Role', role], [vi ? 'Thời gian' : 'Timeline', p.period], [vi ? 'Quy mô nhóm' : 'Team size', p.teamSize]].filter(([, value]) => Boolean(value)).map(([label, value]) => <div key={String(label)}><dt className="text-xs uppercase tracking-widest text-violet-300">{label}</dt><dd className="mt-2 text-sm text-slate-200">{value}</dd></div>)}</dl>
          </div>
        </div>
      </header>

      {p.metrics && p.metrics.length > 0 && <div className="mt-3 grid gap-3 sm:grid-cols-3">{p.metrics.map((metric, i) => <div key={i} className={`rounded-2xl border p-4 ${accentStyles[i % accentStyles.length]}`}><div className="text-2xl sm:text-3xl font-bold tracking-tight">{metric.value}</div><div className="mt-2 text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">{metric.label}</div></div>)}</div>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-16 z-20 self-start lg:top-24"><ProjectContents sections={sections} vi={vi} /></aside>
        <div className="min-w-0 space-y-4">
          <section id="overview" className={sectionClass}><h2 className="mb-4 text-2xl font-bold">{vi ? 'Tổng quan dự án' : 'Project overview'}</h2><RichTextContent content={description} className="text-base leading-7 text-slate-600 dark:text-slate-300" /></section>
          {contributions.length > 0 && <section id="contributions" className={sectionClass}><h2 className="mb-4 text-2xl font-bold">{vi ? 'Những đóng góp chính' : 'Key contributions'}</h2><ol className="space-y-4">{contributions.map((item, i) => <li key={i} className="flex gap-4"><span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 font-mono text-xs text-cyan-600 dark:text-cyan-400">{String(i + 1).padStart(2, '0')}</span><p className="pt-1 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">{item}</p></li>)}</ol></section>}
          {hasArchitecture && architecture && <section id="architecture" className={sectionClass}><Layers className="mb-3 text-cyan-500" /><h2 className="text-2xl font-bold">{architecture.title || (vi ? 'Kiến trúc hệ thống' : 'System architecture')}</h2><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{architecture.description}</p><div className="mt-4 space-y-3">{architecture.points?.map((point, i) => <div key={i} className="flex gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4"><CheckCircle2 size={19} className="mt-1 shrink-0 text-cyan-500" /><p className="text-sm leading-7">{point}</p></div>)}</div></section>}
          <section id="stack" className={sectionClass}><h2 className="mb-4 text-2xl font-bold">Tech stack</h2><div className="flex flex-wrap gap-3">{p.technologies?.map(tech => <span key={tech} className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-mono">{tech}</span>)}</div></section>
          {images.length > 0 && <section id="gallery" className={sectionClass}><h2 className="mb-4 text-2xl font-bold">{vi ? 'Hình ảnh dự án' : 'Project gallery'}</h2><div className="grid gap-3 sm:grid-cols-2">{images.map((url, i) => <figure key={url} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={formatMediaUrl(url)} alt={`${title} — ${i + 1}`} loading="lazy" className="aspect-video w-full object-contain" />
          </figure>)}</div></section>}
          <div className="flex flex-wrap justify-between gap-4 py-5 border-t border-slate-200 dark:border-slate-800"><Link href="/#projects" className="inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} />{vi ? 'Khám phá dự án khác' : 'Explore more projects'}</Link><Link href="/#contact" className="inline-flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400">{vi ? 'Cùng trao đổi thêm' : 'Let’s talk'}<ArrowUpRight size={16} /></Link></div>
        </div>
      </div>
    </article>
  );
}
