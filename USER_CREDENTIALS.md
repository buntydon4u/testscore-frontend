# Test Score Correlation Platform - User Credentials & Dashboard Guide

## Overview
Complete list of seeded test users for all 6 roles with their credentials and respective dashboard features.

---

## 🔐 Super Admin (System Level Access)

### Super Admin User
| Field | Value |
|-------|-------|
| **Email** | superadmin@testscorelat.com |
| **Username** | superadmin |
| **Password** | SecureAdmin#2024Pass123 |
| **Role** | SUPER_ADMIN |
| **Full Name** | Super Admin |

### Dashboard Features
- Total Users Statistics
- System Health Monitoring (98% uptime)
- Active Sessions Tracking (1,203 sessions)
- Security Alerts Management (12 alerts)
- System Activity Log
- Manage Users
- System Settings
- System Reports & Analytics

### Route
```
/super-admin/dashboard
```

---

## 👨‍💼 Admin (System Administration)

### Admin User
| Field | Value |
|-------|-------|
| **Email** | admin@testscorelat.com |
| **Username** | admin |
| **Password** | AdminPass#2024 |
| **Role** | ADMIN |
| **Full Name** | System Administrator |

### Dashboard Features
- Total Students (2,543)
- Active Courses (125)
- Completed Exams (4,892)
- Success Rate (87%)
- Recent Exams Management
- Create New Exams
- Manage Students
- View Reports & Analytics

### Route
```
/admin/dashboard
```

---

## 👨‍🏫 Teachers (3 Users)

### Teacher 1 - John Teacher
| Field | Value |
|-------|-------|
| **Email** | john.teacher@testscorelat.com |
| **Username** | john_teacher |
| **Password** | TeacherPass#2024 |
| **Role** | TEACHER |
| **Full Name** | John Teacher |
| **School** | Central Public School |

### Teacher 2 - Sarah Williams
| Field | Value |
|-------|-------|
| **Email** | sarah.teacher@testscorelat.com |
| **Username** | sarah_teacher |
| **Password** | TeacherPass#2024 |
| **Role** | TEACHER |
| **Full Name** | Sarah Williams |
| **School** | Central Public School |

### Teacher 3 - Michael Chen
| Field | Value |
|-------|-------|
| **Email** | michael.teacher@testscorelat.com |
| **Username** | michael_teacher |
| **Password** | TeacherPass#2024 |
| **Role** | TEACHER |
| **Full Name** | Michael Chen |
| **School** | Modern Academy |

### Dashboard Features
- Total Students (324)
- Active Classes (6)
- Exams Created (18)
- Average Performance (78%)
- Upcoming Exams Management
- Recent Activities Log
- Create Exam
- Manage Students
- View Reports & Analytics

### Route
```
/teacher/dashboard
```

### Other Teacher Routes
- Change Password: `/teacher/change-password`
- Exam Results: `/teacher/exam-results`
- Scheduled Tests: `/teacher/scheduled-tests`
- Transactions: `/teacher/transactions`

---

## 👨‍🎓 Students (5 Users)

### Student 1 - Jane Doe
| Field | Value |
|-------|-------|
| **Email** | jane.student@testscorelat.com |
| **Username** | jane_student |
| **Password** | StudentPass#2024 |
| **Role** | STUDENT |
| **Full Name** | Jane Doe |
| **Class** | 12A |
| **School** | Central Public School |
| **Academic Year** | 2024 |

### Student 2 - Alex Johnson
| Field | Value |
|-------|-------|
| **Email** | alex.student@testscorelat.com |
| **Username** | alex_student |
| **Password** | StudentPass#2024 |
| **Role** | STUDENT |
| **Full Name** | Alex Johnson |
| **Class** | 11B |
| **School** | Central Public School |
| **Academic Year** | 2024 |

### Student 3 - Priya Sharma
| Field | Value |
|-------|-------|
| **Email** | priya.student@testscorelat.com |
| **Username** | priya_student |
| **Password** | StudentPass#2024 |
| **Role** | STUDENT |
| **Full Name** | Priya Sharma |
| **Class** | 12C |
| **School** | Modern Academy |
| **Academic Year** | 2024 |

### Student 4 - Raj Kumar
| Field | Value |
|-------|-------|
| **Email** | raj.student@testscorelat.com |
| **Username** | raj_student |
| **Password** | StudentPass#2024 |
| **Role** | STUDENT |
| **Full Name** | Raj Kumar |
| **Class** | 10A |
| **School** | Modern Academy |
| **Academic Year** | 2024 |

### Student 5 - Emma Watson
| Field | Value |
|-------|-------|
| **Email** | emma.student@testscorelat.com |
| **Username** | emma_student |
| **Password** | StudentPass#2024 |
| **Role** | STUDENT |
| **Full Name** | Emma Watson |
| **Class** | 11A |
| **School** | Central Public School |
| **Academic Year** | 2024 |

