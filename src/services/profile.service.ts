import { apiClient } from '@/services/api-client';
import { Profile, RawProfile, DEFAULT_PROFILE } from '@/types/profile';

export class ProfileService {
  async getProfile(lang: string = 'vi'): Promise<Profile> {
    try {
      const response = await apiClient.get<Profile>('/profile', {
        params: { lang },
      });
      return response.data || DEFAULT_PROFILE;
    } catch (err) {
      console.error('[ProfileService] Failed to load profile from API:', err);
      return DEFAULT_PROFILE;
    }
  }

  async getRawProfile(): Promise<RawProfile> {
    const response = await apiClient.get<RawProfile>('/admin/profile');
    if (!response.data) {
      throw new Error(response.message || 'Không thể lấy dữ liệu profile.');
    }
    return response.data;
  }

  async updateProfile(data: RawProfile): Promise<RawProfile> {
    const response = await apiClient.put<RawProfile>('/admin/profile', data);
    if (!response.data) {
      throw new Error(response.message || 'Không thể cập nhật thông tin profile.');
    }
    return response.data;
  }
}

export const profileService = new ProfileService();
