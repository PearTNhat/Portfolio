export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactFormInput {
  id: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}
