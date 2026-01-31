import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examApi, Exam, CreateExamData, UpdateExamData } from '../services/examApi';
import { Layout } from '@/components/Layout';
import { Plus, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import { ExamModal } from '@/components/ExamModal';
import { AdvancedTable } from '@/components/AdvancedTable';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';

export const Exams = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const debouncedFilters = useDebounce(filters, 300);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['exams', page, limit, sortBy, sortOrder, debouncedFilters],
    queryFn: () => examApi.getExams({ page, limit, sortBy, sortOrder, filters: debouncedFilters }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateExamData) => examApi.createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setShowCreateModal(false);
      toast.success('Exam created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create exam');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamData }) => examApi.updateExam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setShowEditModal(false);
      setEditingExam(null);
      toast.success('Exam updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update exam');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => examApi.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setShowDeleteModal(false);
      setDeletingExam(null);
      toast.success('Exam deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete exam');
    },
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleCreate = (data: CreateExamData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setShowEditModal(true);
  };

  const handleUpdate = (data: UpdateExamData) => {
    if (editingExam) {
      updateMutation.mutate({ id: editingExam.id, data });
    }
  };

  const handleDelete = (exam: Exam) => {
    setDeletingExam(exam);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingExam) {
      deleteMutation.mutate(deletingExam.id);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      filterable: true,
    },
    {
      key: 'examType',
      label: 'Type',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {value.replace('_', ' ').toLowerCase()}
        </span>
      ),
    },
    {
      key: 'deliveryType',
      label: 'Delivery',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          {value} min
        </div>
      ),
    },
    {
      key: 'totalMarks',
      label: 'Total Marks',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: <Edit className="w-4 h-4" />,
      className: 'text-emerald-600 hover:text-emerald-900',
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      className: 'text-red-600 hover:text-red-900',
    },
  ];

  return (
    <Layout userName="System Administrator" userRole="Admin">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Exams</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Exam
          </button>
        </div>

        <AdvancedTable
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          error={error ? 'Error loading exams' : undefined}
          pagination={{
            page,
            limit,
            total: data?.total || 0,
            onPageChange: setPage,
          }}
          sorting={{
            field: sortBy,
            order: sortOrder as 'asc' | 'desc',
            onSort: handleSort,
          }}
          filtering={{
            filters,
            onFilterChange: handleFilterChange,
          }}
          actions={actions}
          emptyMessage="No exams found"
        />

        {showCreateModal && (
          <ExamModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
          />
        )}

        {showEditModal && editingExam && (
          <ExamModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingExam(null);
            }}
            onSubmit={handleUpdate}
            exam={editingExam}
            isEditing={true}
          />
        )}

        {showDeleteModal && deletingExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Exam</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{deletingExam.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingExam(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
