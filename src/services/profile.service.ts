import { config } from '@/lib/config';
import { apiClient } from '@/services/api-client';
import { MOCK_PROFILE } from '@/services/mock-data';
import { Profile } from '@/types/profile';

export class ProfileService {
  async getProfile(): Promise<Profile> {
    if (config.useMock) {
      return MOCK_PROFILE;
    }

    try {
      const response = await apiClient.get<Profile>('/profile');
      return response.data;
    } catch {
      // Fallback to mock data if API call fails
      return MOCK_PROFILE;
    }
  }
}

export const profileService = new ProfileService();
