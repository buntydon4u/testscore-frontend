import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface PageWrapperProps {
  children: ReactNode;
  portal: "student" | "teacher" | "parent";
  userName: string;
  userRole: string;
}

export const PageWrapper = ({ children, portal, userName, userRole }: PageWrapperProps) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar portal={portal} />
      <div className="flex-1 ml-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
