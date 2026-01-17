import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleLayout } from "./layouts/RoleLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { Students as AdminStudents } from "./admin/Students";
import { Teachers } from "./pages/Teachers";
import { Exams } from "./pages/Exams";
import { Results } from "./pages/Results";
import { Courses } from "./pages/Courses";
import { Attendance } from "./pages/Attendance";
import { Schedule } from "./pages/Schedule";
import { Settings } from "./pages/Settings";
import { IllustrationPanel } from "./sections/IllustrationPanel";
import StudentProfile from "./student/Profile";
import { Dashboard as StudentDashboard } from "./student/Dashboard";
import { ChangePassword as StudentChangePassword } from "./student/ChangePassword";
import { ExamResult as StudentExamResult } from "./student/ExamResult";
import { FreeCompleteExam as StudentFreeCompleteExam } from "./student/FreeCompleteExam";
import { FreeSectionTest as StudentFreeSectionTest } from "./student/FreeSectionTest";
import { FreeTopicTest as StudentFreeTopicTest } from "./student/FreeTopicTest";
import { PurchasedPackages as StudentPurchasedPackages } from "./student/PurchasedPackages";
import { ScheduledExams as StudentScheduledExams } from "./student/ScheduledExams";
import { TestInProgress as StudentTestInProgress } from "./student/TestInProgress";
import { Transactions as StudentTransactions } from "./student/Transactions";
import { Dashboard as TeacherDashboard } from "./teacher/Dashboard";
import TeacherProfile from "./teacher/Profile";
import { ChangePassword as TeacherChangePassword } from "./teacher/ChangePassword";
import { ExamResults as TeacherExamResults } from "./teacher/ExamResults";
import { ScheduledTests as TeacherScheduledTests } from "./teacher/ScheduledTests";
import { Transactions as TeacherTransactions } from "./teacher/Transactions";
import { ViewAll as TeacherManageStudents } from "./teacher/ManageStudents/ViewAll";
import { ViewAll as TeacherManageExams } from "./teacher/ManageExams/ViewAll";
import { ViewAll as TeacherManageSections } from "./teacher/ManageSectionTopic/ViewAll";
import { Dashboard as SuperAdminDashboard } from "./super-admin/Dashboard";
import { Users as SuperAdminUsers } from "./super-admin/Users";
import { SystemConfig as SuperAdminSystemConfig } from "./super-admin/SystemConfig";
import { AuditLog as SuperAdminAuditLog } from "./super-admin/AuditLog";
import { Security as SuperAdminSecurity } from "./super-admin/Security";
import { Analytics as SuperAdminAnalytics } from "./super-admin/Analytics";
import { ChangePassword as SuperAdminChangePassword } from "./super-admin/ChangePassword";
import { Dashboard as AdminDashboard } from "./admin/Dashboard";
import { ChangePassword as AdminChangePassword } from "./admin/ChangePassword";
import { SystemConfig as AdminSystemConfig } from "./admin/SystemConfig";
import { Exams as AdminExams } from "./admin/Exams";
import { Dashboard as ParentDashboard } from "./parent/Dashboard";
import ParentChildren from "./parent/Children";
import ParentProgress from "./parent/Progress";
import ParentReports from "./parent/Reports";
import ParentNotifications from "./parent/Notifications";
import ParentChangePassword from "./parent/ChangePassword";
import { Dashboard as GuestDashboard } from "./guest/Dashboard";
import { Courses as GuestCourses } from "./guest/Courses";
import { FreeTests as GuestFreeTests } from "./guest/FreeTests";
import { ForgotPassword } from "./pages/ForgotPassword";
import { authService } from "./services/auth";

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="students" element={<AdminStudents />} />
    <Route path="exams" element={<AdminExams />} />
    <Route path="courses" element={<Courses />} />
    <Route path="results" element={<Results />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="system-config" element={<AdminSystemConfig />} />
    <Route path="settings" element={<Settings />} />
    <Route path="change-password" element={<AdminChangePassword />} />
  </Routes>
);

const SuperAdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<SuperAdminDashboard />} />
    <Route path="users" element={<SuperAdminUsers />} />
    <Route path="students" element={<AdminStudents />} />
    <Route path="exams" element={<AdminExams />} />
    <Route path="courses" element={<Courses />} />
    <Route path="results" element={<Results />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="system-config" element={<SuperAdminSystemConfig />} />
    <Route path="settings" element={<Settings />} />
    <Route path="audit-log" element={<SuperAdminAuditLog />} />
    <Route path="security" element={<SuperAdminSecurity />} />
    <Route path="change-password" element={<SuperAdminChangePassword />} />
  </Routes>
);

const StudentRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<StudentDashboard />} />
    <Route path="profile" element={<StudentProfile />} />
    <Route path="change-password" element={<StudentChangePassword />} />
    <Route path="exam-result" element={<StudentExamResult />} />
    <Route path="complete-exam" element={<StudentFreeCompleteExam />} />
    <Route path="section-test" element={<StudentFreeSectionTest />} />
    <Route path="topic-test" element={<StudentFreeTopicTest />} />
    <Route path="purchased-packages" element={<StudentPurchasedPackages />} />
    <Route path="scheduled-exams" element={<StudentScheduledExams />} />
    <Route path="test-in-progress" element={<StudentTestInProgress />} />
    <Route path="transactions" element={<StudentTransactions />} />
  </Routes>
);

const TeacherRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<TeacherDashboard />} />
    <Route path="profile" element={<TeacherProfile />} />
    <Route path="students/view" element={<TeacherManageStudents />} />
    <Route path="students" element={<AdminStudents />} />
    <Route path="exams/view" element={<TeacherManageExams />} />
    <Route path="exams" element={<AdminExams />} />
    <Route path="courses" element={<Courses />} />
    <Route path="results" element={<Results />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="sections/view" element={<TeacherManageSections />} />
    <Route path="change-password" element={<TeacherChangePassword />} />
    <Route path="exam-results" element={<TeacherExamResults />} />
    <Route path="scheduled-tests" element={<TeacherScheduledTests />} />
    <Route path="transactions" element={<TeacherTransactions />} />
    <Route path="analytics" element={<Analytics />} />
  </Routes>
);

const ParentRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<ParentDashboard />} />
    <Route path="children" element={<ParentChildren />} />
    <Route path="progress" element={<ParentProgress />} />
    <Route path="reports" element={<ParentReports />} />
    <Route path="notifications" element={<ParentNotifications />} />
    <Route path="change-password" element={<ParentChangePassword />} />
  </Routes>
);

const GuestRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<GuestDashboard />} />
    <Route path="courses" element={<GuestCourses />} />
    <Route path="free-tests" element={<GuestFreeTests />} />
  </Routes>
);

// Component to redirect authenticated users away from login/register pages
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes: Record<string, string> = {
      ADMIN: '/admin/dashboard',
      SUPER_ADMIN: '/super-admin/dashboard',
      STUDENT: '/student/dashboard',
      TEACHER: '/teacher/dashboard',
      PARENT: '/parent/dashboard',
      GUEST: '/guest/dashboard',
    };
    
    const redirectPath = roleRoutes[user.role] || '/admin/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export const App = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Attempt to logout on page unload (browser close/crash)
      // Note: This may not always execute, especially on crashes
      if (authService.isAuthenticated()) {
        // Use sendBeacon for reliable delivery during unload
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const data = JSON.stringify({ refreshToken });
          navigator.sendBeacon('/api/auth/logout', data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                <IllustrationPanel />
                <Login />
              </div>
            </PublicRoute>
          }
        />

        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />

        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['ADMIN']}><RoleLayout><AdminRoutes /></RoleLayout></ProtectedRoute>} />
        <Route path="/super-admin/*" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><RoleLayout><SuperAdminRoutes /></RoleLayout></ProtectedRoute>} />
        <Route path="/student/*" element={<ProtectedRoute allowedRoles={['STUDENT']}><RoleLayout><StudentRoutes /></RoleLayout></ProtectedRoute>} />
        <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['TEACHER']}><RoleLayout><TeacherRoutes /></RoleLayout></ProtectedRoute>} />
        <Route path="/parent/*" element={<ProtectedRoute allowedRoles={['PARENT']}><RoleLayout><ParentRoutes /></RoleLayout></ProtectedRoute>} />
        <Route path="/guest/*" element={<ProtectedRoute allowedRoles={['GUEST']}><RoleLayout><GuestRoutes /></RoleLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
