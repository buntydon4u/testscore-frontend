import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../services/api';

type Topic = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
  topics?: Topic[];
};

type QuestionBank = {
  id: string;
  name: string;
};

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
  options?: QuestionOption[];
};

type SectionQuestion = {
  questionOrder: number;
  question: Question;
};

type ExamSection = {
  id: string;
  name: string;
  totalMarks?: number;
  _count?: { examQuestions?: number; questions?: number };
  examQuestions?: SectionQuestion[];
  questions?: SectionQuestion[];
};

type ExamStructureResponse =
  | ExamSection[]
  | { sections?: ExamSection[] }
  | { data?: ExamSection[] }
  | { data?: { sections?: ExamSection[] } };

const questionTypes = [
  'MCQ',
  'MSQ',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'FILL_BLANK',
  'MATCH_COLUMN',
  'NUMERIC',
];

const choiceTypes = new Set(['MCQ', 'MSQ', 'TRUE_FALSE']);

const normalizeSections = (res: ExamStructureResponse): ExamSection[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.sections)) return res.sections;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.sections)) return res.data.sections;
  return [];
};

const attachTopicsToSubjects = (
  subjects: Subject[],
  topics: any[] | undefined
): Subject[] => {
  if (!Array.isArray(subjects)) return [];
  if (!Array.isArray(topics) || topics.length === 0) return subjects;
  const topicsBySubject = topics.reduce<Record<string, Topic[]>>((acc, topic) => {
    const subjectKey = topic.subjectId || topic.subject_id || topic.subject?.id || topic.subject;
    if (!subjectKey) return acc;
    const entry: Topic = { id: topic.id, name: topic.name };
    if (!acc[subjectKey]) acc[subjectKey] = [];
    acc[subjectKey].push(entry);
    return acc;
  }, {});
  return subjects.map((subject) => ({
    ...subject,
    topics: subject.topics?.length
      ? subject.topics
      : topicsBySubject[subject.id] ||
        topicsBySubject[subject.name] ||
        [],
  }));
};

const normalizeSubjects = (res: any): Subject[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.subjects)) return res.subjects;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.subjects)) return res.data.subjects;
  return [];
};

const extractTopics = (res: any): any[] => {
  if (Array.isArray(res?.topics)) return res.topics;
  if (Array.isArray(res?.data?.topics)) return res.data.topics;
  return [];
};

