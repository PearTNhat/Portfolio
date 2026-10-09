import { apiClient } from '@/services/api-client';
import { Experience, RawExperience } from '@/types/experience';

export class ExperienceService {
  async getExperiences(lang: string = 'vi'): Promise<Experience[]> {
    try {
      const response = await apiClient.get<Experience[]>('/experiences', {
        params: { lang },
      });
      return response.data || [];
    } catch (err) {
      console.error('[ExperienceService] Failed to load experiences from API:', err);
      return [];
    }
  }

  async getRawExperiences(): Promise<RawExperience[]> {
    const response = await apiClient.get<RawExperience[]>('/admin/experiences');
    return response.data || [];
  }

  async getExperienceById(id: string): Promise<RawExperience> {
    const response = await apiClient.get<RawExperience>(`/admin/experiences/${id}`);
    if (!response.data) {
      throw new Error(response.message || 'Không tìm thấy kinh nghiệm.');
    }
    return response.data;
  }

  async createExperience(data: RawExperience): Promise<RawExperience> {
    const response = await apiClient.post<RawExperience>('/admin/experiences', data);
    if (!response.data) {
      throw new Error(response.message || 'Không thể tạo kinh nghiệm mới.');
    }
    return response.data;
  }

  async updateExperience(id: string, data: RawExperience): Promise<RawExperience> {
    const response = await apiClient.put<RawExperience>(`/admin/experiences/${id}`, data);
    if (!response.data) {
      throw new Error(response.message || 'Không thể cập nhật kinh nghiệm.');
    }
    return response.data;
  }

  async deleteExperience(id: string): Promise<void> {
    await apiClient.delete(`/admin/experiences/${id}`);
  }
}

export const experienceService = new ExperienceService();
