import { config } from '@/lib/config';
import { apiClient } from '@/services/api-client';
import { MOCK_PROJECTS } from '@/services/mock-data';
import { Project, ProjectCategory } from '@/types/project';

export class ProjectsService {
  async getAdminProjects(lang?: string): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/projects', {
      params: lang ? { lang } : undefined,
    });
    return response.data;
  }

  async getProjects(category: ProjectCategory = 'all', lang: string = 'vi'): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>('/projects', {
        params: {
          category: category !== 'all' ? category : undefined,
          lang,
        },
      });
      return response.data || [];
    } catch (err) {
      console.warn('[ProjectsService] Live API call failed, falling back to local data:', err);
      return category === 'all'
        ? MOCK_PROJECTS
        : MOCK_PROJECTS.filter((p) => p.category === category);
    }
  }

  async getProjectById(id: string, lang?: string): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/admin/projects/${id}`, {
        params: lang ? { lang } : undefined,
      });
      return response.data;
    } catch {
      const list = await this.getAdminProjects(lang);
      return list.find((p) => p.id === id) || null;
    }
  }

  async getProjectBySlug(slug: string, lang: string = 'vi'): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/projects/${slug}`, {
        params: { lang },
      });
      return response.data;
    } catch {
      return MOCK_PROJECTS.find((p) => p.slug === slug) || null;
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
