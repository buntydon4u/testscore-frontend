import { SuperAdminSidebar } from "../components/SuperAdminSidebar";
import { Topbar } from "../components/layout/Topbar";
import { authService } from "../services/auth";

export const SuperAdminLayout = ({ children }) => {
  const user = authService.getUser();
  const userName = user?.username || "User";
  const userRole = user?.role || "User";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SuperAdminSidebar />
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};