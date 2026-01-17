import { ReactNode } from "react";
import { StudentSidebar } from "../components/StudentSidebar";
import { Topbar } from "../components/layout/Topbar";
import { authService } from "../services/auth";

interface StudentLayoutProps {
  children: ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
  const user = authService.getUser();
  const userName = user?.username || "User";
  const userRole = user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
