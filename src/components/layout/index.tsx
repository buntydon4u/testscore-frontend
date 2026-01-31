import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { authService } from "@/services/auth";

type UserRole = "student" | "teacher" | "admin" | "super-admin" | "parent" | "guest";

interface LayoutProps {
  children: ReactNode;
  userName?: string;
  userRole?: string;
}

export const Layout = ({ children, userName, userRole }: LayoutProps) => {
  const user = authService.getUser();

  const role = user ? user.role.toLowerCase().replace('_', '-') as UserRole : "student";
  const determinedUserName = userName || user?.username || "User";
  const determinedUserRole = userRole || user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1 ml-64">
        <Topbar userName={determinedUserName} userRole={determinedUserRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
