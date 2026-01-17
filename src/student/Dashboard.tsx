import { Layout } from "@/components/Layout";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import studentResults from "@/data/studentResults.json";
import studentExams from "@/data/studentExams.json";
import studentPackages from "@/data/studentPackages.json";
import studentTransactions from "@/data/studentTransactions.json";

export const Dashboard = () => {
  const stats = [
    { title: "Purchased Packages", value: studentPackages.length.toString(), icon: "Package", color: "bg-blue-500" },
    { title: "Free Exams – Mock Test", value: "5", icon: "PlayCircle", color: "bg-emerald-500" },
    { title: "Free Section – Mock Test", value: "10", icon: "Target", color: "bg-purple-500" },
    { title: "Free Topic – Mock Test", value: "15", icon: "Square", color: "bg-orange-500" },
    { title: "Transaction History", value: studentTransactions.length.toString(), icon: "CreditCard", color: "bg-red-500" },
    { title: "Test in Progress", value: "2", icon: "Clock", color: "bg-yellow-500" },
  ];

  const recentActivities = [
    { activity: "Completed Math Exam", date: "2024-01-15", status: "Passed" },
    { activity: "Started Physics Test", date: "2024-01-18", status: "In Progress" },
    { activity: "Purchased Chemistry Package", date: "2024-01-12", status: "Completed" },
  ];

  return (
    <Layout role="student" userName="Jane Doe" userRole="Student">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <Table
            headers={["Activity", "Date", "Status"]}
            data={recentActivities.map(activity => [activity.activity, activity.date, activity.status])}
          />
        </div>
      </div>
    </Layout>
  );
};
