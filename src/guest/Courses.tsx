import { BookOpen } from "lucide-react";
import { Layout } from "@/components/layout";

export const Courses = () => {
  const availableCourses = [
    { name: "Introduction to Mathematics", level: "Beginner", lessons: 12, status: "Available" },
    { name: "Basic Science", level: "Beginner", lessons: 8, status: "Available" },
    { name: "English Fundamentals", level: "Beginner", lessons: 10, status: "Available" },
    { name: "History Basics", level: "Beginner", lessons: 6, status: "Available" },
    { name: "Geography Essentials", level: "Beginner", lessons: 9, status: "Available" },
    { name: "Computer Science Basics", level: "Beginner", lessons: 15, status: "Available" },
  ];

  return (
    <Layout role="guest" userName="Guest User" userRole="Guest">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These are preview courses. To access full content and features,
            <a href="#" className="underline ml-1">register or sign up</a> for a full account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-500">{course.level}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.lessons} lessons</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Status: {course.status}</span>
              </div>
              <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                Preview Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};