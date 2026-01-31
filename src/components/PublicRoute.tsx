import { Navigate } from "react-router-dom";
import { authService } from "../services/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
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
