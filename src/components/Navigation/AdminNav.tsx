import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  CogIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
  { name: 'Packages', href: '/admin/packages', icon: CubeIcon },
  { name: 'Orders', href: '/admin/orders', icon: CurrencyDollarIcon },
  { name: 'Students', href: '/admin/students', icon: UserGroupIcon },
  { name: 'Exams', href: '/admin/exams', icon: AcademicCapIcon },
  { name: 'Courses', href: '/admin/courses', icon: ClipboardDocumentListIcon },
  { name: 'Results', href: '/admin/results', icon: ClipboardDocumentListIcon },
  { name: 'Attendance', href: '/admin/attendance', icon: CalendarIcon },
  { name: 'Schedule', href: '/admin/schedule', icon: CalendarIcon },
  { name: 'System Config', href: '/admin/system-config', icon: CogIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  { name: 'Change Password', href: '/admin/change-password', icon: KeyIcon },
];

export const AdminNav: React.FC = () => {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
