import { AdminLayout } from './AdminLayout';
import { SuperAdminLayout } from './SuperAdminLayout';
import { TeacherLayout } from './TeacherLayout';
import { GenericLayout } from './GenericLayout';

// Use GenericLayout for all roles that don't need custom layouts
// This ensures consistent behavior and easy maintenance
export const LayoutRegistry = {
  super_admin: SuperAdminLayout,
  SUPER_ADMIN: SuperAdminLayout,
  admin: AdminLayout,
  ADMIN: AdminLayout,
  teacher: TeacherLayout,
  TEACHER: TeacherLayout,
  student: GenericLayout,
  STUDENT: GenericLayout,
  parent: GenericLayout,
  PARENT: GenericLayout,
  guest: GenericLayout,
  GUEST: GenericLayout,
  institute_owner: GenericLayout,
  INSTITUTE_OWNER: GenericLayout,
  default: GenericLayout,
  DEFAULT: GenericLayout
};