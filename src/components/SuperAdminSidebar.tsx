import { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { superAdminLinks, isSidebarParent } from "@/config/sidebarLinks";
import { ChevronLeft, ChevronRight, GraduationCap, LogOut, Users, FileText, BookOpen, Award, Calendar, BarChart3, ChevronDown } from "lucide-react";
import { authService } from '../services/auth';

export const SuperAdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuExpanded = (label: string) => {
    if (isCollapsed) return false;
    return expandedMenus.includes(label);
  };

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
            <span className="font-bold text-lg">Super Admin</span>
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
        {superAdminLinks.map((item, index) => {
          if (isSidebarParent(item)) {
            // Render parent menu
            const isExpanded = isMenuExpanded(item.label);
            const hasActiveChild = item.children.some(child => 
              location.pathname === child.path
            );

            return (
              <div key={index}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    hasActiveChild
                      ? "bg-emerald-500 text-white"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm flex-1 text-left">{item.label}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} 
                      />
                    </>
                  )}
                </button>
                
                {/* Submenu */}
                {isExpanded && !isCollapsed && (
                  <div className="mt-1 mb-2">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.path}
                        className={`flex items-center gap-3 px-4 py-2 mx-2 ml-4 rounded-lg transition-colors ${
                          isActive(child.path)
                            ? "bg-emerald-600 text-white"
                            : "text-gray-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <child.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Render regular menu item
            return (
              <Link
                key={index}
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
            );
          }
        })}
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