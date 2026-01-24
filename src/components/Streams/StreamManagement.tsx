import React, { useState } from 'react';
import { Stream } from '../../services/streamApi';
import { StreamList } from './StreamList';
import { StreamForm } from './StreamForm';

export const StreamManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | undefined>();

  const handleCreate = () => {
    setEditingStream(undefined);
    setShowForm(true);
  };

  const handleEdit = (stream: Stream) => {
    setEditingStream(stream);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingStream(undefined);
    // Refresh the list by triggering a re-render
    window.location.reload();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingStream(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <StreamList onEdit={handleEdit} onCreate={handleCreate} />
      </div>

      {showForm && (
        <StreamForm
          stream={editingStream}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
