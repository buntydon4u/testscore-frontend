import React, { useState } from 'react';
import { Subject } from '../../services/subjectApi';
import { SubjectList } from './SubjectList';
import { SubjectForm } from './SubjectForm';

export const SubjectManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();

  const handleCreate = () => {
    setEditingSubject(undefined);
    setShowForm(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingSubject(undefined);
    // Refresh the list by triggering a re-render
    window.location.reload();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingSubject(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <SubjectList onEdit={handleEdit} onCreate={handleCreate} />
      </div>

      {showForm && (
        <SubjectForm
          subject={editingSubject}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
