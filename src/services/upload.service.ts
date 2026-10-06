import { apiClient } from '@/services/api-client';
import { config } from '@/lib/config';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

/**
 * Normalizes an image or diagram URL so that backend-uploaded paths (/uploads/...)
 * resolve cleanly against the Go backend host, while preserving absolute or external URLs.
 */
export function formatMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/uploads')) {
    try {
      const origin = new URL(config.apiUrl).origin;
      return `${origin}${trimmed}`;
    } catch {
      return `http://localhost:8080${trimmed}`;
    }
  }

  return trimmed;
}

class UploadService {
  async uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.upload<UploadResult>('/admin/upload', formData);
    if (!response.data) {
      throw new Error(response.message || 'Tải file lên thất bại.');
    }
    return response.data;
  }
}

export const uploadService = new UploadService();
