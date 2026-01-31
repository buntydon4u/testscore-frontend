import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import studentExams from "@/data/studentExams.json";

export const TestInProgress = () => {
  const headers = ["Exam Name", "Started At", "Time Remaining", "Progress"];

  const data = studentExams.filter((exam: any) => exam.status === "In Progress").map((exam: any) => [
    exam.name,
    exam.startedAt,
    exam.timeRemaining,
    `${exam.progress}%`,
  ]);

  return (
    <Layout portal="student" userName="John Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tests In Progress</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} actions={[{ label: "Resume", onClick: () => {} }]} />
        </div>
      </div>
    </Layout>
  );
};
