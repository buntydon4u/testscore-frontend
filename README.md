# 🎓 EdTech Platform — Project Documentation  
### Hybrid Redis + Database Architecture | Admin & SuperAdmin Panel | Scalable API | React Frontend | Enterprise Security

This repository contains the full source code and architecture for the EdTech Platform.  
It includes separate Admin and SuperAdmin dashboards, a hybrid Redis + Database backend,  
a scalable, optimized API layer, and a modern React + Tailwind UI.

This README outlines **all core standards, security rules, architecture principles, and development guidelines**  
that every developer and every AI Agent must follow.

---

# 🚀 Core Architecture Overview

This project follows a **Hybrid Redis + Database Architecture**:

### **Database (Primary Source of Truth)**  
✔ Permanent, secure storage  
✔ User sessions (DB-level)  
✔ Audit logs  
✔ Master data  
✔ Role management  
✔ Full compliance capability  

### **Redis (High-speed Layer)**  
✔ OTP  
✔ Rate limiting  
✔ Token blacklist  
✔ Cached list data  
✔ Cached detail data  
✔ Question bank caching  
✔ Exam structure caching  
✔ Dashboard summaries  
✔ Background queues  

Redis ensures ultra-high performance while the DB ensures integrity and safety.

---

# 🛡 Enterprise Security Architecture

Security is FIRST priority. The system enforces:

## ✔ 1. Role-Based Access (RBAC)
- Admin and SuperAdmin dashboard separation  
- Layout selected strictly by role  
- Backend blocks unauthorized routes  
- Sidebar menu filtered dynamically per role  
- Unauthorized attempts → 403  

## ✔ 2. No Sensitive Data to Frontend
Never expose:
- Passwords  
- OTPs  
- Internal system keys  
- Tokens  
- Sensitive logs  
- Deleted/inactive records  

All API responses are sanitized.

## ✔ 3. Server-side Enforcement
All logic is performed server-side, ensuring:
- Server-side search  
- Server-side sorting  
- Server-side pagination  
- Server-side filters  
- No full-table exposure  
- No client-side filtering  

## ✔ 4. Soft Delete Everywhere
Every delete = soft delete:
- isDeleted = true  
- deletedAt timestamp maintained  
- API only returns isDeleted = false  

## ✔ 5. Active-only Enforcement
All list panels show:
```
WHERE isActive = true AND isDeleted = false
```

## ✔ 6. JWT + Redis Security
- JWT signature verified  
- Redis-based token blacklist prevents reuse  
- DB session lookup for additional validation  
- Logout = instant token invalidation  

## ✔ 7. Rate Limiting (Redis)
- Login throttling  
- OTP throttling  
- Signup throttling  
- IP/email-based checks  

Prevents brute-force attacks.

## ✔ 8. OTP Security
- OTP stored ONLY in Redis (never in DB)  
- Auto-expiry in 10 minutes  
- Attempts logged + rate limited  

## ✔ 9. Strict CORS Enforcement
Only allow:
```
https://production-domain.com
http://localhost:5173
```

Block all others.

## ✔ 10. No Data Leakage (DevTools Safe)
Even if user inspects DevTools:
- Only permitted filtered data is visible  
- No sensitive payloads ever sent  
- Strict backend validation: user only gets what they are authorized to see  

## ✔ 11. Query Optimization for Safety
- Indexed queries  
- Minimal SELECT fields  
- No SELECT *  
- Prisma service-layer strict rules  

---

# 🧱 Backend + API Architecture

Follows a clean, modular, enterprise structure:

```
src/
  controllers/
  services/
  middleware/
  redis/
  utils/
  routes/
  models/
  config/
  layouts/
```

### Backend Standards:
- All logic must go into services (never controllers)  
- Full Redis caching applied to list & detail APIs  
- Cache invalidation on every write  
- Hybrid DB + Redis for security  
- No unfiltered DB queries allowed  
- Audit logs for sensitive actions  

---

# 🎨 Frontend (React + Tailwind)

Key rules:
- All forms in Tailwind modal popups  
- Delete = confirmation modal  
- React Query for API + cache  
- Role-based sidebar  
- No layout duplication  
- Server-side everything (search/sort/pagination)  

---

# 🧭 Layout Architecture (Admin & SuperAdmin)

- Role-driven layout (NOT URL-driven)  
- SuperAdmin always loads SuperAdminLayout  
- Admin always loads AdminLayout  
- Shared pages show layout based on logged-in user  
- Pages must never contain layout HTML  

---

# 📚 Master Data CRUD Standards

Every master module must follow:

### Table Features:
- Column-wise search  
- Server-side pagination  
- Server-side sorting  
- Server-side filters  
- Redis-backed results  
- Only active + non-deleted records  

### UI:
- Tailwind modal Create form  
- Tailwind modal Edit form  
- Tailwind delete confirmation  

### Backend:
- Soft delete  
- Cache invalidation  
- Redis-first data retrieval  

---

# 📦 Universal Middleware

### cacheMiddleware  
Used for all list APIs.

### cacheWrap  
Used for detail APIs.

### authMiddleware  
Validates:
1. JWT signature  
2. Redis token blacklist  
3. DB session  

### rateLimiter  
Protects auth routes.

---

# 📄 File Structure (Backend)

```
src/
│── redis/
│    ├── redisClient.ts
│    ├── otpService.ts
│    ├── rateLimiter.ts
│    ├── tokenBlacklist.ts
│    └── cacheWrap.ts
│
│── middleware/
│    ├── cacheMiddleware.ts
│    └── authMiddleware.ts
│
│── controllers/
│── services/
│── routes/
│── models/
│── utils/
│── config/
│── layouts/
```

---

# 🧪 Testing Requirements

- Redis fallback QA  
- Security endpoint validation  
- Unauthorized route access → 403  
- Master CRUD tests  
- Pagination correctness tests  
- Rate limit simulation  

---

# ✨ Summary

This project implements a fully scalable EdTech platform with:

- Hybrid Redis + DB Architecture  
- Strict Security Enforcement  
- Professional Layout System  
- Optimized Caching Layer  
- Enterprise CRUD Standards  
- Zero client-side data exposure  
- Future-proof modular design  

---

# 📨 Support

For architecture questions, enhancements, or module creation requests,
refer to this README first.

