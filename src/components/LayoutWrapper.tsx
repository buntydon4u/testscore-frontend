import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { Topbar } from "./layout/Topbar";
import { authService } from "@/services/auth";

interface LayoutWrapperProps {
  children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const user = authService.getUser();
  const role = user?.role?.toLowerCase().replace('_', '-');

  const userName = user?.username || "User";
  const userRole = user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {role === "super-admin" ? <SuperAdminSidebar /> : <AdminSidebar />}
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};