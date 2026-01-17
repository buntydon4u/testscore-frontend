import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import teacherResults from "@/data/teacherResults.json";

export const ExamResults = () => {
  const headers = ["Student Name", "Exam Name", "Score", "Date"];

  const data = teacherResults.map((result: any) => [
    result.studentName,
    result.examName,
    result.score,
    result.date,
  ]);

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Exam Results</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} actions={[{ label: "View Details", onClick: () => {} }]} />
        </div>
      </div>
    </Layout>
  );
};
