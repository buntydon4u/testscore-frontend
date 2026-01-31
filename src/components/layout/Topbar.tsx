import { Bell, Search } from "lucide-react";

interface TopbarProps {
  userName: string;
  userRole: string;
}

export const Topbar = ({ userName, userRole }: TopbarProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userName || "User"}</p>
                <p className="text-xs text-gray-500">{userRole || "Guest"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
