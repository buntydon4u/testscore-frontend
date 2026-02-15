import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Clock, BookOpen, GripVertical } from 'lucide-react';
import { examSectionService, ExamSection, CreateSectionDto, UpdateSectionDto } from '../services/examSection';
import { examService } from '../services/exam';
import { questionService } from '../services/question';
import toast from 'react-hot-toast';

export const ExamSections = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [sections, setSections] = useState<ExamSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ExamSection | null>(null);
  const [draggedSection, setDraggedSection] = useState<ExamSection | null>(null);

  useEffect(() => {
    if (id) {
      loadExam();
      loadSections();
    }
  }, [id]);

  const loadExam = async () => {
    try {
      const data = await examService.getExamById(id!);
      setExam(data);
    } catch (error) {
      console.error('Failed to load exam:', error);
    }
  };

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await examSectionService.list(id!);
      setSections(data);
    } catch (error) {
      console.error('Failed to load sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateSectionDto) => {
    try {
      await examSectionService.create(id!, data);
      toast.success('Section created successfully!');
      setShowCreateModal(false);
      loadSections();
    } catch (error: any) {
      console.error('Failed to create section:', error);
      toast.error(error.message || 'Failed to create section');
    }
  };

  const handleUpdate = async (data: UpdateSectionDto) => {
    if (!selectedSection) return;
    
    try {
      await examSectionService.update(selectedSection.id, data);
      toast.success('Section updated successfully!');
      setShowEditModal(false);
      setSelectedSection(null);
      loadSections();
    } catch (error: any) {
      console.error('Failed to update section:', error);
      toast.error(error.message || 'Failed to update section');
    }
  };

  const handleDelete = async (section: ExamSection) => {
    if (!confirm(`Are you sure you want to delete "${section.name}"?`)) return;
    
    try {
      await examSectionService.delete(section.id);
      toast.success('Section deleted successfully!');
      loadSections();
    } catch (error: any) {
      console.error('Failed to delete section:', error);
      toast.error(error.message || 'Failed to delete section');
    }
  };

  const handleEdit = (section: ExamSection) => {
    setSelectedSection(section);
    setShowEditModal(true);
  };

  const handleManageQuestions = (section: ExamSection) => {
    setSelectedSection(section);
    setShowQuestionsModal(true);
  };

  const handleDragStart = (e: React.DragEvent, section: ExamSection) => {
    setDraggedSection(section);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetSection: ExamSection) => {
    e.preventDefault();
    if (!draggedSection || draggedSection.id === targetSection.id) return;

    const newSections = [...sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedSection.id);
    const targetIndex = newSections.findIndex(s => s.id === targetSection.id);

    newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);

    try {
      await examSectionService.reorderSections(id!, newSections.map(s => s.id));
      setSections(newSections);
      toast.success('Sections reordered successfully!');
    } catch (error) {
      toast.error('Failed to reorder sections');
    }

    setDraggedSection(null);
  };

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + (section.totalQuestions || 0), 0);
  };

  const getTotalMarks = () => {
    return sections.reduce((total, section) => total + (section.totalMarks || 0), 0);
  };

  const getTotalTime = () => {
    return sections.reduce((total, section) => total + (section.timeLimit || 0), 0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Sections</h1>
            <p className="text-gray-600">{exam?.title}</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sections</p>
              <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalQuestions()}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">?</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Marks</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalMarks()}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold">M</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalTime()}m</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No sections created yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Create First Section
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, section)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section)}
                className="p-6 hover:bg-gray-50 cursor-move"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {section.name}
                        </h3>
                        {section.isMandatory && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Mandatory
                          </span>
                        )}
                      </div>
                      {section.description && (
                        <p className="text-gray-600 mb-3">{section.description}</p>
                      )}
                      {section.instructions && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-blue-800">
                            <strong>Instructions:</strong> {section.instructions}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>Questions: {section.totalQuestions || 0}</span>
                        <span>Marks: {section.totalMarks || 0}</span>
                        {section.timeLimit && <span>Time: {section.timeLimit} mins</span>}
                        {section.passMarks && <span>Pass Marks: {section.passMarks}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleManageQuestions(section)}
                      className="p-2 text-blue-600 hover:text-blue-900"
                      title="Manage Questions"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-indigo-600 hover:text-indigo-900"
                      title="Edit Section"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section)}
                      className="p-2 text-red-600 hover:text-red-900"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <SectionModal
          title={showCreateModal ? 'Create Section' : 'Edit Section'}
          section={selectedSection}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedSection(null);
          }}
          onSubmit={showCreateModal ? handleCreate : handleUpdate}
        />
      )}

      {/* Questions Modal */}
      {showQuestionsModal && selectedSection && (
        <SectionQuestionsModal
          section={selectedSection}
          onClose={() => {
            setShowQuestionsModal(false);
            setSelectedSection(null);
          }}
        />
      )}
    </div>
  );
};

