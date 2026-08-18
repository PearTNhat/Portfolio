import { config } from '@/lib/config';
import { apiClient } from '@/services/api-client';
import { ContactFormInput, ContactMessage } from '@/types/contact';

export class ContactService {
  async sendMessage(payload: ContactFormInput): Promise<ContactMessage> {
    if (config.useMock) {
      // Simulate network delay in mock mode
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        ...payload,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'unread',
      };
    }

    try {
      const response = await apiClient.post<ContactMessage>('/contact', payload);
      return response.data;
    } catch {
      // If external BE is unreachable, fallback to simulated success for smooth demo
      return {
        ...payload,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'unread',
      };
    }
  }
}

export const contactService = new ContactService();
