import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import teacherEarnings from "@/data/teacherEarnings.json";

export const Transactions = () => {
  const headers = ["Date", "Amount", "Description"];

  const data = teacherEarnings.map((earning: any) => [
    earning.date,
    earning.amount,
    earning.description,
  ]);

  return (
    <Layout portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} />
        </div>
      </div>
    </Layout>
  );
};
