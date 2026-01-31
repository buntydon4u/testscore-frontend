import { ReactNode } from "react";
import { TeacherSidebar } from "../components/TeacherSidebar";
import { Topbar } from "../components/layout/Topbar";
import { authService } from "../services/auth";

interface TeacherLayoutProps {
  children: ReactNode;
}

export const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  const user = authService.getUser();
  const userName = user?.username || "User";
  const userRole = user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
