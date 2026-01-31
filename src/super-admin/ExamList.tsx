import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ArrowUpDown } from 'lucide-react';
import { examService } from '../services/exam';
import { Exam, ExamSearchParams, ExamType, DeliveryType } from '../types/exam';
import { ExamListTable } from '../components/exam/ExamListTable';

export const ExamList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<ExamSearchParams>({
    page: 1,
    limit: 10,
    search: '',
    examType: undefined,
    deliveryType: undefined,
    classId: undefined,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    loadExams();
  }, [searchParams]);

  const loadExams = async () => {
    try {
      setLoading(true);
      const response = await examService.listExams(searchParams);
      setExams(response.exams);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search: string) => {
    setSearchParams(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilter = (filters: Partial<ExamSearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handleDelete = async (exam: Exam) => {
    if (!confirm(`Are you sure you want to delete "${exam.title}"?`)) return;

    try {
      await examService.deleteExam(exam.id);
      alert('Exam deleted successfully!');
      loadExams();
    } catch (error: any) {
      console.error('Failed to delete exam:', error);
      alert(error.message || 'Failed to delete exam. Please try again.');
    }
  };

  const handleEdit = (exam: Exam) => {
    navigate(`/super-admin/exam/${exam.id}/edit`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Exams</h1>
          <p className="text-gray-600">Create and manage exams across all institutes</p>
        </div>
        <button
          onClick={() => navigate('/super-admin/create-exam')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Exam
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exams by title or description..."
                value={searchParams.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={searchParams.examType || ''}
              onChange={(e) => handleFilter({ examType: e.target.value as ExamType || undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="PRACTICE">Practice</option>
              <option value="MOCK_TEST">Mock Test</option>
              <option value="CHAPTER_TEST">Chapter Test</option>
              <option value="PARTIAL_TEST">Partial Test</option>
              <option value="FULL_TEST">Full Test</option>
            </select>
            <select
              value={searchParams.deliveryType || ''}
              onChange={(e) => handleFilter({ deliveryType: e.target.value as DeliveryType || undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Delivery Types</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <ExamListTable
        exams={exams}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        baseRoute="/super-admin/exam"
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setSearchParams(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
            disabled={pagination.page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setSearchParams(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page! + 1) }))}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
