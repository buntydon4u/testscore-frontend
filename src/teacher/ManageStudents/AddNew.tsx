import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FormSection } from "@/components/FormSection";

export const AddNew = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New student added:", formData);
  };

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Student</h1>

        <FormSection
          title="Student Information"
          fields={[
            { name: "name", label: "Full Name", type: "text", value: formData.name },
            { name: "email", label: "Email", type: "email", value: formData.email },
            { name: "phone", label: "Phone", type: "tel", value: formData.phone },
            { name: "password", label: "Password", type: "password", value: formData.password },
            { name: "confirmPassword", label: "Confirm Password", type: "password", value: formData.confirmPassword },
          ]}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Add Student"
        />
      </div>
    </Layout>
  );
};
