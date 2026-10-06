import { apiClient } from '@/services/api-client';
import { MOCK_PROFILE } from '@/services/mock-data';
import { Profile } from '@/types/profile';

export class ProfileService {
  async getProfile(lang: string = 'vi'): Promise<Profile> {
    try {
      const response = await apiClient.get<Profile>('/profile', {
        params: { lang },
      });
      return response.data || MOCK_PROFILE;
    } catch (err) {
      console.warn('[ProfileService] Live API call failed, using fallback bundle:', err);
      return MOCK_PROFILE;
    }
  }
}

export const profileService = new ProfileService();
