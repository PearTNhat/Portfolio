export interface Tag {
  id: string;
  name: string;
  slug: string;
  category?: string;
  color?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
  category?: string;
  color?: string;
  description?: string;
}

export interface UpdateTagInput {
  name?: string;
  slug?: string;
  category?: string;
  color?: string;
  description?: string;
}
