import { ProjectEditor } from '@/features/projects/components/admin/project-editor';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectEditor mode="edit" projectId={id} />;
}
