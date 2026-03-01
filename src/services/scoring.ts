import { ApiClient } from './api';

export interface Score {
  id: string;
  examAttemptId: string;
  userId: string;
  examId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade?: string;
  passed: boolean;
  sectionScores?: SectionScore[];
  topicScores?: TopicScore[];
  evaluatedAt: string;
  createdAt: string;
}

export interface SectionScore {
  id: string;
  scoreId: string;
  sectionId: string;
  sectionName: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
}

export interface TopicScore {
  id: string;
  scoreId: string;
  topicId: string;
  topicName: string;
  score: number;
  maxScore: number;
  percentage: number;
  questionCount: number;
  correctAnswers: number;
}

export interface EvaluationRequest {
  attemptId: string;
  autoEvaluate?: boolean;
  manualEvaluate?: boolean;
}

export interface DetailedResult {
  attempt: {
    id: string;
    exam: {
      id: string;
      title: string;
      totalMarks: number;
    };
    user: {
      id: string;
      username: string;
    };
    startedAt: string;
    submittedAt: string;
    timeTaken: number;
  };
  score: Score;
  sectionScores: SectionScore[];
  topicScores: TopicScore[];
  questionWise: {
    questionId: string;
    questionText: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    marks: number;
    maxMarks: number;
    timeSpent: number;
  }[];
}

class ScoringService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('/api/scoring');
  }

  async evaluateAttempt(request: EvaluationRequest): Promise<Score> {
    return this.apiClient.post<Score>('/evaluate', request);
  }

  async getScore(attemptId: string): Promise<Score> {
    return this.apiClient.get<Score>(`/${attemptId}/score`);
  }

  async getResults(attemptId: string): Promise<DetailedResult> {
    return this.apiClient.get<DetailedResult>(`/${attemptId}/results`);
  }

  async getSectionScores(attemptId: string): Promise<SectionScore[]> {
    return this.apiClient.get<SectionScore[]>(`/${attemptId}/section-scores`);
  }

  async getTopicScores(attemptId: string): Promise<TopicScore[]> {
    return this.apiClient.get<TopicScore[]>(`/${attemptId}/topic-scores`);
  }

  async getUserScores(userId: string, params?: {
    examId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Score[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.examId) queryParams.append('examId', params.examId);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const url = queryParams.toString() ? `/user/${userId}?${queryParams.toString()}` : `/user/${userId}`;
    return this.apiClient.get<Score[]>(url);
  }

  async getMyScores(): Promise<Score[]> {
    return this.apiClient.get<Score[]>('/me');
  }

  async getExamScores(examId: string, params?: {
    section?: string;
    groupBy?: 'user' | 'section' | 'topic';
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.section) queryParams.append('section', params.section);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);

    const url = queryParams.toString() ? `/exam/${examId}?${queryParams.toString()}` : `/exam/${examId}`;
    return this.apiClient.get<any[]>(url);
  }

  async getScoreStatistics(examId?: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    passPercentage: number;
    scoreDistribution: {
      range: string;
      count: number;
    }[];
  }> {
    const url = examId ? `/statistics?examId=${examId}` : '/statistics';
    return this.apiClient.get<any>(url);
  }

  async generateScoreReport(attemptId: string, format: 'PDF' | 'EXCEL' = 'PDF'): Promise<Blob> {
    return this.apiClient.get<Blob>(`/${attemptId}/report?format=${format}`, {
      responseType: 'blob'
    });
  }

  async reevaluateAttempt(attemptId: string): Promise<Score> {
    return this.apiClient.post<Score>(`/${attemptId}/reevaluate`);
  }

  async updateManualScore(
    attemptId: string,
    questionId: string,
    marks: number,
    feedback?: string
  ): Promise<void> {
    return this.apiClient.put<void>(`/${attemptId}/manual-score`, {
      questionId,
      marks,
      feedback
    });
  }
}

export const scoringService = new ScoringService();
