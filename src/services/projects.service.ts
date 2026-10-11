import { apiClient } from '@/services/api-client';
import { Project, ProjectCategory, ProjectSummary } from '@/types/project';

export class ProjectsService {
  async getAdminProjects(lang?: string): Promise<ProjectSummary[]> {
    const response = await apiClient.get<ProjectSummary[]>('/projects', {
      params: lang ? { lang } : undefined,
    });
    return response.data || [];
  }

  async getProjects(category: ProjectCategory = 'all', lang: string = 'vi'): Promise<ProjectSummary[]> {
    try {
      const response = await apiClient.get<ProjectSummary[]>('/projects', {
        params: {
          category: category !== 'all' ? category : undefined,
          lang,
        },
      });
      return response.data || [];
    } catch (err) {
      console.error('[ProjectsService] Failed to fetch projects from API:', err);
      return [];
    }
  }

  async getProjectById(id: string, lang?: string): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/admin/projects/${id}`, {
        params: lang ? { lang } : undefined,
      });
      return response.data || null;
    } catch {
      return null;
    }
  }

  async getProjectBySlug(slug: string, lang: string = 'vi'): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/projects/${slug}`, {
        params: { lang },
      });
      return response.data || null;
    } catch {
      return null;
    }
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', project);
    return response.data;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await apiClient.put<Project>(`/projects/${id}`, project);
    return response.data;
  }

  async deleteProject(id: string): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/projects/${id}`);
    return response.success;
  }
}

export const projectsService = new ProjectsService();
