import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FormSection } from "@/components/FormSection";

export const CreateNew = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    date: "",
    duration: "",
    questions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New exam created:", formData);
  };

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Exam</h1>

        <FormSection
          title="Exam Details"
          fields={[
            { name: "name", label: "Exam Name", type: "text", value: formData.name },
            { name: "subject", label: "Subject", type: "text", value: formData.subject },
            { name: "date", label: "Date", type: "date", value: formData.date },
            { name: "duration", label: "Duration (minutes)", type: "number", value: formData.duration },
            { name: "questions", label: "Number of Questions", type: "number", value: formData.questions },
          ]}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Create Exam"
        />
      </div>
    </Layout>
  );
};
