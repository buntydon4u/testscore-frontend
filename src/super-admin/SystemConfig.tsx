import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { apiClient } from "@/services/api";

interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  category?: string;
  isActive: boolean;
  updatedAt: string;
}

interface EditModalProps {
  config: SystemConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Partial<SystemConfig>) => void;
}

const EditModal = ({ config, isOpen, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
    category: "",
  });
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (config) {
      setFormData({
        key: config.key,
        value: JSON.stringify(config.value, null, 2),
        description: config.description || "",
        category: config.category || "",
      });
    } else {
      setFormData({
        key: "",
        value: "",
        description: "",
        category: "",
      });
    }
    setJsonError("");
  }, [config, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedValue = JSON.parse(formData.value);
      onSave({
        key: formData.key,
        value: parsedValue,
        description: formData.description,
        category: formData.category,
      });
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 pr-8">
          {config ? "Edit Configuration" : "Add Configuration"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              disabled={!!config}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value (JSON)</label>
            <textarea
              value={formData.value}
              onChange={(e) => {
                setFormData({ ...formData, value: e.target.value });
                setJsonError("");
              }}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
              required
            />
            {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SystemConfig = ({ role = "super-admin" }: { role?: "admin" | "super-admin" }) => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await apiClient.get<SystemConfig[]>("/config");
      setConfigs(data);
    } catch (error) {
      console.error("Failed to fetch configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (configData: Partial<SystemConfig>) => {
    try {
      if (editingConfig) {
        await apiClient.put(`/config/${editingConfig.key}`, {
          value: configData.value,
          description: configData.description,
          category: configData.category,
        });
      } else {
        await apiClient.post("/config", configData);
      }
      await fetchConfigs();
      setIsModalOpen(false);
      setEditingConfig(null);
    } catch (error: any) {
      alert(error.message || "Failed to save configuration");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;
    try {
      await apiClient.delete(`/config/${key}`);
      await fetchConfigs();
    } catch (error: any) {
      alert(error.message || "Failed to delete configuration");
    }
  };

  const handleToggleStatus = async (key: string) => {
    try {
      await apiClient.patch(`/config/${key}/toggle`, {});
      await fetchConfigs();
    } catch (error: any) {
      alert(error.message || "Failed to toggle status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <button
            onClick={() => {
              setEditingConfig(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4" />
            Add Configuration
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {configs.map((config) => (
                <tr key={config.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{config.key}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {JSON.stringify(config.value)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{config.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{config.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(config.key)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        config.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {config.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingConfig(config);
                        setIsModalOpen(true);
                      }}
                      className="text-emerald-600 hover:text-emerald-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.key)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {configs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No configurations found. Click "Add Configuration" to create one.
            </div>
          )}
        </div>

        <EditModal
          config={editingConfig}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
    </div>
  );
};