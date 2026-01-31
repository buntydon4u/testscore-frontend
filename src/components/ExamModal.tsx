import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { examApi, CreateExamData, UpdateExamData, Exam, ExamBoard, ExamSeries, Class, ExamBlueprint, AcademicBoard } from '../services/examApi';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExamData | UpdateExamData) => Promise<void>;
  exam?: Exam | null;
  isEditing?: boolean;
}

export const ExamModal = ({ isOpen, onClose, onSubmit, exam, isEditing = false }: ExamModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    boardId: '',
    seriesId: '',
    examType: 'PRACTICE' as 'PRACTICE' | 'MOCK' | 'FULL_TEST' | 'PARTIAL_TEST' | 'DIAGNOSTIC',
    deliveryType: 'ONLINE' as 'ONLINE' | 'OFFLINE',
    duration: 60,
    totalMarks: 100,
    isNegativeMarking: false,
    negativeMarkingValue: 0.25,
    isPracticeMode: false,
    blueprintId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dropdown data
  const [boards, setBoards] = useState<ExamBoard[]>([]);
  const [academicBoards, setAcademicBoards] = useState<AcademicBoard[]>([]);
  const [series, setSeries] = useState<ExamSeries[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [blueprints, setBlueprints] = useState<ExamBlueprint[]>([]);

  // Mini-modals for adding master data
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [showAddAcademicBoard, setShowAddAcademicBoard] = useState(false);
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddBlueprint, setShowAddBlueprint] = useState(false);

  // Form data for mini-modals
  const [newBoard, setNewBoard] = useState({ name: '', code: '' });
  const [newAcademicBoard, setNewAcademicBoard] = useState({ name: '', shortName: '', country: 'India', website: '' });
  const [newSeries, setNewSeries] = useState({ name: '', boardId: '', year: new Date().getFullYear() });
  const [newClass, setNewClass] = useState({ name: '', level: 1, boardId: '' });
  const [newBlueprint, setNewBlueprint] = useState({ name: '', description: '', classId: '' });
  const [miniModalLoading, setMiniModalLoading] = useState(false);
  const [miniModalError, setMiniModalError] = useState('');

  useEffect(() => {
    if (isEditing && exam) {
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        classId: exam.classId || '',
        boardId: exam.boardId || '',
        seriesId: exam.seriesId || '',
        examType: exam.examType || 'PRACTICE',
        deliveryType: exam.deliveryType || 'ONLINE',
        duration: exam.duration || 60,
        totalMarks: exam.totalMarks || 100,
        isNegativeMarking: exam.isNegativeMarking || false,
        negativeMarkingValue: exam.negativeMarkingValue || 0.25,
        isPracticeMode: exam.isPracticeMode || false,
        blueprintId: exam.blueprintId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        classId: '',
        boardId: '',
        seriesId: '',
        examType: 'PRACTICE',
        deliveryType: 'ONLINE',
        duration: 60,
        totalMarks: 100,
        isNegativeMarking: false,
        negativeMarkingValue: 0.25,
        isPracticeMode: false,
        blueprintId: '',
      });
    }
    setError('');
  }, [isOpen, isEditing, exam]);

  useEffect(() => {
    // Load dropdown data
    const loadDropdownData = async () => {
      try {
        const [boardsRes, academicBoardsRes, classesRes] = await Promise.all([
          examApi.getBoards(),
          examApi.getAcademicBoards(),
          examApi.getClasses(),
        ]);
        setBoards(boardsRes);
        setAcademicBoards(academicBoardsRes);
        setClasses(classesRes);
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      }
    };
    
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load series when board changes
    if (formData.boardId) {
      examApi.getSeries(formData.boardId).then(setSeries).catch(console.error);
    } else {
      setSeries([]);
    }
  }, [formData.boardId]);

  useEffect(() => {
    // Load blueprints when class changes
    if (formData.classId) {
      examApi.getBlueprints(formData.classId).then(setBlueprints).catch(console.error);
    } else {
      setBlueprints([]);
    }
  }, [formData.classId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData: CreateExamData | UpdateExamData = {
        title: formData.title,
        description: formData.description,
        classId: formData.classId || undefined,
        boardId: formData.boardId || undefined,
        seriesId: formData.seriesId || undefined,
        examType: formData.examType,
        deliveryType: formData.deliveryType,
        duration: formData.duration,
        totalMarks: formData.totalMarks,
        isNegativeMarking: formData.isNegativeMarking,
        negativeMarkingValue: formData.isNegativeMarking ? formData.negativeMarkingValue : undefined,
        isPracticeMode: formData.isPracticeMode,
        blueprintId: formData.blueprintId || undefined,
      };

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for adding master data
  const handleAddBoard = async () => {
    setMiniModalLoading(true);
    setMiniModalError('');
    try {
      await examApi.createBoard(newBoard);
      setShowAddBoard(false);
      setNewBoard({ name: '', code: '' });
      // Refresh boards
      const boardsRes = await examApi.getBoards();
      setBoards(boardsRes);
    } catch (err: any) {
      setMiniModalError(err.message || 'Failed to add board');
    } finally {
      setMiniModalLoading(false);
    }
  };

  const handleAddAcademicBoard = async () => {
    setMiniModalLoading(true);
    setMiniModalError('');
    try {
      await examApi.createAcademicBoard(newAcademicBoard);
      setShowAddAcademicBoard(false);
      setNewAcademicBoard({ name: '', shortName: '', country: 'India', website: '' });
      // Refresh academic boards
      const academicBoardsRes = await examApi.getAcademicBoards();
      setAcademicBoards(academicBoardsRes);
    } catch (err: any) {
      setMiniModalError(err.message || 'Failed to add academic board');
    } finally {
      setMiniModalLoading(false);
    }
  };

  const handleAddSeries = async () => {
    setMiniModalLoading(true);
    setMiniModalError('');
    try {
      await examApi.createSeries(newSeries);
      setShowAddSeries(false);
      setNewSeries({ name: '', boardId: '', year: new Date().getFullYear() });
      // Refresh series
      if (formData.boardId) {
        const seriesRes = await examApi.getSeries(formData.boardId);
        setSeries(seriesRes);
      }
    } catch (err: any) {
      setMiniModalError(err.message || 'Failed to add series');
    } finally {
      setMiniModalLoading(false);
    }
  };

  const handleAddClass = async () => {
    setMiniModalLoading(true);
    setMiniModalError('');
    try {
      await examApi.createClass(newClass);
      setShowAddClass(false);
      setNewClass({ name: '', level: 1, boardId: '' });
      // Refresh classes
      const classesRes = await examApi.getClasses();
      setClasses(classesRes);
    } catch (err: any) {
      setMiniModalError(err.message || 'Failed to add class');
    } finally {
      setMiniModalLoading(false);
    }
  };

  const handleAddBlueprint = async () => {
    setMiniModalLoading(true);
    setMiniModalError('');
    try {
      await examApi.createBlueprint(newBlueprint);
      setShowAddBlueprint(false);
      setNewBlueprint({ name: '', description: '', classId: '' });
      // Refresh blueprints
      if (formData.classId) {
        const blueprintsRes = await examApi.getBlueprints(formData.classId);
        setBlueprints(blueprintsRes);
      }
    } catch (err: any) {
      setMiniModalError(err.message || 'Failed to add blueprint');
    } finally {
      setMiniModalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Exam' : 'Add New Exam'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.boardId}
                  onChange={(e) => handleInputChange('boardId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading}
                >
                  <option value="">Select Board</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>{board.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddBoard(true)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Add Board"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.seriesId}
                  onChange={(e) => handleInputChange('seriesId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading || !formData.boardId}
                >
                  <option value="">Select Series</option>
                  {series.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.year})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddSeries(true)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Add Series"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddClass(true)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Add Class"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAcademicBoard(true)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Add Academic Board"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blueprint
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.blueprintId}
                  onChange={(e) => handleInputChange('blueprintId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading || !formData.classId}
                >
                  <option value="">Select Blueprint</option>
                  {blueprints.map(bp => (
                    <option key={bp.id} value={bp.id}>{bp.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddBlueprint(true)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Add Blueprint"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type *
              </label>
              <select
                value={formData.examType}
                onChange={(e) => handleInputChange('examType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
                required
              >
                <option value="PRACTICE">Practice</option>
                <option value="MOCK">Mock Test</option>
                <option value="FULL_TEST">Full Test</option>
                <option value="PARTIAL_TEST">Partial Test</option>
                <option value="DIAGNOSTIC">Diagnostic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Type *
              </label>
              <select
                value={formData.deliveryType}
                onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
                required
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.totalMarks}
                onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isNegativeMarking}
                  onChange={(e) => handleInputChange('isNegativeMarking', e.target.checked)}
                  className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-700">Enable Negative Marking</span>
              </label>
            </div>

            {formData.isNegativeMarking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Negative Marking Value
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={formData.negativeMarkingValue}
                  onChange={(e) => handleInputChange('negativeMarkingValue', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading}
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPracticeMode}
                  onChange={(e) => handleInputChange('isPracticeMode', e.target.checked)}
                  className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-700">Practice Mode</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>

        {/* Mini-modals for adding master data */}
        {/* Add Board Modal */}
        {showAddBoard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Board</h3>
              {miniModalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {miniModalError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newBoard.name}
                    onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={newBoard.code}
                    onChange={(e) => setNewBoard({ ...newBoard, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddBoard(false); setMiniModalError(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={miniModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBoard}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={miniModalLoading || !newBoard.name || !newBoard.code}
                >
                  {miniModalLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Series Modal */}
        {showAddSeries && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Series</h3>
              {miniModalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {miniModalError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newSeries.name}
                    onChange={(e) => setNewSeries({ ...newSeries, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board *</label>
                  <div className="flex gap-2">
                    <select
                      value={newSeries.boardId}
                      onChange={(e) => setNewSeries({ ...newSeries, boardId: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={miniModalLoading}
                    >
                      <option value="">Select Board</option>
                      {academicBoards.map(board => (
                        <option key={board.id} value={board.id}>{board.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddAcademicBoard(true)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Add Academic Board"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="number"
                    value={newSeries.year}
                    onChange={(e) => setNewSeries({ ...newSeries, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddSeries(false); setMiniModalError(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={miniModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSeries}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={miniModalLoading || !newSeries.name || !newSeries.boardId}
                >
                  {miniModalLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Class Modal */}
        {showAddClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
              {miniModalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {miniModalError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <input
                    type="number"
                    value={newClass.level}
                    onChange={(e) => setNewClass({ ...newClass, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board *</label>
                  <div className="flex gap-2">
                    <select
                      value={newClass.boardId}
                      onChange={(e) => setNewClass({ ...newClass, boardId: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={miniModalLoading}
                    >
                      <option value="">Select Board</option>
                      {academicBoards.map(board => (
                        <option key={board.id} value={board.id}>{board.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddAcademicBoard(true)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Add Academic Board"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddClass(false); setMiniModalError(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={miniModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddClass}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={miniModalLoading || !newClass.name || !newClass.boardId}
                >
                  {miniModalLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Blueprint Modal */}
        {showAddBlueprint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Blueprint</h3>
              {miniModalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {miniModalError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newBlueprint.name}
                    onChange={(e) => setNewBlueprint({ ...newBlueprint, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newBlueprint.description}
                    onChange={(e) => setNewBlueprint({ ...newBlueprint, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select
                    value={newBlueprint.classId}
                    onChange={(e) => setNewBlueprint({ ...newBlueprint, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddBlueprint(false); setMiniModalError(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={miniModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBlueprint}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={miniModalLoading || !newBlueprint.name || !newBlueprint.classId}
                >
                  {miniModalLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Academic Board Modal */}
        {showAddAcademicBoard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Academic Board</h3>
              {miniModalError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {miniModalError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newAcademicBoard.name}
                    onChange={(e) => setNewAcademicBoard({ ...newAcademicBoard, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Name *</label>
                  <input
                    type="text"
                    value={newAcademicBoard.shortName}
                    onChange={(e) => setNewAcademicBoard({ ...newAcademicBoard, shortName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={newAcademicBoard.country}
                    onChange={(e) => setNewAcademicBoard({ ...newAcademicBoard, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={newAcademicBoard.website}
                    onChange={(e) => setNewAcademicBoard({ ...newAcademicBoard, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={miniModalLoading}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddAcademicBoard(false); setMiniModalError(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={miniModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddAcademicBoard}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={miniModalLoading || !newAcademicBoard.name || !newAcademicBoard.shortName}
                >
                  {miniModalLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
