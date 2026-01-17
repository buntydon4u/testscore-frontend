import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import studentResults from "@/data/studentResults.json";

export const ExamResult = () => {
  const headers = ["Exam Name", "Date", "Score", "Grade", "Status"];

  const data = studentResults.map((result: any) => [
    result.examName,
    result.date,
    result.score,
    result.grade,
    result.status,
  ]);

  return (
    <Layout portal="student" userName="John Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Exam Results</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} actions={[{ label: "View Details", onClick: () => {} }]} />
        </div>
      </div>
    </Layout>
  );
};
