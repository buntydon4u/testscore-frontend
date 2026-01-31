import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import studentExams from "@/data/studentExams.json";

export const ScheduledExams = () => {
  const headers = ["Exam Name", "Date", "Time", "Subject", "Status"];

  const data = studentExams.map(exam => [
    exam.name,
    exam.date,
    exam.time,
    exam.subject,
    exam.status,
  ]);

  return (
    <Layout portal="student" userName="John Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Scheduled Exams</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} />
        </div>
      </div>
    </Layout>
  );
};
