import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { config } from '@/lib/config';
import { Project } from '@/types/project';
import { ProjectDetail } from '@/features/projects/components/project-detail';

const getProject = cache(async (slug: string): Promise<Project | null> => {
  const response = await fetch(`${config.apiUrl}/projects/${encodeURIComponent(slug)}?lang=vi`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(60000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load project');
  const body = await response.json();
  return body.data ?? body;
});

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: `${config.siteUrl}/projects/${encodeURIComponent(slug)}` },
    openGraph: { title: project.title, description: project.subtitle, type: 'article' },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
