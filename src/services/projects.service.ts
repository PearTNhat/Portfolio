import { config } from '@/lib/config';
import { apiClient } from '@/services/api-client';
import { MOCK_PROJECTS } from '@/services/mock-data';
import { Project, ProjectCategory } from '@/types/project';

export class ProjectsService {
  async getProjects(category: ProjectCategory = 'all'): Promise<Project[]> {
    if (config.useMock) {
      if (category === 'all') {
        return MOCK_PROJECTS;
      }
      return MOCK_PROJECTS.filter((p) => p.category === category);
    }

    try {
      const response = await apiClient.get<Project[]>('/projects', {
        params: category !== 'all' ? { category } : undefined,
      });
      return response.data;
    } catch {
      return category === 'all'
        ? MOCK_PROJECTS
        : MOCK_PROJECTS.filter((p) => p.category === category);
    }
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (config.useMock) {
      return MOCK_PROJECTS.find((p) => p.slug === slug) || null;
    }

    try {
      const response = await apiClient.get<Project>(`/projects/${slug}`);
      return response.data;
    } catch {
      return MOCK_PROJECTS.find((p) => p.slug === slug) || null;
    }
  }

  // Future CRUD methods for Golang Backend
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
