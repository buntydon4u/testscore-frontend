import { ApiClient } from './api';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'ESSAY';
  questionText: string;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  timeLimit?: number;
  questionBankId: string;
  passageId?: string;
  mediaAssets?: string[];
  options?: QuestionOption[];
  tags?: Tag[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  type: 'SUBJECT' | 'TOPIC' | 'SKILL' | 'DIFFICULTY' | 'OTHER';
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  instructions?: string;
}

export interface CreateQuestionDto {
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'ESSAY';
  questionText: string;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  timeLimit?: number;
  questionBankId: string;
  passageId?: string;
  mediaAssets?: string[];
  options?: Partial<QuestionOption>[];
  tagIds?: string[];
}

export interface UpdateQuestionDto {
  type?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'ESSAY';
  questionText?: string;
  explanation?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  marks?: number;
  timeLimit?: number;
  passageId?: string;
  mediaAssets?: string[];
  options?: Partial<QuestionOption>[];
  tagIds?: string[];
}

export interface QuestionSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  difficulty?: string;
  questionBankId?: string;
  tagIds?: string[];
  createdBy?: string;
}

export interface QuestionListResponse {
  data: Question[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BulkCreateQuestionDto {
  questions: CreateQuestionDto[];
}

class QuestionService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/questions');
  }

  async list(params?: QuestionSearchParams): Promise<QuestionListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.questionBankId) queryParams.append('questionBankId', params.questionBankId);
    if (params?.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params?.tagIds) {
      params.tagIds.forEach(tagId => queryParams.append('tagIds', tagId));
    }

    const url = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.apiClient.get<QuestionListResponse>(url);
  }

  async getById(id: string): Promise<Question> {
    return this.apiClient.get<Question>(`/${id}`);
  }

  async create(data: CreateQuestionDto): Promise<Question> {
    return this.apiClient.post<Question>('', data);
  }

  async update(id: string, data: UpdateQuestionDto): Promise<Question> {
    return this.apiClient.put<Question>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete<void>(`/${id}`);
  }

  async bulkCreate(data: BulkCreateQuestionDto): Promise<Question[]> {
    return this.apiClient.post<Question[]>('/bulk', data);
  }

  // Options management
  async addOption(questionId: string, option: Partial<QuestionOption>): Promise<QuestionOption> {
    return this.apiClient.post<QuestionOption>(`/${questionId}/options`, option);
  }

  async updateOption(questionId: string, optionId: string, option: Partial<QuestionOption>): Promise<QuestionOption> {
    return this.apiClient.put<QuestionOption>(`/${questionId}/options/${optionId}`, option);
  }

  async deleteOption(questionId: string, optionId: string): Promise<void> {
    return this.apiClient.delete<void>(`/${questionId}/options/${optionId}`);
  }
}

export const questionService = new QuestionService();
