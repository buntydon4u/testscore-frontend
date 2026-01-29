import { ReactNode } from "react";
import { GenericSidebar } from "../components/GenericSidebar";
import { Topbar } from "../components/layout/Topbar";
import { authService } from "../services/auth";

interface GenericLayoutProps {
  children: ReactNode;
}

export const GenericLayout = ({ children }: GenericLayoutProps) => {
  const user = authService.getUser();
  const userName = user?.username || "User";
  const userRole = user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <GenericSidebar />
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
