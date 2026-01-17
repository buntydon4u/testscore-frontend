import { TrendingUp, Users, Server, Activity, Database, Shield, ArrowUp, ArrowDown, Globe } from "lucide-react";

export const Analytics = () => {
  const systemMetrics = [
    { title: "Total Users", value: "5,234", change: "+15%", trend: "up", icon: Users },
    { title: "System Uptime", value: "99.9%", change: "+0.1%", trend: "up", icon: Server },
    { title: "Active Sessions", value: "1,203", change: "+8%", trend: "up", icon: Activity },
    { title: "Database Queries", value: "45.2K", change: "+12%", trend: "up", icon: Database },
    { title: "Security Events", value: "156", change: "-5%", trend: "down", icon: Shield },
    { title: "API Requests", value: "892K", change: "+22%", trend: "up", icon: Globe },
  ];

  const performanceData = [
    { metric: "Response Time", value: 245, unit: "ms", status: "Good" },
    { metric: "CPU Usage", value: 67, unit: "%", status: "Normal" },
    { metric: "Memory Usage", value: 78, unit: "%", status: "Warning" },
    { metric: "Disk Usage", value: 45, unit: "%", status: "Good" },
  ];

  const userActivity = [
    { time: "00:00", users: 120 },
    { time: "04:00", users: 80 },
    { time: "08:00", users: 450 },
    { time: "12:00", users: 890 },
    { time: "16:00", users: 720 },
    { time: "20:00", users: 380 },
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">System Analytics</h1>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h2>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{item.value}{item.unit}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "Good"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Normal"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === "Good"
                          ? "bg-green-500"
                          : item.status === "Normal"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Activity (24h)</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {userActivity.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-emerald-500 rounded-t w-full mb-2"
                    style={{ height: `${(data.users / 1000) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{data.time}</span>
                  <span className="text-xs font-semibold text-gray-700">{data.users}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent System Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent System Events</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Database backup completed</p>
                <p className="text-xs text-gray-500">Automated backup finished successfully - 2 hours ago</p>
              </div>
              <span className="text-xs text-gray-400">14:30</span>
            </div>
            <div className="px-6 py-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Security scan completed</p>
                <p className="text-xs text-gray-500">No vulnerabilities found - 4 hours ago</p>
              </div>
              <span className="text-xs text-gray-400">12:15</span>
            </div>
            <div className="px-6 py-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">High memory usage detected</p>
                <p className="text-xs text-gray-500">Memory usage peaked at 85% - 6 hours ago</p>
              </div>
              <span className="text-xs text-gray-400">10:45</span>
            </div>
            <div className="px-6 py-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registrations</p>
                <p className="text-xs text-gray-500">45 new users registered in the last hour - 8 hours ago</p>
              </div>
              <span className="text-xs text-gray-400">08:30</span>
            </div>
          </div>
        </div>
    </div>
  );
};