import { Layout } from "@/components/Layout";
import { Search, Filter, Download } from "lucide-react";

export const Results = () => {
  const results = [
    { id: "RES001", student: "John Doe", exam: "Mathematics Final", score: "95%", date: "2024-01-15", status: "Passed" },
    { id: "RES002", student: "Jane Smith", exam: "Physics Midterm", score: "88%", date: "2024-01-18", status: "Passed" },
    { id: "RES003", student: "Mike Johnson", exam: "Chemistry Quiz", score: "72%", date: "2024-01-12", status: "Passed" },
    { id: "RES004", student: "Sarah Williams", exam: "Biology Test", score: "92%", date: "2024-01-20", status: "Passed" },
  ];

  return (
    <Layout role="admin" userName="System Administrator" userRole="Admin">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">View Results</h1>
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search results..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.exam}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{result.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
