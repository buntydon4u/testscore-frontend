import { AdminLayout } from './AdminLayout';
import { SuperAdminLayout } from './SuperAdminLayout';
import { TeacherLayout } from './TeacherLayout';
import { StudentLayout } from './StudentLayout';
import { ParentLayout } from './ParentLayout';
import { GuestLayout } from './GuestLayout';

// Placeholder layouts for other roles - using AdminLayout for now
const InstituteOwnerLayout = AdminLayout;
const DefaultLayout = AdminLayout;

export const LayoutRegistry = {
  SUPER_ADMIN: SuperAdminLayout,
  ADMIN: AdminLayout,
  TEACHER: TeacherLayout,
  STUDENT: StudentLayout,
  PARENT: ParentLayout,
  GUEST: GuestLayout,
  INSTITUTE_OWNER: InstituteOwnerLayout,
  DEFAULT: DefaultLayout
};