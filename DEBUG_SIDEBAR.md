# Debugging Sidebar Issue

## Current Problem
Student dashboard is showing "Admin Portal" sidebar instead of "Student Portal".

## Debugging Steps

### Step 1: Check User Role in Browser Console
1. Open browser console (F12 or Cmd+Option+I)
2. Run this command:
```javascript
JSON.parse(localStorage.getItem('user'))
```
3. Check what role is stored. It should show something like:
```json
{
  "id": "...",
  "email": "...",
  "username": "jane_student",
  "role": "STUDENT"  // <-- This is what we need to verify
}
```

### Step 2: Check Console Logs
Look for these console logs when you load the student dashboard:
- `RoleLayout: user from auth:` - Shows the user object
- `RoleLayout: user role:` - Shows the role value
- `RoleLayout: trying roleLower:` - Shows lowercase normalized role
- `RoleLayout: trying roleUpper:` - Shows uppercase normalized role
- `RoleLayout: available layouts:` - Shows all available layouts
- `RoleLayout: final selected layout:` - Shows which layout was selected
- `GenericSidebar: user from auth:` - Shows user in sidebar
- `GenericSidebar: normalized role:` - Shows the role used for menu lookup
- `GenericSidebar: menu items found:` - Shows how many menu items were found
- `GenericSidebar: display name:` - Shows what name will be displayed

### Step 3: Possible Issues and Solutions

#### Issue 1: Role is stored as lowercase "student" instead of "STUDENT"
**Solution:** The code now handles both cases, but verify in console.

#### Issue 2: Role has different format (e.g., "Student", "STUDENT", "student")
**Solution:** Code normalizes to uppercase, should work.

#### Issue 3: Wrong layout is cached
**Solution:** Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

#### Issue 4: User role is something else entirely
**Solution:** Check the actual role value in localStorage and verify it matches what the backend sends.

### Step 4: Manual Fix if Needed
If the role is wrong in localStorage, you can manually fix it:
```javascript
// Get current user
let user = JSON.parse(localStorage.getItem('user'));
// Fix the role
user.role = 'STUDENT';  // or 'student' - both should work now
// Save it back
localStorage.setItem('user', JSON.stringify(user));
// Reload the page
window.location.reload();
```

## Expected Behavior

When everything is working correctly:
1. Student logs in
2. Role is stored as "STUDENT" or "student" in localStorage
3. RoleLayout reads the role and selects GenericLayout
4. GenericLayout renders GenericSidebar
5. GenericSidebar reads role, finds STUDENT menu items from sidebarLinks
6. Sidebar displays "Student Portal" with student menu items

## Files Modified

1. `/src/components/GenericSidebar.tsx` - Added debug logging
2. `/src/layouts/RoleLayout.tsx` - Added debug logging and better role normalization
3. `/src/layouts/layoutRegistry.ts` - Updated to use GenericLayout for student
4. `/src/layouts/StudentLayout.tsx` - Updated to use GenericSidebar
5. `/src/layouts/GenericLayout.tsx` - Created new generic layout

## Next Steps

1. Clear browser cache and localStorage
2. Login again as student
3. Check console logs
4. Report back what you see in the console
