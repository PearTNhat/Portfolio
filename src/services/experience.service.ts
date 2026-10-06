import { apiClient } from '@/services/api-client';
import { MOCK_EXPERIENCE } from '@/services/mock-data';
import { Experience } from '@/types/experience';

export class ExperienceService {
  async getExperiences(lang: string = 'vi'): Promise<Experience[]> {
    try {
      const response = await apiClient.get<Experience[]>('/experiences', {
        params: { lang },
      });
      return response.data || MOCK_EXPERIENCE;
    } catch (err) {
      console.warn('[ExperienceService] Live API call failed, using fallback bundle:', err);
      return MOCK_EXPERIENCE;
    }
  }
}

export const experienceService = new ExperienceService();
