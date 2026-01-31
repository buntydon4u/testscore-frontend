import { BarChart3, Users, FileText, TrendingUp, Calendar } from "lucide-react";

export const Dashboard = () => {
  const stats = [
    { title: "Total Students", value: "1,234", icon: Users, color: "bg-blue-500" },
    { title: "Active Exams", value: "45", icon: FileText, color: "bg-emerald-500" },
    { title: "Completed Tests", value: "892", icon: BarChart3, color: "bg-purple-500" },
    { title: "Average Score", value: "78%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  const recentExams = [
    { name: "Mathematics Final", date: "2024-01-15", students: 45, status: "Active" },
    { name: "Physics Midterm", date: "2024-01-18", students: 38, status: "Scheduled" },
    { name: "Chemistry Quiz", date: "2024-01-12", students: 52, status: "Completed" },
    { name: "Biology Test", date: "2024-01-20", students: 41, status: "Scheduled" },
  ];

  return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
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
            <h2 className="text-lg font-semibold text-gray-900">Recent Exams</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExams.map((exam, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exam.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {exam.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exam.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          exam.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : exam.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create New Exam</h3>
                <p className="text-sm text-gray-500">Set up a new examination</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Students</h3>
                <p className="text-sm text-gray-500">View and edit student data</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-500">Analyze exam results</p>
              </div>
            </div>
          </button>
        </div>
      </div>
  );
};
