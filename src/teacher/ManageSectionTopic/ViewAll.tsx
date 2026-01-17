import { Layout } from "../../components/layout";
import { Table } from "../../components/Table";
import teacherExams from "../../data/teacherExams.json";

export const ViewAll = () => {
  const headers = ["Name", "Subject", "Type", "Created Date"];

  const data = teacherExams.map((exam: any) => [
    exam.examName,
    exam.subject,
    exam.type || "Section",
    exam.createdDate,
  ]);

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Sections/Topics</h1>

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
