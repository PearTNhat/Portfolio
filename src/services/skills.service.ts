import { apiClient } from '@/services/api-client';
import { SkillCategory, RawSkillCategory } from '@/types/skill';

export class SkillsService {
  async getSkillCategories(lang: string = 'vi'): Promise<SkillCategory[]> {
    try {
      const response = await apiClient.get<SkillCategory[]>('/skills', {
        params: { lang },
      });
      return response.data || [];
    } catch (err) {
      console.error('[SkillsService] Failed to load skills from API:', err);
      return [];
    }
  }

  async getRawSkillCategories(): Promise<RawSkillCategory[]> {
    const response = await apiClient.get<RawSkillCategory[]>('/admin/skills');
    return response.data || [];
  }

  async getSkillCategoryById(id: string): Promise<RawSkillCategory> {
    const response = await apiClient.get<RawSkillCategory>(`/admin/skills/${id}`);
    if (!response.data) {
      throw new Error(response.message || 'Không tìm thấy nhóm kỹ năng.');
    }
    return response.data;
  }

  async createSkillCategory(data: RawSkillCategory): Promise<RawSkillCategory> {
    const response = await apiClient.post<RawSkillCategory>('/admin/skills', data);
    if (!response.data) {
      throw new Error(response.message || 'Không thể tạo nhóm kỹ năng mới.');
    }
    return response.data;
  }

  async updateSkillCategory(id: string, data: RawSkillCategory): Promise<RawSkillCategory> {
    const response = await apiClient.put<RawSkillCategory>(`/admin/skills/${id}`, data);
    if (!response.data) {
      throw new Error(response.message || 'Không thể cập nhật nhóm kỹ năng.');
    }
    return response.data;
  }

  async deleteSkillCategory(id: string): Promise<void> {
    await apiClient.delete(`/admin/skills/${id}`);
  }
}

export const skillsService = new SkillsService();
