import { Layout } from "@/components/Layout";
import { BarChart3, Users, TrendingUp, Award } from "lucide-react";

export const Analytics = () => {
  const stats = [
    { title: "Total Students", value: "2,543", icon: Users, color: "bg-blue-500", change: "+12.5%" },
    { title: "Active Exams", value: "45", icon: BarChart3, color: "bg-emerald-500", change: "+8.2%" },
    { title: "Avg Score", value: "78.5%", icon: TrendingUp, color: "bg-purple-500", change: "+3.1%" },
    { title: "Pass Rate", value: "87%", icon: Award, color: "bg-orange-500", change: "+2.4%" },
  ];

  return (
    <Layout role="admin" userName="System Administrator" userRole="Admin">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Exam Completion Rate</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">85%</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Student Engagement</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">72%</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