const normalizeBanks = (res: any): QuestionBank[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

export const ExamQuestionManualAdd = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'COMBINED' | 'SUBJECT_WISE'>('COMBINED');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [sections, setSections] = useState<ExamSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState<number | ''>('');
  const [difficultyLevel, setDifficultyLevel] = useState('MEDIUM');
  const [tags, setTags] = useState('');
  const [questionBankId, setQuestionBankId] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState<QuestionOption[]>([
    { optionNumber: 1, optionText: '', isCorrect: false },
    { optionNumber: 2, optionText: '', isCorrect: false },
  ]);

  const baseRoute = useMemo(() => {
    if (location.pathname.includes('/super-admin/')) return '/super-admin';
    if (location.pathname.includes('/teacher/')) return '/teacher';
    return '/admin';
  }, [location.pathname]);

  useEffect(() => {
    if (!id) return;
    const loadInitial = async () => {
      try {
        setLoading(true);
        const [taxonomyRes, banksRes, structureRes] = await Promise.all([
          apiClient.get('/taxonomy/view'),
          apiClient.get('/question-banks'),
          apiClient.get<ExamStructureResponse>(`/exams/${id}/structure`),
        ]);
        const subjectsData = normalizeSubjects(taxonomyRes);
        const topicsData = extractTopics(taxonomyRes);
        setSubjects(attachTopicsToSubjects(subjectsData, topicsData));
        setQuestionBanks(normalizeBanks(banksRes));
        setSections(normalizeSections(structureRes));
      } catch (error: any) {
        toast.error(error.message || 'Failed to load exam data');
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [id]);

  const selectedSubject = useMemo(
    () => subjects.find((subj) => subj.id === subjectId),
    [subjects, subjectId]
  );

  const topics = selectedSubject?.topics || [];

  const sectionQuestions = (section: ExamSection) =>
    section.examQuestions || section.questions || [];

  const getTargetSection = async () => {
    if (!id) return null;
    if (mode === 'COMBINED') {
      const existing =
        sections.find((sec) => sec.name === 'Combined Paper') || sections[0];
      if (existing) return existing;
      const created = await apiClient.post<ExamSection>(
        `/exams/${id}/sections`,
        { name: 'Combined Paper' }
      );
      setSections((prev) => [...prev, created]);
      return created;
    }

    if (!selectedSubject) {
      throw new Error('Please select a subject');
    }

    const existing = sections.find((sec) => sec.name === selectedSubject.name);
    if (existing) return existing;
    const created = await apiClient.post<ExamSection>(
      `/exams/${id}/sections`,
      { name: selectedSubject.name }
    );
    setSections((prev) => [...prev, created]);
    return created;
  };

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        optionNumber: prev.length + 1,
        optionText: '',
        isCorrect: false,
      },
    ]);
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt, idx) =>
        idx === index ? { ...opt, optionText: value } : opt
      )
    );
  };

  const handleToggleCorrect = (index: number) => {
    setOptions((prev) => {
      if (questionType === 'MCQ' || questionType === 'TRUE_FALSE') {
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

  const handleCreateSection = async () => {
    try {
      if (!id) return;
      if (!selectedSubject) {
        toast.error('Select a subject first');
        return;
      }
      const existing = sections.find((sec) => sec.name === selectedSubject.name);
      if (existing) {
        toast.success('Section already exists for this subject');
        return;
      }
      const created = await apiClient.post<ExamSection>(
        `/exams/${id}/sections`,
        { name: selectedSubject.name }
      );
      setSections((prev) => [...prev, created]);
      toast.success('Subject section created');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create section');
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    if (!questionText.trim()) {
      toast.error('Question text is required');
      return;
    }
    if (!topicId) {
      toast.error('Topic is required');
      return;
    }
    if (!questionBankId) {
      toast.error('Question bank is required');
      return;
    }
    if (!marks || marks <= 0) {
      toast.error('Marks must be greater than 0');
      return;
    }
    if (choiceTypes.has(questionType)) {
      const validOptions = options.filter((opt) => opt.optionText.trim());
      if (validOptions.length < 2) {
        toast.error('Please provide at least two options');
        return;
      }
      if (!validOptions.some((opt) => opt.isCorrect)) {
        toast.error('Please mark at least one correct option');
        return;
      }
    }

    try {
      setSaving(true);
      const targetSection = await getTargetSection();
      if (!targetSection) return;

      const payload: any = {
        questionBankId,
        topicId,
        questionType,
        questionText,
        marks,
        difficultyLevel,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (negativeMarks !== '') payload.negativeMarks = Number(negativeMarks);

      if (choiceTypes.has(questionType)) {
        payload.options = options
          .filter((opt) => opt.optionText.trim())
          .map((opt, index) => ({
            optionNumber: index + 1,
            optionText: opt.optionText.trim(),
            isCorrect: opt.isCorrect,
          }));
      } else if (correctAnswer.trim()) {
        payload.correctAnswer = correctAnswer.trim();
      }

      const createdQuestion: any = await apiClient.post('/questions', payload);
      const questionId = createdQuestion?.id || createdQuestion?.data?.id;

      if (!questionId) {
        throw new Error('Question created but ID not returned');
      }

      const existingOrders = sectionQuestions(targetSection).map(
        (q) => q.questionOrder
      );
      const nextOrder =
        existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1;

      await apiClient.post(
        `/exams/${id}/sections/${targetSection.id}/questions`,
        {
          questions: [{ questionId, questionOrder: nextOrder }],
        }
      );

      const structureRes = await apiClient.get<ExamStructureResponse>(
        `/exams/${id}/structure`
      );
      setSections(normalizeSections(structureRes));

      toast.success('Question created and assigned');
      setQuestionText('');
      setCorrectAnswer('');
      setOptions([
        { optionNumber: 1, optionText: '', isCorrect: false },
        { optionNumber: 2, optionText: '', isCorrect: false },
      ]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create question');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => navigate(`${baseRoute}/exam/${id}/questions`)}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          View Exam Questions
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Manual Question Add
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="mode"
              value="COMBINED"
              checked={mode === 'COMBINED'}
              onChange={() => setMode('COMBINED')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            Combined
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="mode"
              value="SUBJECT_WISE"
              checked={mode === 'SUBJECT_WISE'}
              onChange={() => setMode('SUBJECT_WISE')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            Subject-wise
          </label>
        </div>

        {mode === 'SUBJECT_WISE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setTopicId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleCreateSection}
                className="flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50"
              >
                <Plus className="w-4 h-4" />
                Create Subject Section
              </button>
            </div>
          </div>
        )}

        {mode === 'COMBINED' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select Topic</option>
                {subjects
                  .flatMap((subj) => subj.topics || [])
                  .map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Bank
            </label>
            <select
              value={questionBankId}
              onChange={(e) => setQuestionBankId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select Question Bank</option>
              {questionBanks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marks
            </label>
            <input
              type="number"
              min={0}
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Negative Marks (optional)
            </label>
            <input
              type="number"
              min={0}
              value={negativeMarks}
              onChange={(e) =>
                setNegativeMarks(e.target.value ? Number(e.target.value) : '')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="mechanics, formulas"
            />
          </div>
        </div>

        {choiceTypes.has(questionType) ? (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Options</h3>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Add Option
              </button>
            </div>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.optionNumber} className="flex items-center gap-3">
                  <input
                    type={questionType === 'MSQ' ? 'checkbox' : 'radio'}
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer (optional)
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Create Question'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Existing Exam Questions
        </h3>
        {sections.length === 0 ? (
          <p className="text-sm text-gray-500">No sections found.</p>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => {
              const sectionItems = sectionQuestions(section);
              return (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{section.name}</h4>
                    <span className="text-xs text-gray-500">
                      {sectionItems.length} questions
                    </span>
                  </div>
                  {sectionItems.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No questions mapped yet.
                    </p>
                  ) : (
                    <ul className="text-sm text-gray-700 space-y-1">
                      {sectionItems.map((item) => (
                        <li key={item.question.id}>
                          {item.questionOrder}. {item.question.questionText}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
