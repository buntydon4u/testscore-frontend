import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "./services/auth";
import { PublicRoute } from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleLayout } from "./layouts/RoleLayout";
import { TeacherLayout } from "./layouts/TeacherLayout";

// Import all page components
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { IllustrationPanel } from "./sections/IllustrationPanel";

// Admin Components
import { Dashboard as AdminDashboard } from "./admin/Dashboard";
import { Users as AdminUsers } from "./super-admin/Users";
import { Students as AdminStudents } from "./admin/Students";
import { ExamList as AdminExams } from "./admin/ExamList";
import { CreateExam as AdminCreateExam } from "./admin/CreateExam";
import { ExamDetailView as AdminExamDetail } from "./admin/ExamDetailView";
import { ManageSchedules as AdminManageSchedules } from "./admin/ManageSchedules";
import { Courses } from "./admin/Courses";
import { Results } from "./admin/Results";
import { Attendance } from "./pages/Attendance";
import { Schedule } from "./pages/Schedule";
import { Analytics } from "./admin/Analytics";
import { SystemConfig as AdminSystemConfig } from "./admin/SystemConfig";
import { Settings } from "./admin/Settings";
import { ChangePassword as AdminChangePassword } from "./admin/ChangePassword";
import { PackageManagement } from "./pages/PackageManagement";
import { StreamManagement } from "./components/Streams/StreamManagement";
import { SubjectManagement } from "./components/Subjects/SubjectManagement";
import { OrderManagement } from "./pages/OrderManagement";

// Super Admin Components
import { Users as SuperAdminUsers } from "./super-admin/Users";
import { SystemConfig as SuperAdminSystemConfig } from "./super-admin/SystemConfig";
import { AuditLog as SuperAdminAuditLog } from "./super-admin/AuditLog";
import { Security as SuperAdminSecurity } from "./super-admin/Security";
import { ChangePassword as SuperAdminChangePassword } from "./super-admin/ChangePassword";

// Teacher Components
import { Dashboard as TeacherDashboard } from "./teacher/Dashboard";
import TeacherProfile from "./teacher/Profile";
import { Teachers as TeacherStudents } from "./pages/Teachers";
import { Courses as TeacherClasses } from "./pages/Courses";
import { Schedule as TeacherSchedule } from "./pages/Schedule";
import { CreateExam as TeacherCreateExam } from "./teacher/CreateExam";
import { ExamList as TeacherMyExams } from "./teacher/ExamList";
import { ExamDetailView as TeacherExamDetail } from "./teacher/ExamDetailView";
import { ManageSchedules as TeacherManageSchedules } from "./teacher/ManageSchedules";
import { ScheduledTests as TeacherScheduledTests } from "./teacher/ScheduledTests";
import { ExamResults as TeacherExamResults } from "./teacher/ExamResults";
import { Results as TeacherResults } from "./pages/Results";
import { Analytics as TeacherAnalytics } from "./pages/Analytics";
import { Attendance as TeacherAttendance } from "./pages/Attendance";
import { Teachers as TeacherEarnings } from "./pages/Teachers";
import { Transactions as TeacherTransactions } from "./teacher/Transactions";
import { ChangePassword as TeacherChangePassword } from "./teacher/ChangePassword";
import { ViewAll as TeacherManageSections } from "./teacher/ManageSectionTopic/ViewAll";
import { Courses as TeacherMyCourses } from "./pages/Courses";
import { Courses as TeacherCreateContent } from "./pages/Courses";

// Student Components
import { Dashboard as StudentDashboard } from "./student/Dashboard";
import StudentProfile from "./student/Profile";
import { ChangePassword as StudentChangePassword } from "./student/ChangePassword";
import { ExamResult as StudentExamResult } from "./student/ExamResult";
import { FreeCompleteExam as StudentFreeCompleteExam } from "./student/FreeCompleteExam";
import { FreeSectionTest as StudentFreeSectionTest } from "./student/FreeSectionTest";
import { FreeTopicTest as StudentFreeTopicTest } from "./student/FreeTopicTest";
import { StudentPackages } from "./pages/StudentPackages";
import { ScheduledExams as StudentScheduledExams } from "./student/ScheduledExams";
import { TestInProgress as StudentTestInProgress } from "./student/TestInProgress";
import { Transactions as StudentTransactions } from "./student/Transactions";
import { AvailableExams as StudentAvailableExams } from "./student/AvailableExams";
import { UpcomingExams as StudentUpcomingExams } from "./student/UpcomingExams";
import { ExamDetail as StudentExamDetail } from "./student/ExamDetail";
import { ExamHistory as StudentExamHistory } from "./student/ExamHistory";

// Parent Components
import { Dashboard as ParentDashboard } from "./parent/Dashboard";
import ParentChildren from "./parent/Children";
import ParentProgress from "./parent/Progress";
import ParentReports from "./parent/Reports";
import ParentNotifications from "./parent/Notifications";
import ParentChangePassword from "./parent/ChangePassword";

// Guest Components
import { Dashboard as GuestDashboard } from "./guest/Dashboard";
import { Courses as GuestCourses } from "./guest/Courses";
import { FreeTests as GuestFreeTests } from "./guest/FreeTests";

