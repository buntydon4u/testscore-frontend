import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import studentExams from "@/data/studentExams.json";

export const FreeTopicTest = () => {
  const headers = ["Topic Name", "Subject", "Questions", "Attempts Left"];

  const data = studentExams.map((exam: any) => [
    exam.topic || exam.name,
    exam.subject,
    exam.questions,
    exam.attemptsLeft,
  ]);

  return (
    <Layout portal="student" userName="John Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Free Topic Tests</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} actions={[{ label: "Start", onClick: () => {} }]} />
        </div>
      </div>
    </Layout>
  );
};
