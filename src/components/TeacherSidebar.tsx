import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Award,
  BarChart3,
  CreditCard,
  BookMarked,
  Target,
  Lock,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Beaker,
} from 'lucide-react';
import { authService } from '../services/auth';

const menuItems = [
  { path: "/teacher/dashboard", icon: Home, label: "Dashboard" },
  { path: "/teacher/profile", icon: User, label: "My Profile" },
  {
    label: "Teaching",
    icon: Users,
    children: [
      { path: "/teacher/my-students", icon: Users, label: "My Students" },
      { path: "/teacher/classes", icon: BookOpen, label: "My Classes" },
      { path: "/teacher/schedule", icon: Calendar, label: "Teaching Schedule" },
    ],
  },
  {
    label: "Exams & Tests",
    icon: FileText,
    children: [
      { path: "/teacher/create-exam", icon: FileText, label: "Create Exam" },
      { path: "/teacher/my-exams", icon: FileText, label: "My Exams" },
      { path: "/teacher/scheduled-tests", icon: Calendar, label: "Scheduled Tests" },
      { path: "/teacher/exam-results", icon: Award, label: "Grade Exams" },
    ],
  },
  {
    label: "Content",
    icon: BookMarked,
    children: [
      { path: "/teacher/streams", icon: Beaker, label: "View Streams" },
      { path: "/teacher/subjects", icon: BookOpen, label: "View Subjects" },
      { path: "/teacher/my-courses", icon: BookOpen, label: "My Courses" },
      { path: "/teacher/create-content", icon: Target, label: "Create Content" },
    ],
  },
  {
    label: "Performance",
    icon: BarChart3,
    children: [
      { path: "/teacher/results", icon: Award, label: "Student Results" },
      { path: "/teacher/analytics", icon: BarChart3, label: "Performance Analytics" },
      { path: "/teacher/attendance", icon: Calendar, label: "Attendance" },
    ],
  },
  {
    label: "Earnings",
    icon: CreditCard,
    children: [
      { path: "/teacher/earnings", icon: CreditCard, label: "My Earnings" },
      { path: "/teacher/transactions", icon: CreditCard, label: "Transaction History" },
    ],
  },
  { path: "/teacher/change-password", icon: Lock, label: "Change Password" },
];

export const TeacherSidebar = () => {
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
    <div className="bg-slate-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50 flex flex-col"
         style={{ width: isCollapsed ? "5rem" : "16rem" }}>
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">Teacher</span>
            </div>
            <div className="text-xs text-gray-400">
              {location.pathname}
            </div>
          </>
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
        {menuItems.map((item, index) => {
          if (item.children) {
            // Parent menu with children
            const isExpanded = isMenuExpanded(item.label);
            const hasActiveChild = item.children.some(child => 
              location.pathname === child.path
            );

            return (
              <div key={index} className="mb-2">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    hasActiveChild
                      ? "bg-emerald-500 text-white"
                      : "text-gray-300 hover:bg-slate-700"
                  }`}
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
                        className={`flex items-center gap-3 px-4 py-2 mx-2 ml-4 rounded-lg transition-colors block ${
                          isActive(child.path)
                            ? "bg-emerald-600 text-white"
                            : "text-gray-400 hover:bg-slate-700 hover:text-white"
                        }`}
                        title={child.path}
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
            // Regular menu item
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors block ${
                  isActive(item.path)
                    ? "bg-emerald-500 text-white"
                    : "text-gray-300 hover:bg-slate-700"
                }`}
                title={item.path}
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
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
