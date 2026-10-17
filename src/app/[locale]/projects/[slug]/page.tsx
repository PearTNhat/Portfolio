import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { config } from '@/lib/config';
import { Project } from '@/types/project';
import { ProjectDetail } from '@/features/projects/components/project-detail';

const getProject = cache(async (slug: string, locale: string): Promise<Project | null> => {
  const lang = locale === 'en' ? 'en' : 'vi';
  const response = await fetch(`${config.apiUrl}/projects/${encodeURIComponent(slug)}?lang=${lang}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(60000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load project');
  const body = await response.json();
  return body.data ?? body;
});

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);
  if (!project) return { title: 'Project not found' };

  const isEn = locale === 'en';
  const title = project.titleI18n?.[locale as 'vi' | 'en'] || project.title;
  const subtitle = project.subtitleI18n?.[locale as 'vi' | 'en'] || project.subtitle;

  return {
    title,
    description: subtitle,
    alternates: {
      canonical: `${config.siteUrl}/${locale}/projects/${encodeURIComponent(slug)}`,
      languages: {
        vi: `${config.siteUrl}/vi/projects/${encodeURIComponent(slug)}`,
        en: `${config.siteUrl}/en/projects/${encodeURIComponent(slug)}`,
      },
    },
    openGraph: {
      title,
      description: subtitle,
      type: 'article',
      locale: isEn ? 'en_US' : 'vi_VN',
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== 'vi' && locale !== 'en') notFound();

  const project = await getProject(slug, locale);
  if (!project) notFound();

  return <ProjectDetail project={project} previewLanguage={locale as 'vi' | 'en'} />;
}
