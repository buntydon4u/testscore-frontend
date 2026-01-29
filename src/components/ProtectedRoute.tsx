import { Navigate } from "react-router-dom";
import { authService } from "../services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoleLower = user?.role?.toLowerCase();
  const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());
  const userRoleUpper = user?.role?.toUpperCase();
  const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());

  if (!user || (!allowedRolesLower.includes(userRoleLower) && !allowedRolesUpper.includes(userRoleUpper))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};