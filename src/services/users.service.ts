import { apiClient } from '@/services/api-client';
import { AdminUser, CreateUserInput, UpdateUserInput } from '@/types/user';

export class UsersService {
  async getUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminUser[]>('/admin/users');
    return response.data || [];
  }

  async getUserById(id: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`/admin/users/${id}`);
    return response.data;
  }

  async createUser(payload: CreateUserInput): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>('/admin/users', payload);
    return response.data;
  }

  async updateUser(id: string, payload: UpdateUserInput): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(`/admin/users/${id}`, payload);
    return response.data;
  }

  async deleteUser(id: string): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/admin/users/${id}`);
    return response.success;
  }
}

export const usersService = new UsersService();
