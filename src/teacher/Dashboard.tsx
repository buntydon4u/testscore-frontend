import { BarChart3, Users, BookOpen, ClipboardList, TrendingUp, Clock } from "lucide-react";

export const Dashboard = () => {
  const stats = [
    { title: "Total Students", value: "324", icon: Users, color: "bg-blue-500" },
    { title: "Active Classes", value: "6", icon: BookOpen, color: "bg-emerald-500" },
    { title: "Exams Created", value: "18", icon: ClipboardList, color: "bg-purple-500" },
    { title: "Avg Performance", value: "78%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  const upcomingExams = [
    { name: "Mathematics Final Exam", class: "12A", students: 45, date: "2024-01-25", time: "10:00 AM", status: "Scheduled" },
    { name: "Physics Midterm", class: "11B", students: 38, date: "2024-01-28", time: "02:00 PM", status: "Scheduled" },
    { name: "Chemistry Quiz", class: "10A", students: 52, date: "2024-01-20", time: "11:30 AM", status: "Active" },
    { name: "Biology Assessment", class: "12C", students: 41, date: "2024-01-22", time: "09:00 AM", status: "Scheduled" },
  ];

  const recentActivities = [
    { activity: "Graded Mathematics Exam", timestamp: "2024-01-15 14:30", status: "Completed" },
    { activity: "Created Physics Quiz", timestamp: "2024-01-14 10:15", status: "Created" },
    { activity: "Class 12A Assessment", timestamp: "2024-01-13 16:45", status: "In Progress" },
    { activity: "Student Performance Report", timestamp: "2024-01-12 09:00", status: "Completed" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Teacher Dashboard</h1>

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
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Exams</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingExams.map((exam, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.students}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.date} {exam.time}
                      </div>
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

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.activity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "Created"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {activity.status}
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
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Exam</h3>
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
                <p className="text-sm text-gray-500">View and manage student data</p>
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
    </>
  );
};
