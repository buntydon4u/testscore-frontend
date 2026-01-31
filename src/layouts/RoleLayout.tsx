import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { LayoutRegistry } from "./layoutRegistry";
import { authService } from "../services/auth";

interface RoleLayoutProps {
  children: ReactNode;
}

export const RoleLayout = ({ children }: RoleLayoutProps) => {
  const location = useLocation();
  const user = authService.getUser();

  let Layout;

  // Try to determine layout from user role first
  if (user?.role) {
    // Normalize the role - try both lowercase and uppercase versions
    const roleLower = user.role.toLowerCase().replace(/-/g, '_') as keyof typeof LayoutRegistry;
    const roleUpper = user.role.toUpperCase().replace(/-/g, '_') as keyof typeof LayoutRegistry;

    Layout = LayoutRegistry[roleLower] || LayoutRegistry[roleUpper];
  }

  // Fallback: determine layout from current path
  if (!Layout) {
    if (location.pathname.startsWith('/admin')) {
      Layout = LayoutRegistry.admin;
    } else if (location.pathname.startsWith('/super-admin')) {
      Layout = LayoutRegistry.super_admin;
    } else if (location.pathname.startsWith('/student')) {
      Layout = LayoutRegistry.student;
    } else if (location.pathname.startsWith('/teacher')) {
      Layout = LayoutRegistry.teacher;
    } else if (location.pathname.startsWith('/parent')) {
      Layout = LayoutRegistry.parent;
    } else if (location.pathname.startsWith('/guest')) {
      Layout = LayoutRegistry.guest;
    } else {
      Layout = LayoutRegistry.default;
    }
  }

  return <Layout>{children}</Layout>;
};