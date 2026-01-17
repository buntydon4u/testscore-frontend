import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "@/services/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to user's own dashboard if they try to access unauthorized route
      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        SUPER_ADMIN: '/super-admin/dashboard',
        STUDENT: '/student/dashboard',
        TEACHER: '/teacher/dashboard',
        PARENT: '/parent/dashboard',
        GUEST: '/guest/dashboard',
      };
      
      const redirectPath = user ? roleRoutes[user.role] || '/' : '/';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};