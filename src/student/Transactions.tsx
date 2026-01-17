import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import studentTransactions from "@/data/studentTransactions.json";

export const Transactions = () => {
  const headers = ["Transaction ID", "Date", "Amount", "Description", "Status"];

  const data = studentTransactions.map((transaction: any) => [
    transaction.id,
    transaction.date,
    transaction.amount,
    transaction.description,
    transaction.status,
  ]);

  return (
    <Layout portal="student" userName="John Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} />
        </div>
      </div>
    </Layout>
  );
};
