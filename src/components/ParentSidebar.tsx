import { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sidebarLinks, SidebarLink } from "@/config/sidebarLinks";
import { ChevronLeft, ChevronRight, GraduationCap, LogOut } from "lucide-react";
import { authService } from '../services/auth';

export const ParentSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/', { replace: true });
  };

  const menuItems: SidebarLink[] = sidebarLinks.PARENT;

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
            <span className="font-bold text-lg">Parent</span>
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
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors w-full"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
