import { AdminLayout } from "./AdminLayout";
import { SuperAdminLayout } from "./SuperAdminLayout";
import { authService } from "../services/auth";

export const RoleLayout = ({ children }) => {
  const user = authService.getUser();
  const role = user?.role?.toLowerCase().replace('_', '-');

  if (role === "super-admin") {
    return <SuperAdminLayout>{children}</SuperAdminLayout>;
  } else {
    return <AdminLayout>{children}</AdminLayout>;
  }
};