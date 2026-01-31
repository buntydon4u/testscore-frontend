import { TrendingUp, Users, FileText, Award, ArrowUp, ArrowDown } from "lucide-react";

export const Analytics = () => {
  const metrics = [
    { title: "Total Exams", value: "156", change: "+12%", trend: "up", icon: FileText },
    { title: "Total Students", value: "1,234", change: "+8%", trend: "up", icon: Users },
    { title: "Average Score", value: "78%", change: "-2%", trend: "down", icon: Award },
    { title: "Pass Rate", value: "85%", change: "+5%", trend: "up", icon: TrendingUp },
  ];

  const performanceData = [
    { subject: "Mathematics", average: 82, students: 245 },
    { subject: "Physics", average: 76, students: 198 },
    { subject: "Chemistry", average: 79, students: 223 },
    { subject: "Biology", average: 84, students: 267 },
    { subject: "English", average: 88, students: 289 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-8 h-8 text-emerald-500" />
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                metric.trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {metric.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.average}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${item.average}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.students} students</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New exam created</p>
                <p className="text-xs text-gray-500">Mathematics Final - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Results published</p>
                <p className="text-xs text-gray-500">Physics Midterm - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Student enrolled</p>
                <p className="text-xs text-gray-500">45 new students - 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
