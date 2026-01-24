import { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  GraduationCap,
  Package,
  Beaker,
  BookOpen,
  ShoppingCart,
  Settings,
  Activity,
  Shield,
  BarChart3,
  Lock,
  LayoutDashboard,
  Box,
  FileText,
  Award,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Calendar,
  PlayCircle,
  Target,
  Square,
  Clock,
  User,
  Database,
  Building,
  BookMarked,
} from "lucide-react";

export interface SidebarLink {
  path: string;
  icon: LucideIcon;
  label: string;
}

export interface SidebarParent {
  label: string;
  icon: LucideIcon;
  children: SidebarLink[];
}

export type SidebarItem = SidebarLink | SidebarParent;

export const isSidebarParent = (item: SidebarItem): item is SidebarParent => {
  return 'children' in item;
};

export const sidebarLinks = {
  SUPER_ADMIN: [
    {
      path: "/super-admin/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      label: "Master Data",
      icon: Database,
      children: [
        {
          path: "/super-admin/users",
          icon: Users,
          label: "User Management",
        },
        {
          path: "/super-admin/schools",
          icon: Building,
          label: "School Management",
        },
        {
          path: "/super-admin/streams",
          icon: Beaker,
          label: "Stream Management",
        },
        {
          path: "/super-admin/subjects",
          icon: BookOpen,
          label: "Subject Management",
        },
      ],
    },
    {
      label: "Business",
      icon: Package,
      children: [
        {
          path: "/super-admin/packages",
          icon: Package,
          label: "Package Management",
        },
        {
          path: "/super-admin/orders",
          icon: ShoppingCart,
          label: "Order Management",
        },
      ],
    },
    {
      label: "Academics",
      icon: GraduationCap,
      children: [
        {
          path: "/super-admin/students",
          icon: Users,
          label: "Student Management",
        },
        {
          path: "/super-admin/exams",
          icon: FileText,
          label: "Exam Management",
        },
        {
          path: "/super-admin/courses",
          icon: BookMarked,
          label: "Course Management",
        },
        {
          path: "/super-admin/results",
          icon: Award,
          label: "Results",
        },
      ],
    },
    {
      label: "Reports & Analytics",
      icon: BarChart3,
      children: [
        {
          path: "/super-admin/analytics",
          icon: BarChart3,
          label: "System Reports",
        },
        {
          path: "/super-admin/audit-log",
          icon: Activity,
          label: "Audit Log",
        },
      ],
    },
    {
      label: "System",
      icon: Settings,
      children: [
        {
          path: "/super-admin/settings",
          icon: Settings,
          label: "Settings",
        },
        {
          path: "/super-admin/security",
          icon: Shield,
          label: "Security Alerts",
        },
        {
          path: "/super-admin/change-password",
          icon: Lock,
          label: "Change Password",
        },
      ],
    },
  ] as SidebarItem[],
  ADMIN: [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      label: "Master Data",
      icon: Database,
      children: [
        { path: "/admin/streams", icon: Beaker, label: "Stream Management" },
        { path: "/admin/subjects", icon: BookOpen, label: "Subject Management" },
      ],
    },
    {
      label: "Business",
      icon: Package,
      children: [
        { path: "/admin/packages", icon: Box, label: "Package Management" },
        { path: "/admin/orders", icon: ShoppingCart, label: "Order Management" },
      ],
    },
    {
      label: "Academics",
      icon: GraduationCap,
      children: [
        { path: "/admin/students", icon: Users, label: "Manage Students" },
        { path: "/admin/exams", icon: FileText, label: "Manage Exams" },
        { path: "/admin/courses", icon: BookOpen, label: "Manage Courses" },
        { path: "/admin/results", icon: Award, label: "View Results" },
      ],
    },
    {
      label: "System",
      icon: Settings,
      children: [
        { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { path: "/admin/system-config", icon: Settings, label: "System Configuration" },
        { path: "/admin/settings", icon: Settings, label: "Settings" },
        { path: "/admin/change-password", icon: Lock, label: "Change Password" },
      ],
    },
  ] as SidebarItem[],
  TEACHER: [
    { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/profile", icon: User, label: "Profile" },
    {
      label: "Students",
      icon: Users,
      children: [
        { path: "/teacher/students", icon: Users, label: "Students List" },
        { path: "/teacher/students/view", icon: GraduationCap, label: "Manage Students" },
      ],
    },
    {
      label: "Exams",
      icon: FileText,
      children: [
        { path: "/teacher/exams", icon: FileText, label: "Exams List" },
        { path: "/teacher/exams/view", icon: FileText, label: "Manage Exams" },
        { path: "/teacher/scheduled-tests", icon: Calendar, label: "Scheduled Tests" },
        { path: "/teacher/exam-results", icon: Award, label: "Exam Results" },
      ],
    },
    {
      label: "Courses",
      icon: BookOpen,
      children: [
        { path: "/teacher/courses", icon: BookOpen, label: "Courses" },
        { path: "/teacher/sections/view", icon: BookOpen, label: "Manage Sections" },
      ],
    },
    {
      label: "Academics",
      icon: GraduationCap,
      children: [
        { path: "/teacher/results", icon: Award, label: "Results" },
        { path: "/teacher/attendance", icon: Calendar, label: "Attendance" },
        { path: "/teacher/schedule", icon: Calendar, label: "Schedule" },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      children: [
        { path: "/teacher/analytics", icon: BarChart3, label: "Analytics" },
        { path: "/teacher/transactions", icon: CreditCard, label: "Transactions" },
      ],
    },
    { path: "/teacher/change-password", icon: Lock, label: "Change Password" },
  ] as SidebarItem[],
  STUDENT: [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/profile", icon: User, label: "Profile" },
    {
      label: "My Packages",
      icon: Package,
      children: [
        { path: "/student/packages", icon: Package, label: "Browse Packages" },
        { path: "/student/purchased-packages", icon: Package, label: "Purchased Packages" },
      ],
    },
    {
      label: "Exams",
      icon: FileText,
      children: [
        { path: "/student/scheduled-exams", icon: Calendar, label: "Scheduled Exams" },
        { path: "/student/complete-exam", icon: PlayCircle, label: "Complete Exam" },
        { path: "/student/topic-test", icon: Target, label: "Topic Test" },
        { path: "/student/section-test", icon: Square, label: "Section Test" },
        { path: "/student/test-in-progress", icon: Clock, label: "Test In-Progress" },
        { path: "/student/exam-result", icon: Award, label: "Exam Results" },
      ],
    },
    {
      label: "Account",
      icon: Settings,
      children: [
        { path: "/student/transactions", icon: CreditCard, label: "Transactions" },
        { path: "/student/change-password", icon: Lock, label: "Change Password" },
      ],
    },
  ] as SidebarItem[],
  PARENT: [
    { path: "/parent/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      label: "My Children",
      icon: Users,
      children: [
        { path: "/parent/children", icon: Users, label: "View Children" },
        { path: "/parent/progress", icon: TrendingUp, label: "Children Progress" },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      children: [
        { path: "/parent/reports", icon: BarChart3, label: "Performance Reports" },
        { path: "/parent/notifications", icon: AlertCircle, label: "Notifications" },
      ],
    },
    { path: "/parent/change-password", icon: Lock, label: "Change Password" },
  ] as SidebarItem[],
  INSTITUTE_OWNER: [] as SidebarLink[],
  SHARED: [] as SidebarLink[],
};

export const adminLinks = sidebarLinks.ADMIN;
export const superAdminLinks = sidebarLinks.SUPER_ADMIN;