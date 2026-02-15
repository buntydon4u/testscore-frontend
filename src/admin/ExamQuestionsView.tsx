import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/api';
import { ArrowLeft, Edit, Filter, Search, Trash2, X } from 'lucide-react';

type QuestionOption = {
  optionNumber: number;
  optionText: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  questionText: string;
  questionType: string;
  marks: number;
  negativeMarks?: number | null;
  difficultyLevel?: string | null;
  correctAnswer?: string | null;
  options?: QuestionOption[];
};

type SectionQuestion = {
  questionOrder: number;
  question: Question;
};

type ExamSection = {
  id: string;
  name: string;
  totalQuestions?: number;
  totalMarks?: number;
  _count?: { questions?: number; examQuestions?: number };
  questions?: SectionQuestion[];
  examQuestions?: SectionQuestion[];
};

const choiceTypes = new Set(['MCQ', 'MSQ', 'TRUE_FALSE']);
const questionTypeOptions = [
  'MCQ',
  'MSQ',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'FILL_BLANK',
  'MATCH_COLUMN',
  'NUMERIC',
];

export const ExamQuestionsView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sections, setSections] = useState<ExamSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | string>('ALL');
  const [showCorrect, setShowCorrect] = useState(true);
  const [editing, setEditing] = useState<{
    sectionId: string;
    question: Question;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editQuestionType, setEditQuestionType] = useState('MCQ');
  const [editMarks, setEditMarks] = useState(1);
  const [editNegativeMarks, setEditNegativeMarks] = useState<number | ''>('');
  const [editDifficulty, setEditDifficulty] = useState('MEDIUM');
  const [editCorrectAnswer, setEditCorrectAnswer] = useState('');
  const [editOptions, setEditOptions] = useState<QuestionOption[]>([]);

  const baseRoute = useMemo(() => {
    if (location.pathname.includes('/super-admin/')) return '/super-admin';
    if (location.pathname.includes('/teacher/')) return '/teacher';
    return '/admin';
  }, [location.pathname]);

  useEffect(() => {
    if (!id) return;
    fetchStructure();
  }, [id]);

  const fetchStructure = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.get<
        | ExamSection[]
        | { data?: ExamSection[] }
        | { sections?: ExamSection[] }
        | { data?: { sections?: ExamSection[] } }
      >(
        `/exams/${id}/structure`
      );
      const normalized = Array.isArray(res)
        ? res
        : res?.sections || res?.data?.sections || res?.data || [];
      setSections(Array.isArray(normalized) ? normalized : []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to load exam questions';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const questionTypes = useMemo(() => {
    const types = new Set<string>();
    sections.forEach((section) => {
      const sectionQuestions = section.questions || section.examQuestions || [];
      sectionQuestions.forEach((item) => {
        if (item.question?.questionType) {
          types.add(item.question.questionType);
        }
      });
    });
    return Array.from(types).sort();
  }, [sections]);

  const matchesFilters = (question: Question) => {
    const matchesType = filterType === 'ALL' || question.questionType === filterType;
    const matchesSearch =
      !searchTerm ||
      question.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  };

  const openEditModal = (sectionId: string, question: Question) => {
    const isChoiceType = choiceTypes.has(question.questionType || '');
    setEditing({ sectionId, question });
    setEditQuestionText(question.questionText || '');
    setEditQuestionType(question.questionType || 'MCQ');
    setEditMarks(question.marks || 1);
    setEditNegativeMarks(
      question.negativeMarks !== undefined && question.negativeMarks !== null
        ? question.negativeMarks
        : 0
    );
    setEditDifficulty(question.difficultyLevel || 'MEDIUM');
    setEditCorrectAnswer(question.correctAnswer || '');
    const mappedOptions =
      question.options && question.options.length > 0
        ? question.options.map((opt, index) => ({
            optionNumber: opt.optionNumber || index + 1,
            optionText: opt.optionText || '',
            isCorrect: !!opt.isCorrect,
          }))
        : [];
    setEditOptions(
      mappedOptions.length > 0
        ? mappedOptions
        : isChoiceType
          ? [
              { optionNumber: 1, optionText: '', isCorrect: false },
              { optionNumber: 2, optionText: '', isCorrect: false },
            ]
          : []
    );
  };

  const closeEditModal = () => {
    setEditing(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    setEditOptions((prev) =>
      prev.map((opt, idx) => (idx === index ? { ...opt, optionText: value } : opt))
    );
  };

  const handleToggleCorrect = (index: number) => {
    setEditOptions((prev) => {
      if (editQuestionType === 'MCQ' || editQuestionType === 'TRUE_FALSE') {
        return prev.map((opt, idx) => ({
          ...opt,
          isCorrect: idx === index,
        }));
      }
      return prev.map((opt, idx) =>
        idx === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
    });
  };

  const handleAddOption = () => {
    setEditOptions((prev) => [
      ...prev,
      { optionNumber: prev.length + 1, optionText: '', isCorrect: false },
    ]);
  };

  const handleSaveEdit = async () => {
    if (!editing || !id) return;
    try {
      setSaving(true);
      const payload: any = {
        questionText: editQuestionText,
        questionType: editQuestionType,
        marks: editMarks,
        difficultyLevel: editDifficulty,
      };
      if (editNegativeMarks !== '') payload.negativeMarks = editNegativeMarks;

      if (choiceTypes.has(editQuestionType)) {
        const normalizedOptions = editOptions
          .filter((opt) => opt.optionText.trim())
          .map((opt, index) => ({
            optionNumber: index + 1,
            optionText: opt.optionText.trim(),
            isCorrect: opt.isCorrect,
          }));
        payload.options = normalizedOptions;
      } else if (editCorrectAnswer.trim()) {
        payload.correctAnswer = editCorrectAnswer.trim();
      }

      await apiClient.put(`/questions/${editing.question.id}`, payload);
      await fetchStructure();
      closeEditModal();
    } catch (err: any) {
      setError(err.message || 'Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFromExam = async (sectionId: string, questionId: string) => {
    if (!id) return;
    const confirmed = window.confirm(
      'Remove this question from the exam? It will remain in the question bank.'
    );
    if (!confirmed) return;
    try {
      await apiClient.delete(
        `/exams/${id}/sections/${sectionId}/questions/${questionId}`
      );
      await fetchStructure();
    } catch (err: any) {
      setError(err.message || 'Failed to remove question from exam');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const confirmed = window.confirm(
      'Delete permanently affects all exams. Do you want to continue?'
    );
    if (!confirmed) return;
    try {
      await apiClient.delete(`/questions/${questionId}`);
      await fetchStructure();
    } catch (err: any) {
      setError(err.message || 'Failed to delete question');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${baseRoute}/exam/${id}/questions/add`)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Add Question
          </button>
          <button
            onClick={() => navigate(`${baseRoute}/exam/${id}`)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View Exam Details
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
            >
              <option value="ALL">All Types</option>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showCorrect}
              onChange={(e) => setShowCorrect(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
            Show correct answers
          </label>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No sections found for this exam.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionQuestions =
              section.questions || section.examQuestions || [];
            const sortedQuestions = [...sectionQuestions].sort(
              (a, b) => a.questionOrder - b.questionOrder
            );
            const filteredQuestions = sortedQuestions.filter((item) =>
              matchesFilters(item.question)
            );
            const totalQuestions =
              section.totalQuestions ??
              section._count?.questions ??
              section._count?.examQuestions ??
              sectionQuestions.length ??
              0;
            const totalMarks =
              section.totalMarks ??
              sectionQuestions.reduce(
                (sum, item) => sum + (item.question?.marks || 0),
                0
              ) ??
              0;

            return (
              <div key={section.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {totalQuestions} questions · {totalMarks} marks
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    Section ID: {section.id}
                  </span>
                </div>

                {filteredQuestions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No questions match the current filters.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredQuestions.map((item) => {
                      const { question } = item;
                      return (
                        <div
                          key={question.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Q{item.questionOrder}
                              </p>
                              <p className="text-base font-medium text-gray-900">
                                {question.questionText}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <div>{question.questionType}</div>
                              <div>{question.marks} marks</div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(section.id, question)}
                              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFromExam(section.id, question.id)
                              }
                              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                            >
                              <X className="w-4 h-4" />
                              Remove from exam
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete permanently
                            </button>
                            <span className="text-xs text-gray-500">
                              Delete permanently affects all exams.
                            </span>
                          </div>

                          {choiceTypes.has(question.questionType) &&
                            question.options &&
                            question.options.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {question.options.map((option) => (
                                  <div
                                    key={`${question.id}-${option.optionNumber}`}
                                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                                      showCorrect && option.isCorrect
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                        : 'border-gray-200 bg-white text-gray-700'
                                    }`}
                                  >
                                    <span>
                                      {option.optionNumber}. {option.optionText}
                                    </span>
                                    {showCorrect && option.isCorrect && (
                                      <span className="text-xs font-semibold">
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Question
              </h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={editQuestionType}
                  onChange={(e) => setEditQuestionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {questionTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  min={0}
                  value={editMarks}
                  onChange={(e) => setEditMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Negative Marks
                </label>
                <input
                  type="number"
                  min={0}
                  value={editNegativeMarks}
                  onChange={(e) =>
                    setEditNegativeMarks(
                      e.target.value ? Number(e.target.value) : ''
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            {choiceTypes.has(editQuestionType) ? (
              <div className="border border-gray-200 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Options</h4>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Add Option
                  </button>
                </div>
                <div className="space-y-3">
                  {editOptions.map((option, index) => (
                    <div key={option.optionNumber} className="flex items-center gap-3">
                      <input
                        type={editQuestionType === 'MSQ' ? 'checkbox' : 'radio'}
                        checked={option.isCorrect}
                        onChange={() => handleToggleCorrect(index)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={editCorrectAnswer}
                  onChange={(e) => setEditCorrectAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
