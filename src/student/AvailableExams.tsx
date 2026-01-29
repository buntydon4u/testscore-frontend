import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { examService } from '../services/exam';
import { Exam, ExamType } from '../types/exam';
import { ExamCard } from '../components/exam/ExamCard';
import { useNavigate } from 'react-router-dom';

export const AvailableExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ExamType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, [currentPage, searchTerm, selectedType]);

  const loadExams = async () => {
    try {
      setLoading(true);
      const searchParams: any = {
        page: currentPage,
        limit: 12,
      };

      if (searchTerm) {
        searchParams.search = searchTerm;
      }

      const response = await examService.listExams(searchParams);
      
      let filteredExams = response.data;
      if (selectedType !== 'ALL') {
        filteredExams = filteredExams.filter(exam => exam.examType === selectedType);
      }

      setExams(filteredExams);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (exam: Exam) => {
    navigate(`/student/exam/${exam.id}`);
  };

  const handleEnroll = (exam: Exam) => {
    navigate(`/student/exam/${exam.id}/schedules`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Exams</h1>
        <p className="text-gray-600">Browse and enroll in available exams</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExamType | 'ALL')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
            >
              <option value="ALL">All Types</option>
              <option value={ExamType.PRACTICE}>Practice</option>
              <option value={ExamType.MOCK}>Mock Test</option>
              <option value={ExamType.FULL_TEST}>Full Test</option>
              <option value={ExamType.PARTIAL_TEST}>Partial Test</option>
              <option value={ExamType.DIAGNOSTIC}>Diagnostic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No exams found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onViewDetails={handleViewDetails}
                onEnroll={handleEnroll}
                showEnrollButton={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
