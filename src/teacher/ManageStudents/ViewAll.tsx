import { Layout } from "../../components/layout";
import { Table } from "../../components/Table";
import teacherStudents from "../../data/teacherStudents.json";

export const ViewAll = () => {
  const headers = ["Name", "Email", "Enrolled Date", "Status"];

  const data = teacherStudents.map((student: any) => [
    student.name,
    student.email,
    student.enrolledDate,
    student.status,
  ]);

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Students</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} actions={[
            { label: "Edit", onClick: () => {} },
            { label: "View", onClick: () => {} }
          ]} />
        </div>
      </div>
    </Layout>
  );
};
