import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { Layout } from '@/components/Layout';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { StudentModal } from '@/components/StudentModal';
import { AdvancedTable } from '@/components/AdvancedTable';
import { useDebounce } from '../hooks/useDebounce';
import { Student, StudentListResponse, CreateStudentData, UpdateStudentData } from '../services/studentApi';

export const Students = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const debouncedFilters = useDebounce(filters, 300);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<StudentListResponse>({
    queryKey: ['students', page, limit, sortBy, sortOrder, debouncedFilters],
    queryFn: () => apiClient.get('/students', { page, limit, sortBy, sortOrder, filters: JSON.stringify(debouncedFilters) }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStudentData) => apiClient.post('/students', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowCreateModal(false);
      toast.success('Student created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create student');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) => apiClient.put(`/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowEditModal(false);
      setEditingStudent(null);
      toast.success('Student updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update student');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowDeleteModal(false);
      setDeletingStudent(null);
      toast.success('Student deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete student');
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

  const handleCreate = (data: CreateStudentData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleUpdate = (data: UpdateStudentData) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    }
  };

  const handleDelete = (student: Student) => {
    setDeletingStudent(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingStudent) {
      deleteMutation.mutate(deletingStudent.id);
    }
  };

  const columns = [
    {
      key: 'rollNumber',
      label: 'Roll Number',
      sortable: true,
      filterable: true,
      render: (_: any, row: Student) => row.profile?.rollNumber || '-',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
      render: (_: any, row: Student) => row.profile ? `${row.profile.firstName} ${row.profile.lastName}` : '-',
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      filterable: true,
      render: (_: any, row: Student) => row.profile?.primaryPhone || '-',
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View',
      onClick: (student: Student) => {
        // Handle view action
        console.log('View student:', student);
      },
      icon: <Eye className="w-4 h-4" />,
      className: 'text-blue-600 hover:text-blue-900',
    },
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage student profiles</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>

        <AdvancedTable
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          error={error ? 'Error loading students' : undefined}
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
          emptyMessage="No students found"
        />

        {showCreateModal && (
          <StudentModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
          />
        )}

        {showEditModal && editingStudent && (
          <StudentModal
            isOpen={showEditModal}
            student={editingStudent}
            onClose={() => {
              setShowEditModal(false);
              setEditingStudent(null);
            }}
            onSubmit={handleUpdate}
            isEditing={true}
          />
        )}

        {showDeleteModal && deletingStudent && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            title="Delete Student"
            message={`Are you sure you want to delete "${deletingStudent.profile?.firstName} ${deletingStudent.profile?.lastName}"? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletingStudent(null);
            }}
            isLoading={deleteMutation.isPending}
          />
        )}
      </div>
    </Layout>
  );
};