### Dashboard Features
- Purchased Packages
- Free Exams (Mock Tests)
- Free Section Tests
- Free Topic Tests
- Transaction History
- Test in Progress Status
- Recent Activities Log

### Route
```
/student/dashboard
```

### Other Student Routes
- Profile: `/student/profile`
- Change Password: `/student/change-password`
- Exam Result: `/student/exam-result`
- Complete Exam: `/student/complete-exam`
- Section Test: `/student/section-test`
- Topic Test: `/student/topic-test`
- Purchased Packages: `/student/purchased-packages`
- Scheduled Exams: `/student/scheduled-exams`
- Test in Progress: `/student/test-in-progress`
- Transactions: `/student/transactions`

---

## 👨‍👩‍👧‍👦 Parents (3 Users)

### Parent 1 - Robert Doe
| Field | Value |
|-------|-------|
| **Email** | robert.parent@testscorelat.com |
| **Username** | robert_parent |
| **Password** | ParentPass#2024 |
| **Role** | PARENT |
| **Full Name** | Robert Doe |

### Parent 2 - Maria Johnson
| Field | Value |
|-------|-------|
| **Email** | maria.parent@testscorelat.com |
| **Username** | maria_parent |
| **Password** | ParentPass#2024 |
| **Role** | PARENT |
| **Full Name** | Maria Johnson |

### Parent 3 - Deepak Sharma
| Field | Value |
|-------|-------|
| **Email** | deepak.parent@testscorelat.com |
| **Username** | deepak_parent |
| **Password** | ParentPass#2024 |
| **Role** | PARENT |
| **Full Name** | Deepak Sharma |

### Dashboard Features
- Children Enrolled (2)
- Average Score (82%)
- Achievements (5)
- Active Courses (6)
- Children's Progress Monitoring
- View Children Accounts
- View Performance Reports
- View Notifications

### Route
```
/parent/dashboard
```

---

## 👤 Guest (Limited Access)

### Guest User
| Field | Value |
|-------|-------|
| **Email** | guest@testscorelat.com |
| **Username** | guest |
| **Password** | GuestPass#2024 |
| **Role** | GUEST |
| **Full Name** | Guest Visitor |

### Dashboard Features
- Available Courses Preview (45 courses)
- Free Tests Available (128 tests)
- Active Users Count (15.2K)
- Access Duration (30 days)
- Browse Courses
- Take Free Test
- Limited course preview access

### Route
```
/guest/dashboard
```

---

## 📋 Quick Reference - Login URLs

| Role | Dashboard URL | Status |
|------|---------------|--------|
| Super Admin | `/super-admin/dashboard` | ✅ Active |
| Admin | `/admin/dashboard` | ✅ Active |
| Teacher | `/teacher/dashboard` | ✅ Active |
| Student | `/student/dashboard` | ✅ Active |
| Parent | `/parent/dashboard` | ✅ Active |
| Guest | `/guest/dashboard` | ✅ Active |

---

## 🔄 Database Seeding

To seed the database with all these users, run:

```bash
cd backend
npm run seed
```

This will:
- Create all 17 test users (1 super admin, 1 admin, 3 teachers, 5 students, 3 parents, 1 guest)
- Create user profiles with appropriate information
- Create user preferences with default settings
- Mark all users as email verified

---

## 🔐 Security Notes

- All passwords are for testing only
- Update SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in `.env` for production
- JWT tokens expire in 15 minutes (access) and 7 days (refresh)
- All credentials should be changed in production
- Implement role-based access control (RBAC) for API endpoints

---

## 📊 User Summary

| Role | Count | Total |
|------|-------|-------|
| Super Admin | 1 | 1 |
| Admin | 1 | 1 |
| Teacher | 3 | 3 |
| Student | 5 | 5 |
| Parent | 3 | 3 |
| Guest | 1 | 1 |
| **Total** | **14** | **14** |

---

## ✨ Features Implemented

### ✅ Completed
- [x] Comprehensive user seeding for all 6 roles
- [x] Super Admin Dashboard with system monitoring
- [x] Admin Dashboard with exam and student management
- [x] Teacher Dashboard with exam and student tracking
- [x] Student Dashboard with exam and package tracking
- [x] Parent Dashboard with children monitoring
- [x] Guest Dashboard with course preview
- [x] Role-based routing in App.tsx
- [x] TypeScript compilation successful
- [x] Production build successful

### 📝 Additional Notes
- Each role has specific dashboard features tailored to their needs
- Dashboards include realistic mock data for demonstration
- All components follow the existing project styling conventions
- Responsive design for mobile and desktop views
