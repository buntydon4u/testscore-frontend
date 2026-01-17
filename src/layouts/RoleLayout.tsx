import { ReactNode } from "react";
import { LayoutRegistry } from "./layoutRegistry";
import { authService } from "../services/auth";

interface RoleLayoutProps {
  children: ReactNode;
}

export const RoleLayout = ({ children }: RoleLayoutProps) => {
  const user = authService.getUser();
  const Layout = LayoutRegistry[user?.role as keyof typeof LayoutRegistry] || LayoutRegistry.DEFAULT;
  return <Layout>{children}</Layout>;
};