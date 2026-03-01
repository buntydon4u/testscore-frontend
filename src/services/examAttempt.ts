import { ApiClient } from './api';

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'SUBMITTED' | 'EVALUATED' | 'ABANDONED';
  startedAt?: string;
  submittedAt?: string;
  timeRemaining?: number;
  totalScore?: number;
  maxScore: number;
  percentage?: number;
  sectionAttempts?: SectionAttempt[];
  createdAt: string;
  updatedAt: string;
}

export interface SectionAttempt {
  id: string;
  examAttemptId: string;
  sectionId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
  startedAt?: string;
  submittedAt?: string;
  timeRemaining?: number;
  score?: number;
  maxScore: number;
  questionAnswers?: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: string;
  sectionAttemptId: string;
  questionId: string;
  answer?: any;
  isCorrect?: boolean;
  marks?: number;
  maxMarks: number;
  timeSpent?: number;
  attemptedAt?: string;
  reviewed?: boolean;
}

export interface CreateAttemptDto {
  examId: string;
}

export interface AnswerDto {
  questionId: string;
  answer: any;
  timeSpent?: number;
}

export interface SubmitAnswerDto {
  questionId: string;
  answer: any;
  timeSpent?: number;
  isMarkedForReview?: boolean;
}

export interface AttemptSearchParams {
  page?: number;
  limit?: number;
  examId?: string;
  userId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AttemptListResponse {
  data: ExamAttempt[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QuestionForAttempt {
  id: string;
  type: string;
  questionText: string;
  explanation?: string;
  marks: number;
  timeLimit?: number;
  options?: any[];
  passage?: {
    id: string;
    title: string;
    content: string;
  };
  mediaAssets?: any[];
  previousAnswer?: any;
  isAnswered?: boolean;
  isMarkedForReview?: boolean;
}

class ExamAttemptService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/exam-attempts');
  }

  async startAttempt(examId: string, scheduleId?: string): Promise<ExamAttempt> {
    return this.apiClient.post<ExamAttempt>('', {
      examId,
      ...(scheduleId ? { scheduleId } : {}),
    });
  }

  async getAttempt(id: string): Promise<ExamAttempt> {
    return this.apiClient.get<ExamAttempt>(`/${id}`);
  }

  async resumeAttempt(id: string): Promise<ExamAttempt> {
    return this.apiClient.post<ExamAttempt>(`/${id}/resume`);
  }

  async submitAttempt(id: string): Promise<ExamAttempt> {
    return this.apiClient.post<ExamAttempt>(`/${id}/submit`);
  }

  async submitSection(attemptId: string, sectionId: string): Promise<void> {
    return this.apiClient.post<void>(`/${attemptId}/sections/${sectionId}/submit`);
  }

  async getSections(attemptId: string): Promise<SectionAttempt[]> {
    return this.apiClient.get<SectionAttempt[]>(`/${attemptId}/sections`);
  }

  async startSection(attemptId: string, sectionId: string): Promise<SectionAttempt> {
    return this.apiClient.post<SectionAttempt>(`/${attemptId}/sections/${sectionId}/start`);
  }

  async getQuestions(attemptId: string, sectionId?: string): Promise<QuestionForAttempt[]> {
    const url = sectionId ? `/${attemptId}/questions?sectionId=${sectionId}` : `/${attemptId}/questions`;
    return this.apiClient.get<QuestionForAttempt[]>(url);
  }

  async saveAnswer(attemptId: string, questionId: string, answer: any): Promise<void> {
    return this.apiClient.post<void>(`/${attemptId}/questions/${questionId}/answer`, { answer });
  }

  async updateAnswer(attemptId: string, questionId: string, answer: any): Promise<void> {
    return this.apiClient.put<void>(`/${attemptId}/questions/${questionId}/answer`, { answer });
  }

  async getAnswers(attemptId: string): Promise<QuestionAnswer[]> {
    return this.apiClient.get<QuestionAnswer[]>(`/${attemptId}/answers`);
  }

  async submitAllAnswers(attemptId: string, answers: SubmitAnswerDto[]): Promise<void> {
    return this.apiClient.post<void>(`/${attemptId}/submit-all`, { answers });
  }

  async getTimeRemaining(attemptId: string): Promise<{ timeRemaining: number }> {
    return this.apiClient.get<{ timeRemaining: number }>(`/${attemptId}/time`);
  }

  async updateTime(attemptId: string, timeSpent: number): Promise<void> {
    return this.apiClient.post<void>(`/${attemptId}/time/update`, { timeSpent });
  }

  async pauseAttempt(id: string): Promise<ExamAttempt> {
    return this.apiClient.post<ExamAttempt>(`/${id}/pause`);
  }

  async list(params?: AttemptSearchParams): Promise<AttemptListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.examId) queryParams.append('examId', params.examId);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const url = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.apiClient.get<AttemptListResponse>(url);
  }

  async getUserAttempts(userId: string, params?: Omit<AttemptSearchParams, 'userId'>): Promise<AttemptListResponse> {
    return this.list({ ...params, userId });
  }

  async getExamResults(examId: string): Promise<any[]> {
    return this.apiClient.get<any[]>(`/exam/${examId}/results`);
  }
}

export const examAttemptService = new ExamAttemptService();
