import { apiClient } from '@/services/api-client';
import { CreateTagInput, Tag, UpdateTagInput } from '@/types/tag';

export class TagsService {
  async getTags(category?: string): Promise<Tag[]> {
    const params = category && category !== 'all' ? { category } : undefined;
    const response = await apiClient.get<Tag[]>('/tags', { params });
    return response.data || [];
  }

  async getTagById(id: string): Promise<Tag> {
    const response = await apiClient.get<Tag>(`/tags/${id}`);
    return response.data;
  }

  async createTag(payload: CreateTagInput): Promise<Tag> {
    const response = await apiClient.post<Tag>('/admin/tags', payload);
    return response.data;
  }

  async updateTag(id: string, payload: UpdateTagInput): Promise<Tag> {
    const response = await apiClient.put<Tag>(`/admin/tags/${id}`, payload);
    return response.data;
  }

  async deleteTag(id: string): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/admin/tags/${id}`);
    return response.success;
  }
}

export const tagsService = new TagsService();
