import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FormSection } from "@/components/FormSection";

export const AddNew = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    type: "Section",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New section/topic added:", formData);
  };

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Section/Topic</h1>

        <FormSection
          title="Section/Topic Details"
          fields={[
            { name: "name", label: "Name", type: "text", value: formData.name },
            { name: "subject", label: "Subject", type: "text", value: formData.subject },
            { name: "type", label: "Type", type: "select", value: formData.type, options: ["Section", "Topic"] },
            { name: "description", label: "Description", type: "textarea", value: formData.description },
          ]}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Add Section/Topic"
        />
      </div>
    </Layout>
  );
};
