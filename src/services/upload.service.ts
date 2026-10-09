import { apiClient } from '@/services/api-client';
import { config } from '@/lib/config';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

/**
 * Registry to hold pending File objects mapped to local blob: URLs
 * for "Upload on Save" strategy (instant UI preview, no orphaned server files).
 */
const pendingBlobFiles = new Map<string, File>();

export function registerPendingBlob(blobUrl: string, file: File) {
  pendingBlobFiles.set(blobUrl, file);
}

export function getPendingBlob(blobUrl: string): File | undefined {
  return pendingBlobFiles.get(blobUrl);
}

export function revokePendingBlob(blobUrl: string) {
  if (pendingBlobFiles.has(blobUrl)) {
    try {
      URL.revokeObjectURL(blobUrl);
    } catch {
      // ignore
    }
    pendingBlobFiles.delete(blobUrl);
  }
}

/**
 * If the given URL is a local blob: URL and registered in pendingBlobFiles,
 * uploads it to the backend and returns the persistent server URL.
 * Otherwise returns the URL unchanged.
 */
export async function uploadIfBlob(url: string | null | undefined): Promise<string> {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const file = pendingBlobFiles.get(trimmed);
  if (!file) {
    // If not found in registry (e.g. stale reload), return as is
    return trimmed;
  }

  const res = await uploadService.uploadFile(file);
  const persistentUrl = formatMediaUrl(res.url);
  revokePendingBlob(trimmed);
  return persistentUrl;
}

/**
 * Scans HTML content for all blob: URLs created locally.
 * Uploads them sequentially to the backend, replaces them with persistent URLs,
 * and frees up the blob memory.
 */
export async function processAndUploadPendingBlobs(content: string): Promise<string> {
  if (!content) return '';
  const blobRegex = /blob:http[^\s"'>)]+/g;
  const matches = Array.from(new Set(content.match(blobRegex) || []));
  if (matches.length === 0) return content;

  let result = content;
  for (const blobUrl of matches) {
    const file = pendingBlobFiles.get(blobUrl);
    if (file) {
      try {
        const uploadRes = await uploadService.uploadFile(file);
        const serverUrl = formatMediaUrl(uploadRes.url);
        result = result.split(blobUrl).join(serverUrl);
        revokePendingBlob(blobUrl);
      } catch (err) {
        console.error('Failed to upload pending blob image:', blobUrl, err);
        throw new Error(
          'Tải ảnh lên máy chủ thất bại: ' + (err instanceof Error ? err.message : '')
        );
      }
    }
  }
  return result;
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

  async deleteFile(filename: string): Promise<void> {
    // Strip any leading path components
    const cleanName = filename.replace(/^.*[\\/]/, '');
    await apiClient.delete(`/admin/upload/${cleanName}`);
  }
}

export const uploadService = new UploadService();
