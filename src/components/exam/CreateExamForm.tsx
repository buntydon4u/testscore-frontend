import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { examService } from '../../services/exam';
import { subjectService, Subject } from '../../services/subjectApi';
import { ExamType, DeliveryType, CreateExamDto } from '../../types/exam';

interface CreateExamFormProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
  isEdit?: boolean;
  loading?: boolean;
}

export const CreateExamForm = ({ initialData, onSubmit, isEdit = false, loading: externalLoading }: CreateExamFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin/') || location.pathname.includes('/super-admin/');
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;
  const [boards, setBoards] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [formData, setFormData] = useState<CreateExamDto>({
    title: '',
    description: '',
    examType: ExamType.PRACTICE,
    deliveryType: DeliveryType.ONLINE,
    duration: 60,
    totalMarks: 100,
    isNegativeMarking: false,
    negativeMarkingValue: 0,
    isPracticeMode: false,
    classId: null,
    boardId: null,
    seriesId: null,
    blueprintId: null,
    subjectIds: [],
  });

  useEffect(() => {
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (formData.boardId) {
      loadSeries(formData.boardId);
    }
  }, [formData.boardId]);

  useEffect(() => {
    if (formData.classId) {
      loadBlueprints(formData.classId);
    }
  }, [formData.classId]);

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      const mappedSubjectIds = Array.isArray(initialData.subjectIds)
        ? initialData.subjectIds
        : (initialData.examSubjects || [])
            .map((entry: any) => entry?.subject?.id || entry?.subjectId || entry?.subject?.subjectId)
            .filter(Boolean);

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        examType: initialData.examType || ExamType.PRACTICE,
        deliveryType: initialData.deliveryType || DeliveryType.ONLINE,
        duration: initialData.duration || 60,
        totalMarks: initialData.totalMarks || 100,
        isNegativeMarking: initialData.isNegativeMarking || false,
        negativeMarkingValue: initialData.negativeMarkingValue || 0,
        isPracticeMode: initialData.isPracticeMode !== undefined ? initialData.isPracticeMode : false,
        classId: initialData.classId || null,
        boardId: initialData.boardId || null,
        seriesId: initialData.seriesId || null,
        blueprintId: initialData.blueprintId || null,
        subjectIds: Array.from(new Set(mappedSubjectIds)),
      });
    }
  }, [initialData]);

  const loadDropdownData = async () => {
    try {
      const [boardsData, classesData, subjectsData] = await Promise.all([
        examService.getBoards(),
        examService.getClasses(),
        subjectService.getSubjects(),
      ]);
      setBoards(boardsData);
      setClasses(classesData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load dropdown data:', error);
    }
  };

  const loadSeries = async (boardId: string) => {
    try {
      const data = await examService.getSeries(boardId);
      setSeries(data);
    } catch (error) {
      console.error('Failed to load series:', error);
    }
  };

  const loadBlueprints = async (classId: string) => {
    try {
      const data = await examService.getBlueprints(classId);
      setBlueprints(data);
    } catch (error) {
      console.error('Failed to load blueprints:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value || null }));
    }
  };

  const handleToggleSubject = (subjectId: string) => {
    setFormData(prev => {
      const exists = prev.subjectIds.includes(subjectId);
      return {
        ...prev,
        subjectIds: exists
          ? prev.subjectIds.filter(id => id !== subjectId)
          : [...prev.subjectIds, subjectId],
      };
    });
  };

  const handleRemoveSubject = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.filter(id => id !== subjectId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.subjectIds || formData.subjectIds.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    // Use custom submit handler if provided (for edit mode)
    if (onSubmit) {
      onSubmit(formData);
      return;
    }

    try {
      setInternalLoading(true);
      const exam = await examService.createExam(formData);
      alert('Exam created successfully!');
      // Redirect to exam list based on role
      const redirectPath = location.pathname.includes('/super-admin/') ? '/super-admin/exams' : 
                          isAdmin ? '/admin/exams' : '/teacher/my-exams';
        
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Failed to create exam:', error);
      alert(error.message || 'Failed to create exam. Please try again.');
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., JEE Main Mock Test 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Describe the exam..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects <span className="text-red-500">*</span>
            </label>
            <div className="w-full rounded-lg border border-gray-300 p-3">
              {subjects.length === 0 ? (
                <p className="text-sm text-gray-500">No subjects available</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {subjects.map(subject => {
                    const checked = formData.subjectIds.includes(subject.id);
                    return (
                      <label
                        key={subject.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                          checked ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="subjectIds"
                          value={subject.id}
                          checked={checked}
                          onChange={() => handleToggleSubject(subject.id)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{subject.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            {formData.subjectIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.subjectIds.map(subjectId => {
                  const subject = subjects.find(item => item.id === subjectId);
                  return (
                    <span
                      key={subjectId}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                    >
                      {subject?.name || 'Unknown Subject'}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subjectId)}
                        className="text-emerald-700 hover:text-emerald-900"
                        aria-label={`Remove ${subject?.name || 'subject'}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type <span className="text-red-500">*</span>
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value={ExamType.PRACTICE}>Practice</option>
                <option value={ExamType.MOCK}>Mock Test</option>
                <option value={ExamType.FULL_TEST}>Full Test</option>
                <option value={ExamType.PARTIAL_TEST}>Partial Test</option>
                <option value={ExamType.DIAGNOSTIC}>Diagnostic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Type <span className="text-red-500">*</span>
              </label>
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value={DeliveryType.ONLINE}>Online</option>
                <option value={DeliveryType.OFFLINE}>Offline</option>
                <option value={DeliveryType.HYBRID}>Hybrid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNegativeMarking"
              checked={formData.isNegativeMarking}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Enable Negative Marking
            </label>
          </div>

          {formData.isNegativeMarking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Negative Marking Value
              </label>
              <input
                type="number"
                name="negativeMarkingValue"
                value={formData.negativeMarkingValue}
                onChange={handleChange}
                step="0.25"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPracticeMode"
              checked={formData.isPracticeMode}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Practice Mode
            </label>
          </div>
        </div>
      </div>

      {/* Optional Associations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Optional Associations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board
            </label>
            <select
              name="boardId"
              value={formData.boardId || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select Board</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Series
            </label>
            <select
              name="seriesId"
              value={formData.seriesId || ''}
              onChange={handleChange}
              disabled={!formData.boardId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select Series</option>
              {series.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <select
              name="classId"
              value={formData.classId || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blueprint
            </label>
            <select
              name="blueprintId"
              value={formData.blueprintId || ''}
              onChange={handleChange}
              disabled={!formData.classId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select Blueprint</option>
              {blueprints.map(bp => (
                <option key={bp.id} value={bp.id}>{bp.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Creating...' : 'Create Exam'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
      </div>
    </form>
  );
};
