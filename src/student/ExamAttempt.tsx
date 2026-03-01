import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiClient } from '../services/api';

type AttemptSummary = {
  id: string;
  status: string;
  remainingTime?: number;
};

type AttemptQuestionOption = {
  id?: string;
  optionNumber: number;
  optionText: string;
  isCorrect?: boolean;
};

type AttemptQuestion = {
  id: string;
  questionText: string;
  questionType: string;
  marks: number;
  options?: AttemptQuestionOption[];
  questionOrder?: number;
  userAnswer?: any;
};

const choiceTypes = new Set(['MCQ', 'MSQ', 'TRUE_FALSE']);

const formatTime = (seconds: number) => {
  if (seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const ExamAttempt = () => {
  const { id: examIdParam } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const scheduleId = searchParams.get('scheduleId') || (location.state as any)?.scheduleId;
  const scheduleExamId = (location.state as any)?.scheduleExamId;
  const examId = examIdParam && examIdParam !== 'undefined' ? examIdParam : null;

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeAttempt, setActiveAttempt] = useState<AttemptSummary | null>(null);
  const [checkingActive, setCheckingActive] = useState(false);
  const [questions, setQuestions] = useState<AttemptQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [answerTimes, setAnswerTimes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [attemptStatus, setAttemptStatus] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState<{
    id: string;
    attemptId: string;
    totalMarks: number;
    marksSecured: number;
    percentage: number;
    grade?: string;
    correctCount?: number;
    wrongCount?: number;
    unansweredCount?: number;
  } | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreUnavailable, setScoreUnavailable] = useState(false);

  const questionStartRef = useRef<number>(Date.now());
  const timeTickRef = useRef<number | null>(null);
  const timeUpdateRef = useRef<number | null>(null);
  const statusPollRef = useRef<number | null>(null);

  const currentQuestion = questions[currentIndex];

  const totalQuestions = questions.length;
  const canStart = Boolean(examId && scheduleId);

  const demoQuestions: AttemptQuestion[] = [
    {
      id: 'demo-q1',
      questionType: 'MCQ',
      questionText: 'A car accelerates at 2 m/s². What is its speed after 5 seconds?',
      marks: 1,
      options: [
        { optionNumber: 1, optionText: '5 m/s' },
        { optionNumber: 2, optionText: '10 m/s' },
        { optionNumber: 3, optionText: '15 m/s' },
        { optionNumber: 4, optionText: '20 m/s' },
      ],
    },
    {
      id: 'demo-q2',
      questionType: 'MSQ',
      questionText: 'Which of the following are prime numbers?',
      marks: 2,
      options: [
        { optionNumber: 1, optionText: '2' },
        { optionNumber: 2, optionText: '4' },
        { optionNumber: 3, optionText: '5' },
        { optionNumber: 4, optionText: '9' },
      ],
    },
    {
      id: 'demo-q3',
      questionType: 'TRUE_FALSE',
      questionText: 'The Earth revolves around the Sun.',
      marks: 1,
      options: [
        { optionNumber: 1, optionText: 'True' },
        { optionNumber: 2, optionText: 'False' },
      ],
    },
    {
      id: 'demo-q4',
      questionType: 'SHORT_ANSWER',
      questionText: 'Define atomic number.',
      marks: 2,
    },
  ];

  const selectedAnswer = useMemo(() => {
    if (!currentQuestion) return undefined;
    return answers[currentQuestion.id];
  }, [answers, currentQuestion]);

  const stopTimers = () => {
    if (timeTickRef.current) window.clearInterval(timeTickRef.current);
    if (timeUpdateRef.current) window.clearInterval(timeUpdateRef.current);
    if (statusPollRef.current) window.clearInterval(statusPollRef.current);
  };

  useEffect(() => {
    if (!attemptId) return;
    if (timeTickRef.current) window.clearInterval(timeTickRef.current);
    if (timeUpdateRef.current) window.clearInterval(timeUpdateRef.current);

    timeTickRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timeUpdateRef.current = window.setInterval(() => {
      if (!attemptId) return;
      updateTime(10);
    }, 10000);

    return () => {
      if (timeTickRef.current) window.clearInterval(timeTickRef.current);
      if (timeUpdateRef.current) window.clearInterval(timeUpdateRef.current);
    };
  }, [attemptId]);

  useEffect(() => {
    if (!attemptId || isDemo) return;
    if (statusPollRef.current) window.clearInterval(statusPollRef.current);
    statusPollRef.current = window.setInterval(async () => {
      try {
        const res = await apiClient.get<{
          status: string;
          remainingTime?: number;
          timeSpent?: number;
        }>(`/attempts/${attemptId}/time`);
        if (res?.remainingTime !== undefined) {
          setTimeRemaining(res.remainingTime);
        }
        if (res?.timeSpent !== undefined) {
          setTimeSpent(res.timeSpent);
        }
        if (res?.status && ['SUBMITTED', 'AUTO_SUBMITTED'].includes(res.status)) {
          setAttemptStatus(res.status);
          setIsLocked(true);
          stopTimers();
        }
      } catch (err) {
        console.error('Failed to poll attempt time/status', err);
      }
    }, 15000);

    return () => {
      if (statusPollRef.current) window.clearInterval(statusPollRef.current);
    };
  }, [attemptId, isDemo]);

  useEffect(() => {
    if (timeRemaining === 0 && attemptId) {
      handleAutoSubmit();
    }
  }, [timeRemaining, attemptId]);

  useEffect(() => {
    if (!attemptId || isDemo) return;
    if (!attemptStatus || !['SUBMITTED', 'AUTO_SUBMITTED'].includes(attemptStatus)) {
      return;
    }
    const loadScore = async () => {
      try {
        setScoreLoading(true);
        setScoreUnavailable(false);
        const res = await apiClient.get<{
          id: string;
          attemptId: string;
          totalMarks: number;
          marksSecured: number;
          percentage: number;
          grade?: string;
          correctCount?: number;
          wrongCount?: number;
          unansweredCount?: number;
        }>(`/attempts/${attemptId}/score`);
        setScore(res);
      } catch (err: any) {
        if (err?.status === 404) {
          setScoreUnavailable(true);
        } else {
          console.error('Failed to load score', err);
        }
      } finally {
        setScoreLoading(false);
      }
    };
    loadScore();
  }, [attemptId, attemptStatus, isDemo]);

  useEffect(() => {
    if (!examId) return;
    loadActiveAttempt();
  }, [examId]);

  const loadActiveAttempt = async () => {
    if (!examId) return null;
    try {
      setCheckingActive(true);
      const fetchByStatus = async (status: string) => {
        const res = await apiClient.get<{ data: AttemptSummary[] }>(
          `/exam-attempts?examId=${examId}&status=${status}&limit=1`
        );
        return res?.data?.[0] || null;
      };

      const inProgress = await fetchByStatus('IN_PROGRESS');
      if (inProgress) {
        setActiveAttempt(inProgress);
        return inProgress;
      }
      const paused = await fetchByStatus('PAUSED');
      if (paused) {
        setActiveAttempt(paused);
        return paused;
      }
      const notStarted = await fetchByStatus('NOT_STARTED');
      const attempt = notStarted || null;
      setActiveAttempt(attempt);
      return attempt;
    } catch (error) {
      console.error('Failed to load active attempt', error);
      setActiveAttempt(null);
      return null;
    } finally {
      setCheckingActive(false);
    }
  };

  const updateTime = async (timeSpent: number) => {
    if (isDemo) return;
    try {
      await apiClient.post(`/attempts/${attemptId}/time/update`, { timeSpent });
    } catch (err) {
      console.error('Failed to update time', err);
    }
  };

  const fetchTimeRemaining = async (id: string) => {
    if (isDemo) return;
    try {
      const res = await apiClient.get<{ remainingTime: number; timeSpent?: number }>(
        `/attempts/${id}/time`
      );
      setTimeRemaining(res?.remainingTime ?? null);
      if (res?.timeSpent !== undefined) {
        setTimeSpent(res.timeSpent);
      }
    } catch (err) {
      console.error('Failed to fetch time', err);
    }
  };

  const fetchQuestions = async (id: string) => {
    if (isDemo) return;
    try {
      const res = await apiClient.get<AttemptQuestion[]>(`/attempts/${id}/questions`);
      const items = Array.isArray(res) ? res : [];
      const sorted = [...items].sort(
        (a, b) => (a.questionOrder || 0) - (b.questionOrder || 0)
      );
      setQuestions(sorted);
      setCurrentIndex(0);
      const initialAnswers = sorted.reduce<Record<string, any>>((acc, q) => {
        if (q.userAnswer !== undefined && q.userAnswer !== null) {
          acc[q.id] = q.userAnswer;
        }
        return acc;
      }, {});
      setAnswers(initialAnswers);
      setAnswerTimes({});
    } catch (err) {
      setError('Failed to load questions');
    }
  };

  const handleStart = async () => {
    if (!examId) {
      toast.error('Exam not found. Please reload and select an exam.');
      return;
    }
    if (!scheduleId) {
      toast.error('Please select an exam schedule');
      return;
    }
    if (scheduleExamId && scheduleExamId !== examId) {
      toast.error('Selected schedule does not match this exam.');
      return;
    }
    if (activeAttempt) {
      toast.error('You already have an active attempt. Please resume it.');
      return;
    }

    try {
      setStarting(true);
      setError('');
      setLoading(true);
      const payload = { scheduleId };
      let attempt: AttemptSummary | null = null;
      try {
        attempt = await apiClient.post<AttemptSummary>(
          `/exams/${examId}/attempts`,
          payload as Record<string, unknown>
        );
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          '';
        if (message.toLowerCase().includes('active attempt')) {
          const existing = await loadActiveAttempt();
          if (existing) {
            toast.success('Active attempt found. Please resume.');
            return;
          }
        }
        if (message.toLowerCase().includes('exam not found')) {
          toast.error('Exam not found. Please refresh or choose another exam.');
          return;
        }
        throw err;
      }
      if (!attempt?.id) {
        throw new Error('Attempt not created');
      }
      setAttemptId(attempt.id);
      setAttemptStatus(attempt.status || 'IN_PROGRESS');
      setIsLocked(false);
      setScore(null);
      setScoreUnavailable(false);
      if (attempt.remainingTime !== undefined) {
        setTimeRemaining(attempt.remainingTime);
      }
      await Promise.all([fetchQuestions(attempt.id), fetchTimeRemaining(attempt.id)]);
      questionStartRef.current = Date.now();
    } catch (err: any) {
      setError(err.message || 'Failed to start exam');
      toast.error(err.message || 'Failed to start exam');
    } finally {
      setStarting(false);
      setLoading(false);
    }
  };

  const handleResume = async () => {
    if (!activeAttempt?.id) return;
    try {
      setStarting(true);
      setError('');
      setLoading(true);
      const resumed = await apiClient.post<AttemptSummary>(
        `/attempts/${activeAttempt.id}/resume`,
        {}
      );
      setAttemptId(activeAttempt.id);
      setAttemptStatus(resumed?.status || 'IN_PROGRESS');
      setIsLocked(false);
      setScore(null);
      setScoreUnavailable(false);
      if (resumed?.remainingTime !== undefined) {
        setTimeRemaining(resumed.remainingTime);
      }
      await Promise.all([
        fetchQuestions(activeAttempt.id),
        fetchTimeRemaining(activeAttempt.id),
      ]);
      questionStartRef.current = Date.now();
    } catch (err: any) {
      setError(err.message || 'Failed to resume attempt');
      toast.error(err.message || 'Failed to resume attempt');
    } finally {
      setStarting(false);
      setLoading(false);
    }
  };

  const handleDemoStart = () => {
    setIsDemo(true);
    setAttemptId('demo');
    setQuestions(demoQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setTimeRemaining(600);
    setTimeSpent(0);
    setAttemptStatus('IN_PROGRESS');
    setIsLocked(false);
    questionStartRef.current = Date.now();
  };

  const saveAnswer = async (questionId: string, answer: any, timeTaken: number) => {
    if (isDemo) return;
    if (isLocked) return;
    if (!attemptId) return;
    try {
      setSaving(true);
      setAnswerTimes((prev) => ({ ...prev, [questionId]: timeTaken }));
      await apiClient.post(`/attempts/${attemptId}/questions/${questionId}/answer`, {
        answer,
        timeTaken,
      });
    } catch (err) {
      console.error('Failed to save answer', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (isLocked) return;
    if (!currentQuestion) return;
    const timeTaken = Math.floor((Date.now() - questionStartRef.current) / 1000);
    await saveAnswer(currentQuestion.id, answers[currentQuestion.id], timeTaken);
    questionStartRef.current = Date.now();
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handlePrevious = () => {
    questionStartRef.current = Date.now();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleAutoSubmit = async () => {
    if (!attemptId) return;
    if (isDemo) {
      toast.success('Demo completed');
      setAttemptId(null);
      setIsDemo(false);
      setQuestions([]);
      setCurrentIndex(0);
      setAnswers({});
      setTimeRemaining(null);
      setTimeSpent(null);
      setAttemptStatus(null);
      setIsLocked(false);
      return;
    }
    try {
      if (currentQuestion) {
        const timeTaken = Math.floor((Date.now() - questionStartRef.current) / 1000);
        await saveAnswer(currentQuestion.id, answers[currentQuestion.id], timeTaken);
      }
      const answersPayload = Object.entries(answers).map(([questionId, userAnswer]) => {
        const fallbackTime =
          currentQuestion && currentQuestion.id === questionId
            ? Math.floor((Date.now() - questionStartRef.current) / 1000)
            : 0;
        return {
          questionId,
          userAnswer,
          timeTaken: answerTimes[questionId] || fallbackTime,
        };
      });
      await apiClient.post(`/attempts/${attemptId}/submit`, {
        answers: answersPayload,
      });
      setAttemptStatus('SUBMITTED');
      setIsLocked(true);
      stopTimers();
      try {
        const statusRes = await apiClient.get<{ timeSpent?: number }>(
          `/attempts/${attemptId}/status`
        );
        if (statusRes?.timeSpent !== undefined) {
          setTimeSpent(statusRes.timeSpent);
        }
      } catch (statusError) {
        console.error('Failed to refresh status after submit', statusError);
      }

      setScoreLoading(true);
      setScoreUnavailable(false);
      try {
        const scoreRes = await apiClient.get<{
          id: string;
          attemptId: string;
          totalMarks: number;
          marksSecured: number;
          percentage: number;
          grade?: string;
          correctCount?: number;
          wrongCount?: number;
          unansweredCount?: number;
        }>(`/attempts/${attemptId}/score`);
        setScore(scoreRes);
      } catch (scoreErr) {
        setTimeout(async () => {
          try {
            const retryRes = await apiClient.get<{
              id: string;
              attemptId: string;
              totalMarks: number;
              marksSecured: number;
              percentage: number;
              grade?: string;
              correctCount?: number;
              wrongCount?: number;
              unansweredCount?: number;
            }>(`/attempts/${attemptId}/score`);
            setScore(retryRes);
          } catch (retryErr: any) {
            if (retryErr?.status === 404) {
              setScoreUnavailable(true);
            } else {
              console.error('Failed to fetch score after retry', retryErr);
            }
          } finally {
            setScoreLoading(false);
          }
        }, 1500);
        return;
      } finally {
        setScoreLoading(false);
      }
      toast.success('Exam submitted');
    } catch (err) {
      console.error('Failed to submit attempt', err);
    }
  };

  const handleSubmit = async () => {
    await handleAutoSubmit();
  };

  const updateAnswer = (value: any) => {
    if (isLocked) return;
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const toggleMultiAnswer = (optionValue: any) => {
    if (isLocked) return;
    if (!currentQuestion) return;
    const existing = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    if (existing.includes(optionValue)) {
      updateAnswer(existing.filter((v: any) => v !== optionValue));
    } else {
      updateAnswer([...existing, optionValue]);
    }
  };

  if (!attemptId) {
    if (!examId) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Start Exam</h1>
          <p className="text-gray-600 mb-6">
            Exam not found. Please reload and select an exam.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Start Exam</h1>
        <p className="text-gray-600 mb-6">
          You will see one question at a time with a timer.
        </p>
        {!scheduleId && !activeAttempt && (
          <p className="text-sm text-amber-600 mb-4">Select schedule to continue.</p>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="flex flex-wrap gap-3">
          {checkingActive ? (
            <p className="text-sm text-gray-500">Checking active attempts...</p>
          ) : activeAttempt ? (
            <button
              onClick={handleResume}
              disabled={starting}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {starting ? 'Resuming...' : 'Resume Attempt'}
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={starting || !canStart}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {starting ? 'Starting...' : 'Start Exam'}
            </button>
          )}
          <button
            type="button"
            onClick={handleDemoStart}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Try Demo
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No questions available.</p>
      </div>
    );
  }

  const answeredCount = questions.reduce((count, question) => {
    const localValue =
      answers[question.id] !== undefined ? answers[question.id] : question.userAnswer;
    if (Array.isArray(localValue)) {
      return localValue.length > 0 ? count + 1 : count;
    }
    if (typeof localValue === 'string') {
      return localValue.trim().length > 0 ? count + 1 : count;
    }
    if (localValue !== undefined && localValue !== null) {
      return count + 1;
    }
    return count;
  }, 0);

  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const submitted = attemptStatus === 'SUBMITTED' || attemptStatus === 'AUTO_SUBMITTED';

  return (
    <div className="space-y-6">
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3">
          Attempt submitted. Answers are locked.
        </div>
      )}
      {submitted && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Submission Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-lg font-semibold text-gray-900">
                {scoreLoading
                  ? 'Loading...'
                  : scoreUnavailable
                    ? 'Score not available yet'
                    : score
                      ? `${score.marksSecured} / ${score.totalMarks}`
                      : 'Pending'}
              </p>
              {score && (
                <p className="text-xs text-gray-500 mt-1">
                  {score.percentage}% {score.grade ? `• Grade ${score.grade}` : ''}
                </p>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Answered</p>
              <p className="text-lg font-semibold text-gray-900">
                {answeredCount} / {totalQuestions}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Time Spent</p>
              <p className="text-lg font-semibold text-gray-900">
                {timeSpent !== null ? formatTime(timeSpent) : '--:--'}
              </p>
            </div>
          </div>
          {score && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Correct</p>
                <p className="text-lg font-semibold text-gray-900">
                  {score.correctCount ?? '-'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Wrong</p>
                <p className="text-lg font-semibold text-gray-900">
                  {score.wrongCount ?? '-'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Unanswered</p>
                <p className="text-lg font-semibold text-gray-900">
                  {score.unansweredCount ?? '-'}
                </p>
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/student/exam-history')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Go to Exam History
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Question</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentIndex + 1} / {totalQuestions}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedAnswer !== undefined &&
              selectedAnswer !== null &&
              (Array.isArray(selectedAnswer)
                ? selectedAnswer.length > 0
                : typeof selectedAnswer === 'string'
                  ? selectedAnswer.trim().length > 0
                  : true)
                ? 'Answered'
                : 'Not answered'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Time Remaining</p>
            <p className="text-lg font-semibold text-gray-900">
              {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              Answered {answeredCount} / {totalQuestions}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">{currentQuestion.questionType}</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentQuestion.questionText}
          </h2>
        </div>

        {choiceTypes.has(currentQuestion.questionType) && currentQuestion.options ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option: any, index: number) => {
              const value = option.optionNumber ?? index + 1;
              if (currentQuestion.questionType === 'MSQ') {
                const selectedValues = Array.isArray(selectedAnswer)
                  ? selectedAnswer
                  : [];
                return (
                  <label
                    key={value}
                    className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      disabled={isLocked}
                      checked={selectedValues.includes(value)}
                      onChange={() => toggleMultiAnswer(value)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{option.optionText}</span>
                  </label>
                );
              }

              return (
                <label
                  key={value}
                  className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    disabled={isLocked}
                    checked={selectedAnswer === value}
                    onChange={() => updateAnswer(value)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{option.optionText}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <textarea
            value={selectedAnswer || ''}
            onChange={(e) => updateAnswer(e.target.value)}
            rows={4}
            disabled={isLocked}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Type your answer..."
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLocked}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Submit Exam
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving || currentIndex === totalQuestions - 1 || isLocked}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
