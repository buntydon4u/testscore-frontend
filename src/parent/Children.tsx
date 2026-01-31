import { PageWrapper } from "../components/layout/PageWrapper";
import { User, Mail, Phone, Calendar, Award, TrendingUp, BookOpen, Clock } from "lucide-react";

const Children = () => {
  const children = [
    {
      id: "ST001",
      name: "Emma Johnson",
      grade: "10th Grade",
      avatar: "EJ",
      email: "emma.johnson@school.edu",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "2008-05-15",
      enrollmentDate: "2022-08-15",
      performance: {
        overallGrade: "A-",
        attendance: "96%",
        gpa: 3.8,
        subjects: 8
      },
      recentActivity: [
        { type: "exam", title: "Mathematics Final", score: "94%", date: "2024-01-15" },
        { type: "assignment", title: "Physics Lab Report", status: "Submitted", date: "2024-01-12" },
        { type: "achievement", title: "Science Fair Winner", date: "2024-01-10" }
      ],
      upcomingEvents: [
        { title: "Chemistry Quiz", date: "2024-01-20", time: "10:00 AM" },
        { title: "Parent-Teacher Meeting", date: "2024-01-25", time: "3:00 PM" }
      ]
    },
    {
      id: "ST002",
      name: "Michael Johnson",
      grade: "8th Grade",
      avatar: "MJ",
      email: "michael.johnson@school.edu",
      phone: "+1 (555) 123-4568",
      dateOfBirth: "2010-03-22",
      enrollmentDate: "2022-08-15",
      performance: {
        overallGrade: "B+",
        attendance: "89%",
        gpa: 3.2,
        subjects: 7
      },
      recentActivity: [
        { type: "exam", title: "English Literature Test", score: "82%", date: "2024-01-14" },
        { type: "assignment", title: "Science Project", status: "In Progress", date: "2024-01-11" },
        { type: "achievement", title: "Reading Challenge Complete", date: "2024-01-08" }
      ],
      upcomingEvents: [
        { title: "Mathematics Test", date: "2024-01-22", time: "9:00 AM" },
        { title: "School Sports Day", date: "2024-01-28", time: "8:00 AM" }
      ]
    }
  ];

  return (
    <PageWrapper portal="parent" userName="Parent User" userRole="Parent">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">View Children</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-lg shadow">
              {/* Child Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-emerald-600">{child.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{child.name}</h2>
                    <p className="text-gray-600">{child.grade}</p>
                    <p className="text-sm text-gray-500">ID: {child.id}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{child.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{child.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{child.performance.overallGrade}</p>
                    <p className="text-sm text-gray-600">Grade</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{child.performance.attendance}</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{child.performance.gpa}</p>
                    <p className="text-sm text-gray-600">GPA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{child.performance.subjects}</p>
                    <p className="text-sm text-gray-600">Subjects</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {child.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {activity.type === "exam" && <Award className="w-5 h-5 text-green-500" />}
                      {activity.type === "assignment" && <BookOpen className="w-5 h-5 text-blue-500" />}
                      {activity.type === "achievement" && <TrendingUp className="w-5 h-5 text-yellow-500" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      {activity.score && (
                        <span className="text-sm font-semibold text-green-600">{activity.score}</span>
                      )}
                      {activity.status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === "Submitted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {activity.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {child.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Children;