import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarLinks } from "@/config/sidebarLinks";
import { authService } from "@/services/auth";
import {
  LayoutDashboard,
  User,
  Package,
  Calendar,
  PlayCircle,
  Target,
  Square,
  Clock,
  Award,
  CreditCard,
  Lock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FileText,
  BookOpen,
  LogOut,
  Users,
  Settings,
  BarChart3,
  Shield,
  AlertCircle,
  Activity,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

type UserRole = "student" | "teacher" | "admin" | "super-admin" | "parent" | "guest";

interface SidebarProps {
  role?: UserRole;
  portal?: "student" | "teacher" | "parent";
}

export const Sidebar = ({ role, portal }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/', { replace: true });
  };

  const getMenuItems = (): Array<{ path: string; icon: any; label: string }> => {
    const user = authService.getUser();
    const role = user?.role || 'STUDENT';
    const roleLinks = sidebarLinks[role as keyof typeof sidebarLinks] || sidebarLinks.ADMIN;
    return [...roleLinks, ...sidebarLinks.SHARED];
  };

  const getRoleLabel = (): string => {
    const user = authService.getUser();
    const role = user?.role || 'STUDENT';
    console.log('role======>', role);
    switch (role) {
      case "STUDENT":
        return "Student Portal";
      case "TEACHER":
        return "Teacher Portal";
      case "ADMIN":
        return "Admin Portal";
      case "SUPER_ADMIN":
        return "Super Admin";
      case "PARENT":
        return "Parent Portal";
      case "GUEST":
        return "Guest Portal";
      default:
        return "Portal";
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`bg-slate-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col z-50`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">{getRoleLabel()}</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-emerald-500 text-white"
                : "text-gray-300 hover:bg-slate-700"
            }`}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={() => {
            handleLogout();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
