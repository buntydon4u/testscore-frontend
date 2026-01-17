import { PageWrapper } from "../components/layout/PageWrapper";
import { User, Mail, Phone, MapPin, Calendar, Award } from "lucide-react";

const Profile = () => {
  const teacherInfo = {
    name: "Jane Smith",
    email: "jane.smith@school.edu",
    phone: "+1 (555) 123-4567",
    department: "Mathematics",
    joinDate: "January 2020",
    experience: "8 years",
    subjects: ["Advanced Mathematics", "Calculus", "Statistics"],
    qualifications: ["M.Sc. Mathematics", "B.Ed.", "Teaching Certificate"],
    achievements: [
      "Teacher of the Year 2023",
      "Outstanding Performance Award",
      "Student Favorite Award"
    ]
  };

  return (
    <PageWrapper portal="teacher" userName="Jane Smith" userRole="Teacher">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Teacher Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{teacherInfo.name}</h2>
              <p className="text-gray-600">{teacherInfo.department} Teacher</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{teacherInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{teacherInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">Springfield High School</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">Joined {teacherInfo.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience & Qualifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Experience</p>
                  <p className="text-gray-900">{teacherInfo.experience}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Department</p>
                  <p className="text-gray-900">{teacherInfo.department}</p>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects Taught</h3>
              <div className="flex flex-wrap gap-2">
                {teacherInfo.subjects.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
              <div className="space-y-2">
                {teacherInfo.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{qual}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {teacherInfo.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;