import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { Layout } from '@/components/Layout';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { CourseCreateModal } from '@/components/CourseCreateModal';
import { CourseEditModal } from '@/components/CourseEditModal';
import { AdvancedTable } from '@/components/AdvancedTable';
import { useDebounce } from '@/hooks/useDebounce';

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  instructorId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const Courses = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const debouncedFilters = useDebounce(filters, 300);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', page, limit, sortBy, sortOrder, debouncedFilters],
    queryFn: () => apiClient.get('/courses', { page, limit, sortBy, sortOrder, filters: JSON.stringify(debouncedFilters) }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/courses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowCreateModal(false);
      toast.success('Course created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create course');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.put(`/courses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowEditModal(false);
      setEditingCourse(null);
      toast.success('Course updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update course');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowDeleteModal(false);
      setDeletingCourse(null);
      toast.success('Course deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete course');
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

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowEditModal(true);
  };

  const handleUpdate = (data: any) => {
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data });
    }
  };

  const handleDelete = (course: Course) => {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingCourse) {
      deleteMutation.mutate(deletingCourse.id);
    }
  };

  const columns = [
    {
      key: 'code',
      label: 'Course ID',
      sortable: true,
      filterable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        </div>

        <AdvancedTable
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          error={error ? 'Error loading courses' : undefined}
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
          emptyMessage="No courses found"
        />

        {showCreateModal && (
          <CourseCreateModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
          />
        )}

        {showEditModal && editingCourse && (
          <CourseEditModal
            course={editingCourse}
            onClose={() => {
              setShowEditModal(false);
              setEditingCourse(null);
            }}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />
        )}

        {showDeleteModal && deletingCourse && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            title="Delete Course"
            message={`Are you sure you want to delete "${deletingCourse.name}"? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletingCourse(null);
            }}
            isLoading={deleteMutation.isPending}
          />
        )}
      </div>
    </Layout>
  );
};
