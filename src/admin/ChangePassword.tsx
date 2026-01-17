import { Layout } from "@/components/Layout";
import { Lock } from "lucide-react";

export const ChangePassword = () => {
  return (
    <Layout role="admin" userName="System Administrator" userRole="Admin">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

        <div className="max-w-md bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
