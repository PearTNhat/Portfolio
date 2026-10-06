import { apiClient } from '@/services/api-client';
import { MOCK_SKILLS } from '@/services/mock-data';
import { SkillCategory } from '@/types/skill';

export class SkillsService {
  async getSkillCategories(lang: string = 'vi'): Promise<SkillCategory[]> {
    try {
      const response = await apiClient.get<SkillCategory[]>('/skills', {
        params: { lang },
      });
      return response.data || MOCK_SKILLS;
    } catch (err) {
      console.warn('[SkillsService] Live API call failed, using fallback bundle:', err);
      return MOCK_SKILLS;
    }
  }
}

export const skillsService = new SkillsService();
