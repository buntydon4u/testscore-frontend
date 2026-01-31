import { PageWrapper } from "../components/layout/PageWrapper";
import { TrendingUp, TrendingDown, Award, FileText, Calendar } from "lucide-react";

const Reports = () => {
  const childrenReports = [
    {
      name: "Emma Johnson",
      grade: "10th Grade",
      overallScore: 87,
      trend: "up",
      subjects: [
        { name: "Mathematics", score: 92, grade: "A", trend: "up" },
        { name: "Physics", score: 85, grade: "B+", trend: "up" },
        { name: "Chemistry", score: 88, grade: "A-", trend: "down" },
        { name: "Biology", score: 90, grade: "A", trend: "up" },
        { name: "English", score: 82, grade: "B", trend: "up" }
      ],
      recentExams: [
        { name: "Mid-term Mathematics", score: 94, date: "2024-01-15", maxScore: 100 },
        { name: "Physics Lab Assessment", score: 87, date: "2024-01-12", maxScore: 100 },
        { name: "Chemistry Quiz", score: 85, date: "2024-01-10", maxScore: 100 }
      ]
    },
    {
      name: "Michael Johnson",
      grade: "8th Grade",
      overallScore: 79,
      trend: "down",
      subjects: [
        { name: "Mathematics", score: 76, grade: "C+", trend: "down" },
        { name: "Science", score: 82, grade: "B", trend: "up" },
        { name: "English", score: 78, grade: "C+", trend: "up" },
        { name: "History", score: 81, grade: "B-", trend: "up" },
        { name: "Geography", score: 79, grade: "C+", trend: "down" }
      ],
      recentExams: [
        { name: "Mathematics Test", score: 74, date: "2024-01-14", maxScore: 100 },
        { name: "Science Project", score: 88, date: "2024-01-11", maxScore: 100 },
        { name: "English Essay", score: 82, date: "2024-01-08", maxScore: 100 }
      ]
    }
  ];

  return (
    <PageWrapper portal="parent" userName="Parent User" userRole="Parent">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Performance Reports</h1>

        {childrenReports.map((child, childIndex) => (
          <div key={childIndex} className="mb-8">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{child.name}</h2>
                  <p className="text-gray-600">{child.grade}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{child.overallScore}%</span>
                    {child.trend === "up" ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Overall Performance</p>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {child.subjects.map((subject, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{subject.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">{subject.score}%</span>
                          {subject.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Grade: {subject.grade}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${subject.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Exams */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Exams</h3>
                <div className="space-y-3">
                  {child.recentExams.map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{exam.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {exam.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{exam.score}/{exam.maxScore}</p>
                        <p className="text-sm text-gray-600">{Math.round((exam.score/exam.maxScore)*100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Reports;