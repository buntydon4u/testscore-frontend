import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  userName: string;
  userRole: string;
  children?: ReactNode;
}

export const Layout = ({ userName, userRole, children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">School Management</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                {userName} - {userRole}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};
