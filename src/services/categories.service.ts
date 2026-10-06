import { apiClient } from '@/services/api-client';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

export class CategoriesService {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data || [];
  }

  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  }

  async createCategory(payload: CreateCategoryInput): Promise<Category> {
    const response = await apiClient.post<Category>('/admin/categories', payload);
    return response.data;
  }

  async updateCategory(id: string, payload: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient.put<Category>(`/admin/categories/${id}`, payload);
    return response.data;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/admin/categories/${id}`);
    return response.success;
  }
}

export const categoriesService = new CategoriesService();
