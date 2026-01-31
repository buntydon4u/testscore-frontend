import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormSection = ({ title, children, onSubmit }: FormSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
