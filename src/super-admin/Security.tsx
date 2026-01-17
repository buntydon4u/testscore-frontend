import { Shield, AlertTriangle, Lock, Eye, Ban, CheckCircle } from "lucide-react";

export const Security = () => {
  const securityAlerts = [
    {
      id: 1,
      type: "Failed Login",
      severity: "High",
      message: "Multiple failed login attempts from IP 203.0.113.45",
      timestamp: "2024-01-15 14:30:00",
      status: "Active"
    },
    {
      id: 2,
      type: "Suspicious Activity",
      severity: "Medium",
      message: "Unusual login pattern detected for user teacher1@testscore.com",
      timestamp: "2024-01-15 13:45:00",
      status: "Investigating"
    },
    {
      id: 3,
      type: "Password Change",
      severity: "Low",
      message: "Password changed for admin account",
      timestamp: "2024-01-15 12:00:00",
      status: "Resolved"
    }
  ];

  const securityStats = [
    { title: "Active Threats", value: "3", icon: AlertTriangle, color: "bg-red-500" },
    { title: "Blocked IPs", value: "12", icon: Ban, color: "bg-orange-500" },
    { title: "Security Events", value: "156", icon: Shield, color: "bg-blue-500" },
    { title: "Resolved Issues", value: "89", icon: CheckCircle, color: "bg-green-500" }
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Dashboard</h1>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityStats.map((stat, index) => (
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

        {/* Security Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-lg">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Block IP Address</h3>
                <p className="text-sm text-gray-500">Add IP to blacklist</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Security Logs</h3>
                <p className="text-sm text-gray-500">Detailed security events</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-500">Configure security policies</p>
              </div>
            </div>
          </button>
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Security Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {securityAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          alert.severity === "High"
                            ? "bg-red-100 text-red-800"
                            : alert.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{alert.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          alert.status === "Active"
                            ? "bg-red-100 text-red-800"
                            : alert.status === "Investigating"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-emerald-600 hover:text-emerald-900 mr-3">Resolve</button>
                      <button className="text-blue-600 hover:text-blue-900">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};