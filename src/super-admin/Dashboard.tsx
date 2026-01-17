import { Users, Shield, BarChart3, Settings, AlertCircle, Activity } from "lucide-react";

export const Dashboard = () => {
  const stats = [
    { title: "Total Users", value: "5,234", icon: Users, color: "bg-blue-500" },
    { title: "System Health", value: "98%", icon: Activity, color: "bg-emerald-500" },
    { title: "Active Sessions", value: "1,203", icon: Shield, color: "bg-purple-500" },
    { title: "Security Alerts", value: "12", icon: AlertCircle, color: "bg-red-500" },
  ];

  const recentActivities = [
    { action: "User Registration", timestamp: "2024-01-15 14:30", severity: "Info" },
    { action: "Security Alert: Failed Login", timestamp: "2024-01-15 13:45", severity: "Warning" },
    { action: "Database Backup Completed", timestamp: "2024-01-15 12:00", severity: "Info" },
    { action: "System Update Applied", timestamp: "2024-01-14 18:30", severity: "Success" },
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Super Admin Dashboard</h1>
        
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
            <h2 className="text-lg font-semibold text-gray-900">System Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.severity === "Success"
                            ? "bg-green-100 text-green-800"
                            : activity.severity === "Warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : activity.severity === "Info"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {activity.severity}
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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">View and manage all users</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-500">Configure system parameters</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Reports</h3>
                <p className="text-sm text-gray-500">View system analytics</p>
              </div>
            </div>
          </button>
        </div>
    </div>
  );
};
