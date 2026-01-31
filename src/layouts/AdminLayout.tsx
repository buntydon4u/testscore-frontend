import { ReactNode } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Topbar } from "../components/layout/Topbar";
import { authService } from "../services/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const user = authService.getUser();
  const userName = user?.username || "User";
  const userRole = user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};