import { config } from '@/lib/config';
import { apiClient } from '@/services/api-client';
import { MOCK_EXPERIENCE } from '@/services/mock-data';
import { Experience } from '@/types/experience';

export class ExperienceService {
  async getExperiences(): Promise<Experience[]> {
    if (config.useMock) {
      return MOCK_EXPERIENCE;
    }

    try {
      const response = await apiClient.get<Experience[]>('/experiences');
      return response.data;
    } catch {
      return MOCK_EXPERIENCE;
    }
  }
}

export const experienceService = new ExperienceService();
