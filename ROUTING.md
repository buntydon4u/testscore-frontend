# Application Routing Structure

## Overview
This application uses **role-based routing** following best practices for multi-tenant applications. Each user role has its own dedicated route namespace, ensuring clear separation of concerns and enhanced security.

## Route Structure

### Public Routes
- `/` - Login page
- `/forgot-password` - Password recovery

### Role-Based Routes

#### Admin Routes (`/admin/*`)
**Allowed Role:** `ADMIN`

- `/admin/dashboard` - Admin dashboard
- `/admin/analytics` - Analytics overview
- `/admin/students` - Student management
- `/admin/exams` - Exam management
- `/admin/courses` - Course management
- `/admin/results` - Results management
- `/admin/attendance` - Attendance tracking
- `/admin/schedule` - Schedule management
- `/admin/system-config` - System configuration
- `/admin/settings` - Settings
- `/admin/change-password` - Change password

#### Super Admin Routes (`/super-admin/*`)
**Allowed Role:** `SUPER_ADMIN`

- `/super-admin/dashboard` - Super admin dashboard
- `/super-admin/users` - User management
- `/super-admin/system-config` - System configuration
- `/super-admin/audit-log` - Audit logs
- `/super-admin/security` - Security settings
- `/super-admin/analytics` - Analytics
- `/super-admin/change-password` - Change password

#### Student Routes (`/student/*`)
**Allowed Role:** `STUDENT`

- `/student/dashboard` - Student dashboard
- `/student/profile` - Student profile
- `/student/change-password` - Change password
- `/student/exam-result` - Exam results
- `/student/complete-exam` - Complete exam
- `/student/section-test` - Section tests
- `/student/topic-test` - Topic tests
- `/student/purchased-packages` - Purchased packages
- `/student/scheduled-exams` - Scheduled exams
- `/student/test-in-progress` - Test in progress
- `/student/transactions` - Transaction history

#### Teacher Routes (`/teacher/*`)
**Allowed Role:** `TEACHER`

- `/teacher/dashboard` - Teacher dashboard
- `/teacher/profile` - Teacher profile
- `/teacher/students/view` - View students
- `/teacher/exams/view` - View exams
- `/teacher/sections/view` - View sections
- `/teacher/change-password` - Change password
- `/teacher/exam-results` - Exam results
- `/teacher/scheduled-tests` - Scheduled tests
- `/teacher/transactions` - Transaction history

#### Parent Routes (`/parent/*`)
**Allowed Role:** `PARENT`

- `/parent/dashboard` - Parent dashboard
- `/parent/children` - Children list
- `/parent/progress` - Children's progress
- `/parent/reports` - Reports
- `/parent/notifications` - Notifications
- `/parent/change-password` - Change password

#### Guest Routes (`/guest/*`)
**Allowed Role:** `GUEST`

- `/guest/dashboard` - Guest dashboard
- `/guest/courses` - Available courses
- `/guest/free-tests` - Free tests

## Security Features

### 1. Role-Based Access Control (RBAC)
Each route group is protected by the `ProtectedRoute` component with specific role requirements:
```typescript
<Route path="/admin/*" element={
  <ProtectedRoute allowedRoles={['ADMIN']}>
    <RoleLayout><AdminRoutes /></RoleLayout>
  </ProtectedRoute>
} />
```

### 2. Authentication Check
- Unauthenticated users are redirected to the login page (`/`)
- Authenticated users cannot access public routes (login/forgot-password)

### 3. Authorization Check
- Users attempting to access routes outside their role are automatically redirected to their own dashboard
- Example: A `STUDENT` trying to access `/admin/dashboard` will be redirected to `/student/dashboard`

### 4. Automatic Role-Based Redirection
After login, users are automatically redirected to their role-specific dashboard:
- `ADMIN` → `/admin/dashboard`
- `SUPER_ADMIN` → `/super-admin/dashboard`
- `STUDENT` → `/student/dashboard`
- `TEACHER` → `/teacher/dashboard`
- `PARENT` → `/parent/dashboard`
- `GUEST` → `/guest/dashboard`

## Best Practices Implemented

1. **Consistent URL Structure**: All routes follow the pattern `/{role}/{feature}`
2. **Nested Routes**: Each role has its own route group for better organization
3. **Single Source of Truth**: Role routes are defined in dedicated route components
4. **Layout Consistency**: All protected routes use the `RoleLayout` component
5. **Fallback Route**: Unknown routes redirect to the login page

## Adding New Routes

### For Existing Roles
Add the route to the appropriate route component in `App.tsx`:

```typescript
const AdminRoutes = () => (
  <Routes>
    {/* existing routes */}
    <Route path="new-feature" element={<NewFeature />} />
  </Routes>
);
```

### For New Roles
1. Create a new route component in `App.tsx`
2. Add the role to `ProtectedRoute` allowed roles
3. Update the role routes mapping in both `ProtectedRoute` and `PublicRoute`
4. Add the route to the main Routes section

## Navigation

When creating navigation links, always use the full path including the role prefix:
```typescript
// Correct
<Link to="/admin/students">Students</Link>

// Incorrect
<Link to="/students">Students</Link>
```

## Testing Routes

To test role-based routing:
1. Login with different user roles
2. Verify automatic redirection to the correct dashboard
3. Try accessing routes from other roles (should redirect to own dashboard)
4. Logout and verify redirection to login page
5. Try accessing protected routes without authentication (should redirect to login)
