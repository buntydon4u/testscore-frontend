import { Search, Download, Filter, Calendar, User, Activity } from "lucide-react";

export const AuditLog = () => {
  const auditEntries = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      user: "admin@testscore.com",
      action: "User Login",
      resource: "Authentication",
      ip: "192.168.1.100",
      status: "Success"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:25:10",
      user: "student1@testscore.com",
      action: "Exam Started",
      resource: "Mathematics Exam",
      ip: "192.168.1.101",
      status: "Success"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:20:45",
      user: "teacher1@testscore.com",
      action: "Exam Created",
      resource: "Physics Final Exam",
      ip: "192.168.1.102",
      status: "Success"
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:15:30",
      user: "unknown",
      action: "Failed Login Attempt",
      resource: "Authentication",
      ip: "203.0.113.45",
      status: "Failed"
    },
    {
      id: 5,
      timestamp: "2024-01-15 14:10:15",
      user: "admin@testscore.com",
      action: "User Role Changed",
      resource: "User Management",
      ip: "192.168.1.100",
      status: "Success"
    }
  ];

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search user..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">All Actions</option>
                  <option value="login">Login</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.resource}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.status === "Success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1 to 5 of 1,234 entries
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1 bg-emerald-500 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};