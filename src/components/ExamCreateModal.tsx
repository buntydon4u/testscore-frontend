import { useState } from 'react';
import { FormModalLayout } from './FormModalLayout';

interface ExamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const ExamCreateModal = ({ isOpen, onClose, onSubmit, isLoading }: ExamCreateModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    status: 'Scheduled',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { name: 'name', label: 'Exam Name', type: 'text' as const, value: formData.name, required: true },
    { name: 'date', label: 'Date', type: 'text' as const, value: formData.date, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, value: formData.description },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      value: formData.status,
      options: [
        { value: 'Scheduled', label: 'Scheduled' },
        { value: 'Active', label: 'Active' },
        { value: 'Completed', label: 'Completed' },
      ],
    },
  ];

  return (
    <FormModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Create Exam"
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Create"
      isLoading={isLoading}
    />
  );
};
