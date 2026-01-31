import { BaseModal } from './BaseModal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({ isOpen, title, message, onConfirm, onClose, isLoading }: ConfirmDeleteModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </BaseModal>
  );
};