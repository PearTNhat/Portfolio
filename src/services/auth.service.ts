import { apiClient } from '@/services/api-client';
import { LoginResponse, User } from '@/types/auth';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const loginData = response.data;
    if (typeof window !== 'undefined' && loginData?.token) {
      localStorage.setItem(TOKEN_KEY, loginData.token);
      if (loginData.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));
      }
      // Set client-accessible cookie for middleware/page transitions
      document.cookie = `${TOKEN_KEY}=${loginData.token}; path=/; max-age=${72 * 3600}; SameSite=Lax`;
    }

    return loginData;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue cleanup even if server request fails
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
      }
    }
  }

  async getMe(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/admin/me');
      if (response.data && typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