// Role-based route components
const AdminRoutes = () => (
  <Routes>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="students" element={<AdminStudents />} />
    <Route path="create-exam" element={<AdminCreateExam />} />
    <Route path="exams" element={<AdminExams />} />
    <Route path="courses" element={<Courses />} />
    <Route path="results" element={<Results />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="system-config" element={<AdminSystemConfig />} />
    <Route path="settings" element={<Settings />} />
    <Route path="change-password" element={<AdminChangePassword />} />
    <Route path="packages" element={<PackageManagement />} />
    <Route path="streams" element={<StreamManagement />} />
    <Route path="subjects" element={<SubjectManagement />} />
    <Route path="orders" element={<OrderManagement />} />
    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

const SuperAdminRoutes = () => (
  <Routes>
    <Route index element={<SuperAdminUsers />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<SuperAdminUsers />} />
    <Route path="system-config" element={<SuperAdminSystemConfig />} />
    <Route path="audit-log" element={<SuperAdminAuditLog />} />
    <Route path="security" element={<SuperAdminSecurity />} />
    <Route path="packages" element={<PackageManagement />} />
    <Route path="streams" element={<StreamManagement />} />
    <Route path="subjects" element={<SubjectManagement />} />
    <Route path="orders" element={<OrderManagement />} />
    <Route path="change-password" element={<SuperAdminChangePassword />} />
    <Route path="*" element={<Navigate to="/super-admin/users" replace />} />
  </Routes>
);

const TeacherRoutes = () => (
  <Routes>
    <Route index element={<TeacherDashboard />} />
    <Route path="dashboard" element={<TeacherDashboard />} />
    <Route path="profile" element={<TeacherProfile />} />
    <Route path="my-students" element={<TeacherStudents />} />
    <Route path="classes" element={<TeacherClasses />} />
    <Route path="schedule" element={<TeacherSchedule />} />
    <Route path="create-exam" element={<TeacherCreateExam />} />
    <Route path="my-exams" element={<TeacherMyExams />} />
    <Route path="exam/:id" element={<TeacherExamDetail />} />
    <Route path="exam/:id/schedules" element={<TeacherManageSchedules />} />
    <Route path="scheduled-tests" element={<TeacherScheduledTests />} />
    <Route path="exam-results" element={<TeacherExamResults />} />
    <Route path="results" element={<TeacherResults />} />
    <Route path="analytics" element={<TeacherAnalytics />} />
    <Route path="attendance" element={<TeacherAttendance />} />
    <Route path="earnings" element={<TeacherEarnings />} />
    <Route path="transactions" element={<TeacherTransactions />} />
    <Route path="change-password" element={<TeacherChangePassword />} />
    <Route path="manage-sections" element={<TeacherManageSections />} />
    <Route path="my-courses" element={<TeacherMyCourses />} />
    <Route path="create-content" element={<TeacherCreateContent />} />
    <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
  </Routes>
);

const StudentRoutes = () => (
  <Routes>
    <Route index element={<StudentDashboard />} />
    <Route path="dashboard" element={<StudentDashboard />} />
    <Route path="profile" element={<StudentProfile />} />
    <Route path="change-password" element={<StudentChangePassword />} />
    <Route path="exam-result" element={<StudentExamResult />} />
    <Route path="complete-exam" element={<StudentFreeCompleteExam />} />
    <Route path="section-test" element={<StudentFreeSectionTest />} />
    <Route path="topic-test" element={<StudentFreeTopicTest />} />
    <Route path="packages" element={<StudentPackages />} />
    <Route path="purchased-packages" element={<StudentPackages />} />
    <Route path="scheduled-exams" element={<StudentScheduledExams />} />
    <Route path="test-in-progress" element={<StudentTestInProgress />} />
    <Route path="transactions" element={<StudentTransactions />} />
    <Route path="available-exams" element={<StudentAvailableExams />} />
    <Route path="upcoming-exams" element={<StudentUpcomingExams />} />
    <Route path="exam-history" element={<StudentExamHistory />} />
    <Route path="exam/:id" element={<StudentExamDetail />} />
    <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
  </Routes>
);

const ParentRoutes = () => (
  <Routes>
    <Route index element={<ParentDashboard />} />
    <Route path="dashboard" element={<ParentDashboard />} />
    <Route path="children" element={<ParentChildren />} />
    <Route path="progress" element={<ParentProgress />} />
    <Route path="reports" element={<ParentReports />} />
    <Route path="notifications" element={<ParentNotifications />} />
    <Route path="change-password" element={<ParentChangePassword />} />
    <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
  </Routes>
);

const GuestRoutes = () => (
  <Routes>
    <Route index element={<GuestDashboard />} />
    <Route path="dashboard" element={<GuestDashboard />} />
    <Route path="courses" element={<GuestCourses />} />
    <Route path="free-tests" element={<GuestFreeTests />} />
    <Route path="*" element={<Navigate to="/guest/dashboard" replace />} />
  </Routes>
);

const AuthRedirect = () => {
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      const roleRoutes: Record<string, string> = {
        admin: '/admin/dashboard',
        super_admin: '/super-admin/users',
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        parent: '/parent/dashboard',
        guest: '/guest/dashboard',
      };
      
      const redirectPath = roleRoutes[user?.role || 'GUEST'];
      window.location.replace(redirectPath);
    }
  }, []);

  return <div>Loading...</div>;
};

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      console.log('🔐 Checking authentication status:', authStatus);
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (authService.isAuthenticated()) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const data = JSON.stringify({ refreshToken });
          navigator.sendBeacon('/api/auth/logout', data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
};

const AppWithRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthRedirect />} />
      <Route 
        path="/login" 
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

      {/* Protected Routes with Role-based Layouts */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <RoleLayout>
              <AdminRoutes />
            </RoleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <RoleLayout>
              <SuperAdminRoutes />
            </RoleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <RoleLayout>
              <StudentRoutes />
            </RoleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLayout>
              <TeacherRoutes />
            </TeacherLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/*"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <RoleLayout>
              <ParentRoutes />
            </RoleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/guest/*"
        element={
          <ProtectedRoute allowedRoles={['guest']}>
            <RoleLayout>
              <GuestRoutes />
            </RoleLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
