import { BookOpen, FileText, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

export const Dashboard = () => {
  const stats = [
    { title: "Available Courses", value: "45", icon: BookOpen, color: "bg-blue-500" },
    { title: "Free Tests", value: "128", icon: FileText, color: "bg-emerald-500" },
    { title: "Active Users", value: "15.2K", icon: Users, color: "bg-purple-500" },
    { title: "Access Duration", value: "30 days", icon: Clock, color: "bg-orange-500" },
  ];

  const availableCourses = [
    { name: "Introduction to Mathematics", level: "Beginner", lessons: 12, status: "Available" },
    { name: "Basic Science", level: "Beginner", lessons: 8, status: "Available" },
    { name: "English Fundamentals", level: "Beginner", lessons: 10, status: "Available" },
    { name: "History Basics", level: "Beginner", lessons: 6, status: "Available" },
  ];

  return (
    <Layout role="guest" userName="Guest User" userRole="Guest">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Guest Dashboard</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Welcome!</strong> You are currently using a guest account with limited access. 
            <a href="#" className="underline ml-1">Register or sign up</a> to unlock all features.
          </p>
        </div>

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
            <h2 className="text-lg font-semibold text-gray-900">Available Courses (Preview)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.lessons}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/guest/courses" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left block">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Courses</h3>
                <p className="text-sm text-gray-500">Explore available courses and preview content</p>
              </div>
            </div>
          </Link>

          <Link to="/guest/free-tests" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left block">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Take Free Test</h3>
                <p className="text-sm text-gray-500">Try a free practice test to get started</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
