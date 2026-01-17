import { Layout } from "@/components/Layout";
import { Table } from "@/components/Table";
import studentPackages from "@/data/studentPackages.json";

export const PurchasedPackages = () => {
  const headers = ["Package Name", "Purchase Date", "Expiry Date", "Status"];

  const data = studentPackages.map(pkg => [
    pkg.name,
    pkg.purchaseDate,
    pkg.expiryDate,
    pkg.status,
  ]);

  return (
    <Layout portal="student" userName="John Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Purchased Packages</h1>

        <div className="bg-white rounded-lg shadow">
          <Table headers={headers} data={data} />
        </div>
      </div>
    </Layout>
  );
};
