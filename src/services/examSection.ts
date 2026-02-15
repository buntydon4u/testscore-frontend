import { ApiClient } from './api';

export interface ExamSection {
  id: string;
  examId: string;
  name: string;
  description?: string;
  instructions?: string;
  order: number;
  timeLimit?: number;
  isMandatory: boolean;
  passMarks?: number;
  totalQuestions: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  examSectionId: string;
  questionId: string;
  order: number;
  marks: number;
  isOptional: boolean;
  question?: {
    id: string;
    type: string;
    questionText: string;
    difficulty: string;
    marks: number;
    options?: any[];
  };
}

export interface CreateSectionDto {
  name: string;
  description?: string;
  instructions?: string;
  order: number;
  timeLimit?: number;
  isMandatory: boolean;
  passMarks?: number;
}

export interface UpdateSectionDto {
  name?: string;
  description?: string;
  instructions?: string;
  order?: number;
  timeLimit?: number;
  isMandatory?: boolean;
  passMarks?: number;
}

export interface AssignQuestionDto {
  questionId: string;
  order: number;
  marks: number;
  isOptional: boolean;
}

export interface UpdateQuestionAssignmentDto {
  order?: number;
  marks?: number;
  isOptional?: boolean;
}

class ExamSectionService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/exam-sections');
  }

  async list(examId: string): Promise<ExamSection[]> {
    return this.apiClient.get<ExamSection[]>(`/exam/${examId}`);
  }

  async getById(id: string): Promise<ExamSection> {
    return this.apiClient.get<ExamSection>(`/${id}`);
  }

  async create(examId: string, data: CreateSectionDto): Promise<ExamSection> {
    return this.apiClient.post<ExamSection>(`/exam/${examId}`, data);
  }

  async update(id: string, data: UpdateSectionDto): Promise<ExamSection> {
    return this.apiClient.put<ExamSection>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete<void>(`/${id}`);
  }

  // Question assignment
  async assignQuestions(sectionId: string, questions: AssignQuestionDto[]): Promise<void> {
    return this.apiClient.post<void>(`/${sectionId}/questions`, { questions });
  }

  async updateQuestionAssignment(
    sectionId: string, 
    questionId: string, 
    data: UpdateQuestionAssignmentDto
  ): Promise<void> {
    return this.apiClient.put<void>(`/${sectionId}/questions/${questionId}`, data);
  }

  async removeQuestion(sectionId: string, questionId: string): Promise<void> {
    return this.apiClient.delete<void>(`/${sectionId}/questions/${questionId}`);
  }

  async getQuestions(sectionId: string): Promise<ExamQuestion[]> {
    return this.apiClient.get<ExamQuestion[]>(`/${sectionId}/questions`);
  }

  // Bulk operations
  async reorderSections(examId: string, sectionIds: string[]): Promise<void> {
    return this.apiClient.put<void>(`/exam/${examId}/reorder`, { sectionIds });
  }

  async reorderQuestions(sectionId: string, questionIds: string[]): Promise<void> {
    return this.apiClient.put<void>(`/${sectionId}/reorder`, { questionIds });
  }
}

export const examSectionService = new ExamSectionService();
