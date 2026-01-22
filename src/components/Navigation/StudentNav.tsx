import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ShoppingBagIcon,
  UserIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ClockIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: ChartBarIcon },
  { name: 'My Packages', href: '/student/packages', icon: ShoppingBagIcon },
  { name: 'Profile', href: '/student/profile', icon: UserIcon },
  { name: 'Exam Results', href: '/student/exam-result', icon: AcademicCapIcon },
  { name: 'Complete Exam', href: '/student/complete-exam', icon: AcademicCapIcon },
  { name: 'Section Test', href: '/student/section-test', icon: AcademicCapIcon },
  { name: 'Topic Test', href: '/student/topic-test', icon: AcademicCapIcon },
  { name: 'Scheduled Exams', href: '/student/scheduled-exams', icon: CalendarIcon },
  { name: 'Test in Progress', href: '/student/test-in-progress', icon: ClockIcon },
  { name: 'Transactions', href: '/student/transactions', icon: CurrencyDollarIcon },
  { name: 'Change Password', href: '/student/change-password', icon: KeyIcon },
];

export const StudentNav: React.FC = () => {
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
