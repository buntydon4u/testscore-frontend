import { ApiClient } from './api';

export interface Tag {
  id: string;
  name: string;
  type: 'SUBJECT' | 'TOPIC' | 'SKILL' | 'DIFFICULTY' | 'OTHER';
  description?: string;
  color?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
    children?: number;
  };
}

export interface CreateTagDto {
  name: string;
  type: 'SUBJECT' | 'TOPIC' | 'SKILL' | 'DIFFICULTY' | 'OTHER';
  description?: string;
  color?: string;
  parentId?: string;
}

export interface UpdateTagDto {
  name?: string;
  type?: 'SUBJECT' | 'TOPIC' | 'SKILL' | 'DIFFICULTY' | 'OTHER';
  description?: string;
  color?: string;
  parentId?: string;
}

export interface TagSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  parentId?: string;
}

export interface TagListResponse {
  data: Tag[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TagTree {
  [key: string]: Tag[];
}

class TagService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/tags');
  }

  async list(params?: TagSearchParams): Promise<TagListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.parentId) queryParams.append('parentId', params.parentId);

    const url = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.apiClient.get<TagListResponse>(url);
  }

  async getById(id: string): Promise<Tag> {
    return this.apiClient.get<Tag>(`/${id}`);
  }

  async create(data: CreateTagDto): Promise<Tag> {
    return this.apiClient.post<Tag>('', data);
  }

  async update(id: string, data: UpdateTagDto): Promise<Tag> {
    return this.apiClient.put<Tag>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete<void>(`/${id}`);
  }

  async getTree(): Promise<TagTree> {
    return this.apiClient.get<TagTree>('/tree');
  }

  async getByType(type: string): Promise<Tag[]> {
    return this.apiClient.get<Tag[]>(`/type/${type}`);
  }

  // Question tag management
  async tagQuestion(questionId: string, tagId: string): Promise<void> {
    return this.apiClient.post<void>(`/questions/${questionId}/tags/${tagId}`);
  }

  async untagQuestion(questionId: string, tagId: string): Promise<void> {
    return this.apiClient.delete<void>(`/questions/${questionId}/tags/${tagId}`);
  }

  async getQuestionTags(questionId: string): Promise<Tag[]> {
    return this.apiClient.get<Tag[]>(`/questions/${questionId}/tags`);
  }
}

export const tagService = new TagService();
