import { useState } from 'react';
import { FormModalLayout } from './FormModalLayout';

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

interface CourseEditModalProps {
  course: Course;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const CourseEditModal = ({ course, onClose, onSubmit, isLoading }: CourseEditModalProps) => {
  const [formData, setFormData] = useState({
    name: course.name,
    code: course.code,
    description: course.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as const, value: formData.name, required: true },
    { name: 'code', label: 'Code', type: 'text' as const, value: formData.code, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, value: formData.description },
  ];

  return (
    <FormModalLayout
      isOpen={true}
      onClose={onClose}
      title="Edit Course"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Update"
      isLoading={isLoading}
    />
  );
};