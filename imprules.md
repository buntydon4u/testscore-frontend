IMPORTANT ENFORCEMENT RULES (MUST BE FOLLOWED FOR ALL FUTURE MODULES)

You MUST follow these enforced standards for every module you generate:

1. All list APIs must use server-side pagination, sorting, column-wise search, filtering.
2. All list APIs MUST use Redis caching via cacheMiddleware("<entity>").
3. All detail APIs MUST use cacheWrap("<entity>:<id>", ttl, fetcher).
4. All delete operations MUST be soft-delete:
      isDeleted = true, deletedAt = timestamp
   And all queries MUST filter: isDeleted = false AND isActive = true.

5. All forms (Create/Edit/Delete) MUST open inside Tailwind Modal Popups.
6. Delete MUST always show a delete-confirmation modal before performing soft delete.
7. All master queries MUST be active-only.
8. No direct DB calls allowed in controllers — only service layer.
9. All modules MUST invalidate Redis cache on create/update/delete.
10. Layout must depend ONLY on user.role, not URL.
11. Sidebar must render role-based links only.
12. OTP must only be stored in Redis (never in DB).
13. Sensitive fields must never be exposed in API responses.
14. All new modules MUST follow the folder structure and code style used in existing modules.
15. Everything must be built to scale and follow the Redis + DB hybrid architecture.

These rules MUST be followed. Reject any code patterns that violate these rules.
