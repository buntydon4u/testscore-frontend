import { Layout } from "../../components/layout";
import { Table } from "../../components/Table";
import teacherExams from "../../data/teacherExams.json";

export const ViewAll = () => {
  const headers = ["Exam Name", "Subject", "Created Date", "Status"];

  const data = teacherExams.map((exam: any) => [
    exam.examName,
    exam.subject,
    exam.createdDate,
    exam.status,
  ]);

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Exams</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} actions={[
            { label: "Edit", onClick: () => {} },
            { label: "Delete", onClick: () => {} }
          ]} />
        </div>
      </div>
    </Layout>
  );
};
