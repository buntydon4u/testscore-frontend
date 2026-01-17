import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import teacherExams from "@/data/teacherExams.json";

export const ScheduledTests = () => {
  const headers = ["Exam Name", "Date", "Students Assigned", "Status"];

  const data = teacherExams.map((exam: any) => [
    exam.name,
    exam.date,
    exam.studentsAssigned || "10",
    exam.status,
  ]);

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Scheduled Tests</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} />
        </div>
      </div>
    </Layout>
  );
};
