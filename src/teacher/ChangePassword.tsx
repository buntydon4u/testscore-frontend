import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FormSection } from "@/components/FormSection";

export const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change requested");
  };

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

        <FormSection
          title="Update Password"
          fields={[
            { name: "currentPassword", label: "Current Password", type: "password", value: formData.currentPassword },
            { name: "newPassword", label: "New Password", type: "password", value: formData.newPassword },
            { name: "confirmPassword", label: "Confirm New Password", type: "password", value: formData.confirmPassword },
          ]}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Change Password"
        />
      </div>
    </Layout>
  );
};
