import { FileText } from "lucide-react";
import { Layout } from "@/components/Layout";

export const FreeTests = () => {
  const freeTests = [
    { name: "Mathematics Practice Test", subject: "Math", duration: "30 min", attempts: "Unlimited" },
    { name: "Science Quiz", subject: "Science", duration: "20 min", attempts: "3 left" },
    { name: "English Grammar Test", subject: "English", duration: "25 min", attempts: "Unlimited" },
    { name: "History Knowledge Check", subject: "History", duration: "15 min", attempts: "5 left" },
    { name: "Geography Challenge", subject: "Geography", duration: "35 min", attempts: "Unlimited" },
    { name: "Computer Science Basics", subject: "CS", duration: "40 min", attempts: "2 left" },
  ];

  return (
    <Layout role="guest" userName="Guest User" userRole="Guest">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Free Practice Tests</h1>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800">
            <strong>Try our free tests!</strong> These practice tests are available for preview.
            To unlock full access and detailed results, <a href="#" className="underline ml-1">register or sign up</a>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeTests.map((test, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-gray-500">{test.subject}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Duration: {test.duration}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Attempts: {test.attempts}</span>
              </div>
              <button className="w-full bg-emerald-50 text-emerald-600 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};