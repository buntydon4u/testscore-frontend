import React, { useState } from 'react';
import { PackageList } from '../components/Packages/PackageList';
import { PackageForm } from '../components/Packages/PackageForm';
import { Package } from '../services/packageApi';
import toast from 'react-hot-toast';

export const PackageManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingPackage(undefined);
    setShowForm(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleView = (pkg: Package) => {
    // You could implement a view modal or navigate to detail page
    toast.success(`Viewing package: ${pkg.package_name}`);
  };

  const handleSave = (pkg: Package) => {
    setShowForm(false);
    setEditingPackage(undefined);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPackage(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
        <p className="mt-2 text-gray-600">Manage educational packages, pricing, and availability</p>
      </div>

      <PackageList
        key={refreshKey}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onView={handleView}
      />

      {showForm && (
        <PackageForm
          package={editingPackage}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
