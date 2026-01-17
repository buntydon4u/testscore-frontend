import { Users, TrendingUp, Award, BookOpen, AlertCircle, Calendar } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Dashboard = () => {
  const stats = [
    { title: "Children Enrolled", value: "2", icon: Users, color: "bg-blue-500" },
    { title: "Average Score", value: "82%", icon: TrendingUp, color: "bg-emerald-500" },
    { title: "Achievements", value: "5", icon: Award, color: "bg-purple-500" },
    { title: "Active Courses", value: "6", icon: BookOpen, color: "bg-orange-500" },
  ];

  const childrenProgress = [
    { name: "John Doe", score: "85%", status: "Excellent", lastActive: "Today" },
    { name: "Jane Doe", score: "78%", status: "Good", lastActive: "Yesterday" },
  ];

  return (
    <Layout role="parent" userName="Parent User" userRole="Parent">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Parent Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Children's Progress</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {childrenProgress.map((child, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{child.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{child.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          child.status === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : child.status === "Good"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {child.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{child.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Children</h3>
                <p className="text-sm text-gray-500">Monitor all children accounts</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-500">Check performance reports</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">View important updates</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};
