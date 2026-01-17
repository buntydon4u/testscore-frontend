import { BaseModal } from './BaseModal';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  value: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface FormModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  isLoading: boolean;
}

export const FormModalLayout = ({ isOpen, onClose, title, fields, onChange, onSubmit, submitLabel, isLoading }: FormModalLayoutProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit}>
        {fields.map(field => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={field.value}
                onChange={onChange}
                required={field.required}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={field.value}
                onChange={onChange}
                required={field.required}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={onChange}
                required={field.required}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};