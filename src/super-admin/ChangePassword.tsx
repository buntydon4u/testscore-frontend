import { Lock, Shield, Key } from "lucide-react";

export const ChangePassword = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

        <div className="max-w-md bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Super Admin Password</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Key className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    As a super admin, changing your password will require re-authentication across all sessions.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter new password (min 12 characters)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must contain at least 12 characters, including uppercase, lowercase, numbers, and special characters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="force-logout" className="rounded" />
              <label htmlFor="force-logout" className="text-sm text-gray-700">
                Force logout from all other sessions
              </label>
            </div>

            <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
    </div>
  );
};