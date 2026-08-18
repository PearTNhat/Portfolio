import { config } from '@/lib/config';
import { apiClient } from '@/services/api-client';
import { MOCK_SKILLS } from '@/services/mock-data';
import { SkillCategory } from '@/types/skill';

export class SkillsService {
  async getSkillCategories(): Promise<SkillCategory[]> {
    if (config.useMock) {
      return MOCK_SKILLS;
    }

    try {
      const response = await apiClient.get<SkillCategory[]>('/skills');
      return response.data;
    } catch {
      return MOCK_SKILLS;
    }
  }
}

export const skillsService = new SkillsService();
