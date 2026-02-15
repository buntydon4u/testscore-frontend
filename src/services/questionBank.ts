import { ApiClient } from './api';

export interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
  };
}

export interface CreateQuestionBankDto {
  name: string;
  description?: string;
}

export interface UpdateQuestionBankDto {
  name?: string;
  description?: string;
}

export interface QuestionBankSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  createdBy?: string;
}

export interface QuestionBankListResponse {
  data: QuestionBank[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class QuestionBankService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/question-banks');
  }

  async list(params?: QuestionBankSearchParams): Promise<QuestionBankListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);

    const url = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.apiClient.get<QuestionBankListResponse>(url);
  }

  async getById(id: string): Promise<QuestionBank> {
    return this.apiClient.get<QuestionBank>(`/${id}`);
  }

  async create(data: CreateQuestionBankDto): Promise<QuestionBank> {
    return this.apiClient.post<QuestionBank>('', data);
  }

  async update(id: string, data: UpdateQuestionBankDto): Promise<QuestionBank> {
    return this.apiClient.put<QuestionBank>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete<void>(`/${id}`);
  }

  async getQuestions(id: string, params?: { page?: number; limit?: number }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = queryParams.toString() ? `/${id}/questions?${queryParams.toString()}` : `/${id}/questions`;
    return this.apiClient.get(url);
  }
}

export const questionBankService = new QuestionBankService();
