import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/auth";
import { PublicRoute } from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleLayout } from "./layouts/RoleLayout";
import { TeacherLayout } from "./layouts/TeacherLayout";

// Public pages
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { IllustrationPanel } from "./sections/IllustrationPanel";

// Admin
import { Dashboard as AdminDashboard } from "./admin/Dashboard";
import { Users as AdminUsers } from "./super-admin/Users";
import { Students as AdminStudents } from "./admin/Students";
import { ExamList as AdminExams } from "./admin/ExamList";
import { CreateExam as AdminCreateExam } from "./admin/CreateExam";
import { ManageSchedules as AdminManageSchedules } from "./admin/ManageSchedules";
import { Courses } from "./admin/Courses";
import { Results } from "./admin/Results";
import { Analytics } from "./admin/Analytics";
import { SystemConfig as AdminSystemConfig } from "./admin/SystemConfig";
import { Settings } from "./admin/Settings";
import { ChangePassword as AdminChangePassword } from "./admin/ChangePassword";
import { PackageManagement } from "./pages/PackageManagement";
import { StreamManagement } from "./components/Streams/StreamManagement";
import { SubjectManagement } from "./components/Subjects/SubjectManagement";
import { OrderManagement } from "./pages/OrderManagement";

// Teacher
import { Dashboard as TeacherDashboard } from "./teacher/Dashboard";

// Student
import { Dashboard as StudentDashboard } from "./student/Dashboard";

// Parent
import { Dashboard as ParentDashboard } from "./parent/Dashboard";

// Guest
import { Dashboard as GuestDashboard } from "./guest/Dashboard";

/* ------------------------------------------------------------------ */
/* AUTH REDIRECT */
/* ------------------------------------------------------------------ */

const AuthRedirect = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const user = authService.getUser();

  const roleRoutes = {
    admin: "/admin/dashboard",
    super_admin: "/super-admin/users",
    student: "/student/dashboard",
    teacher: "/teacher/dashboard",
    parent: "/parent/dashboard",
    guest: "/guest/dashboard",
  };

  return <Navigate to={roleRoutes[user?.role || "guest"]} replace />;
};

/* ------------------------------------------------------------------ */
/* ROLE ROUTES */
/* ------------------------------------------------------------------ */

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

const TeacherRoutes = () => (
  <Routes>
    <Route index element={<TeacherDashboard />} />
    <Route path="dashboard" element={<TeacherDashboard />} />
    <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
  </Routes>
);

const StudentRoutes = () => (
  <Routes>
    <Route index element={<StudentDashboard />} />
    <Route path="dashboard" element={<StudentDashboard />} />
    <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
  </Routes>
);

const ParentRoutes = () => (
  <Routes>
    <Route index element={<ParentDashboard />} />
    <Route path="dashboard" element={<ParentDashboard />} />
    <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
  </Routes>
);

const GuestRoutes = () => (
  <Routes>
    <Route index element={<GuestDashboard />} />
    <Route path="dashboard" element={<GuestDashboard />} />
    <Route path="*" element={<Navigate to="/guest/dashboard" replace />} />
  </Routes>
);

/* ------------------------------------------------------------------ */
/* APP */
/* ------------------------------------------------------------------ */

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<AuthRedirect />} />

        {/* Public */}
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

        {/* Protected */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RoleLayout>
                <AdminRoutes />
              </RoleLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherLayout>
                <TeacherRoutes />
              </TeacherLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <RoleLayout>
                <StudentRoutes />
              </RoleLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent/*"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <RoleLayout>
                <ParentRoutes />
              </RoleLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest/*"
          element={
            <ProtectedRoute allowedRoles={["guest"]}>
              <RoleLayout>
                <GuestRoutes />
              </RoleLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
