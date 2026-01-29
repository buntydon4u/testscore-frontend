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
      label: "Institutes",
      icon: Building,
      children: [
        {
          path: "/super-admin/institutes",
          icon: Building,
          label: "Manage Institutes",
        },
        {
          path: "/super-admin/institute-owners",
          icon: Users,
          label: "Institute Owners",
        },
      ],
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
      label: "Reports & Analytics",
      icon: BarChart3,
      children: [
        {
          path: "/super-admin/analytics",
          icon: BarChart3,
          label: "Global Analytics",
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
      label: "Institute Setup",
      icon: Building,
      children: [
        { path: "/admin/institute-profile", icon: Building, label: "Institute Profile" },
        { path: "/admin/streams", icon: Beaker, label: "Manage Streams" },
        { path: "/admin/subjects", icon: BookOpen, label: "Manage Subjects" },
      ],
    },
    {
      label: "People Management",
      icon: Users,
      children: [
        { path: "/admin/students", icon: Users, label: "Manage Students" },
        { path: "/admin/teachers", icon: Users, label: "Manage Teachers" },
        { path: "/admin/staff", icon: Users, label: "Manage Staff" },
      ],
    },
    {
      label: "Academics",
      icon: GraduationCap,
      children: [
        { path: "/admin/courses", icon: BookOpen, label: "Manage Courses" },
        { path: "/admin/create-exam", icon: FileText, label: "Create Exam" },
        { path: "/admin/exams", icon: FileText, label: "Manage Exams" },
        { path: "/admin/results", icon: Award, label: "View Results" },
        { path: "/admin/attendance", icon: Calendar, label: "Attendance Reports" },
      ],
    },
    {
      label: "Business",
      icon: Package,
      children: [
        { path: "/admin/packages", icon: Box, label: "Create Packages" },
        { path: "/admin/orders", icon: ShoppingCart, label: "View Orders" },
        { path: "/admin/payments", icon: CreditCard, label: "Payment History" },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      children: [
        { path: "/admin/analytics", icon: BarChart3, label: "Institute Analytics" },
        { path: "/admin/performance", icon: TrendingUp, label: "Performance Reports" },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      children: [
        { path: "/admin/settings", icon: Settings, label: "Institute Settings" },
        { path: "/admin/change-password", icon: Lock, label: "Change Password" },
      ],
    },
  ] as SidebarItem[],
  TEACHER: [
    { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/profile", icon: User, label: "My Profile" },
    {
      label: "Teaching",
      icon: GraduationCap,
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
        { path: "/teacher/grade-exams", icon: Award, label: "Grade Exams" },
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
  ] as SidebarItem[],
  STUDENT: [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/profile", icon: User, label: "My Profile" },
    {
      label: "Learning",
      icon: BookOpen,
      children: [
        { path: "/student/my-courses", icon: BookOpen, label: "My Courses" },
        { path: "/student/subjects", icon: BookMarked, label: "My Subjects" },
        { path: "/student/assignments", icon: FileText, label: "Assignments" },
      ],
    },
    {
      label: "Exams",
      icon: FileText,
      children: [
        { path: "/student/upcoming-exams", icon: Calendar, label: "Upcoming Exams" },
        { path: "/student/available-exams", icon: Target, label: "Available Exams" },
        { path: "/student/exam-history", icon: Award, label: "Exam History" },
        { path: "/student/exam-results", icon: Award, label: "My Results" },
      ],
    },
    {
      label: "Practice",
      icon: Target,
      children: [
        { path: "/student/topic-tests", icon: Target, label: "Topic Tests" },
        { path: "/student/section-tests", icon: Square, label: "Section Tests" },
        { path: "/student/mock-tests", icon: Clock, label: "Mock Tests" },
      ],
    },
    {
      label: "Account",
      icon: Settings,
      children: [
        { path: "/student/packages", icon: Package, label: "Browse Packages" },
        { path: "/student/purchased-packages", icon: Package, label: "Purchased Packages" },
        { path: "/student/transactions", icon: CreditCard, label: "Payment History" },
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