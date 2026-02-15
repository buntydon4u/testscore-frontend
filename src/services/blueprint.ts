import { ApiClient } from './api';

export interface Blueprint {
  id: string;
  name: string;
  description?: string;
  examId?: string;
  totalMarks: number;
  totalQuestions: number;
  timeLimit?: number;
  isActive: boolean;
  rules?: BlueprintRule[];
  createdAt: string;
  updatedAt: string;
}

export interface BlueprintRule {
  id: string;
  blueprintId: string;
  type: 'TOPIC' | 'DIFFICULTY' | 'QUESTION_TYPE' | 'TAG';
  condition: 'EQUALS' | 'IN' | 'BETWEEN';
  value: any;
  questionCount: number;
  marksPerQuestion: number;
  order?: string;
  isOptional: boolean;
}

export interface CreateBlueprintDto {
  name: string;
  description?: string;
  examId?: string;
  totalMarks: number;
  totalQuestions: number;
  timeLimit?: number;
  isActive?: boolean;
}

export interface UpdateBlueprintDto {
  name?: string;
  description?: string;
  totalMarks?: number;
  totalQuestions?: number;
  timeLimit?: number;
  isActive?: boolean;
}

export interface CreateBlueprintRuleDto {
  type: 'TOPIC' | 'DIFFICULTY' | 'QUESTION_TYPE' | 'TAG';
  condition: 'EQUALS' | 'IN' | 'BETWEEN';
  value: any;
  questionCount: number;
  marksPerQuestion: number;
  order?: string;
  isOptional: boolean;
}

export interface UpdateBlueprintRuleDto {
  type?: 'TOPIC' | 'DIFFICULTY' | 'QUESTION_TYPE' | 'TAG';
  condition?: 'EQUALS' | 'IN' | 'BETWEEN';
  value?: any;
  questionCount?: number;
  marksPerQuestion?: number;
  order?: string;
  isOptional?: boolean;
}

export interface BlueprintSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  examId?: string;
  isActive?: boolean;
}

export interface BlueprintListResponse {
  data: Blueprint[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class BlueprintService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/blueprints');
  }

  async list(params?: BlueprintSearchParams): Promise<BlueprintListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.examId) queryParams.append('examId', params.examId);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.apiClient.get<BlueprintListResponse>(url);
  }

  async getById(id: string): Promise<Blueprint> {
    return this.apiClient.get<Blueprint>(`/${id}`);
  }

  async create(data: CreateBlueprintDto): Promise<Blueprint> {
    return this.apiClient.post<Blueprint>('', data);
  }

  async update(id: string, data: UpdateBlueprintDto): Promise<Blueprint> {
    return this.apiClient.put<Blueprint>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete<void>(`/${id}`);
  }

  // Rule management
  async addRule(blueprintId: string, rule: CreateBlueprintRuleDto): Promise<BlueprintRule> {
    return this.apiClient.post<BlueprintRule>(`/${blueprintId}/rules`, rule);
  }

  async updateRule(blueprintId: string, ruleId: string, rule: UpdateBlueprintRuleDto): Promise<BlueprintRule> {
    return this.apiClient.put<BlueprintRule>(`/${blueprintId}/rules/${ruleId}`, rule);
  }

  async deleteRule(blueprintId: string, ruleId: string): Promise<void> {
    return this.apiClient.delete<void>(`/${blueprintId}/rules/${ruleId}`);
  }

  async getRules(blueprintId: string): Promise<BlueprintRule[]> {
    return this.apiClient.get<BlueprintRule[]>(`/${blueprintId}/rules`);
  }

  // Advanced features
  async validateBlueprint(blueprintId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return this.apiClient.post<any>(`/${blueprintId}/validate`);
  }

  async previewQuestions(blueprintId: string): Promise<{
    questions: any[];
    totalQuestions: number;
    totalMarks: number;
    distribution: any;
  }> {
    return this.apiClient.get<any>(`/${blueprintId}/preview`);
  }

  async cloneBlueprint(blueprintId: string, newName: string): Promise<Blueprint> {
    return this.apiClient.post<Blueprint>(`/${blueprintId}/clone`, { name: newName });
  }

  async generatePaper(examId: string, blueprintId: string): Promise<{
    paperId: string;
    sections: any[];
    questions: any[];
  }> {
    return this.apiClient.post<any>(`/generate-paper`, { examId, blueprintId });
  }

  async getGeneratedPaper(paperId: string): Promise<any> {
    return this.apiClient.get<any>(`/papers/${paperId}`);
  }
}

export const blueprintService = new BlueprintService();