// Section Modal Component
interface SectionModalProps {
  title: string;
  section?: ExamSection;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SectionModal = ({ title, section, onClose, onSubmit }: SectionModalProps) => {
  const [formData, setFormData] = useState({
    name: section?.name || '',
    description: section?.description || '',
    instructions: section?.instructions || '',
    order: section?.order || 1,
    timeLimit: section?.timeLimit || '',
    isMandatory: section?.isMandatory ?? true,
    passMarks: section?.passMarks || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter section name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pass Marks
              </label>
              <input
                type="number"
                value={formData.passMarks}
                onChange={(e) => setFormData({ ...formData, passMarks: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isMandatory}
                onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Mandatory Section</span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              {section ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Section Questions Modal
interface SectionQuestionsModalProps {
  section: ExamSection;
  onClose: () => void;
}

const SectionQuestionsModal = ({ section, onClose }: SectionQuestionsModalProps) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestions, setShowAddQuestions] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  useEffect(() => {
    loadSectionQuestions();
    loadAvailableQuestions();
  }, []);

  const loadSectionQuestions = async () => {
    try {
      const data = await examSectionService.getQuestions(section.id);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load section questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableQuestions = async () => {
    try {
      const response = await questionService.list({ limit: 100 });
      setAvailableQuestions(response.data);
    } catch (error) {
      console.error('Failed to load available questions:', error);
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      await examSectionService.removeQuestion(section.id, questionId);
      toast.success('Question removed from section');
      loadSectionQuestions();
    } catch (error) {
      toast.error('Failed to remove question');
    }
  };

  const handleAddQuestions = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select questions to add');
      return;
    }

    try {
      const questionsData = selectedQuestions.map((qId, index) => ({
        questionId: qId,
        order: questions.length + index + 1,
        marks: 1,
        isOptional: false,
      }));

      await examSectionService.assignQuestions(section.id, questionsData);
      toast.success('Questions added to section');
      setShowAddQuestions(false);
      setSelectedQuestions([]);
      loadSectionQuestions();
    } catch (error) {
      toast.error('Failed to add questions');
    }
  };

  const assignedQuestionIds = new Set(questions.map(q => q.questionId));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Questions in {section.name}
        </h2>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            {questions.length} question{questions.length !== 1 ? 's' : ''} assigned
          </p>
          <button
            onClick={() => setShowAddQuestions(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Add Questions
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No questions assigned to this section</p>
            <button
              onClick={() => setShowAddQuestions(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Add Questions
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{index + 1}. {q.question?.questionText}</p>
                  <p className="text-sm text-gray-600">
                    Marks: {q.marks} | Type: {q.question?.type}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveQuestion(q.questionId)}
                  className="p-2 text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Questions Modal */}
        {showAddQuestions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add Questions to Section</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableQuestions
                  .filter(q => !assignedQuestionIds.has(q.id))
                  .map((question) => (
                    <label
                      key={question.id}
                      className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuestions([...selectedQuestions, question.id]);
                          } else {
                            setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{question.questionText}</p>
                        <p className="text-sm text-gray-600">
                          Type: {question.type} | Difficulty: {question.difficulty} | Marks: {question.marks}
                        </p>
                      </div>
                    </label>
                  ))}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowAddQuestions(false);
                    setSelectedQuestions([]);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestions}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                >
                  Add Selected ({selectedQuestions.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
