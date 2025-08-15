# 🔧 Admin Login Role Fix Guide

## 🚨 Problem Summary
Admin user login returns `role: "user"` instead of `role: "admin"`

From your debug data:
```json
{
    "originalUser": {
        "username": "admin",
        "role": "user" ← WRONG!
    },
    "sessionToStore": {
        "username": "admin", 
        "role": "user",  ← WRONG!
        "loginTime": 1755268625857
    }
}
```

## 🔍 Root Cause Analysis

The problem is likely in one of these places:

1. **Google Sheets Data**: The `role` column for admin user is "user" instead of "admin"
2. **Google Apps Script**: Not reading the role correctly from sheets
3. **API Response Structure**: Returning wrong role data
4. **Frontend Parsing**: Reading role from wrong location in response

## 🧪 Step-by-Step Debugging

### Step 1: Check Google Sheets Data
1. Open your Google Sheets
2. Go to "users" sheet
3. Find the row where username = "admin"
4. Check the "role" column value

**Expected:**
```
| id | username | password  | role  | created |
|----|----------|-----------|-------|---------|
| 1  | admin    | admin123  | admin | ...     |
```

### Step 2: Use Debug Tools
1. Open: `debug-tools/debug-api-response.html`
2. Click "Check Users in Google Sheets"
3. Click "Test Raw API Response"
4. Compare the role values

### Step 3: Fix the Data Source

#### Option A: Fix in Google Sheets Manually
1. Open Google Sheets
2. Find admin user row
3. Change role from "user" to "admin"
4. Save

#### Option B: Use Fix Script
1. Open Google Apps Script
2. Copy code from `fix-admin-role.js`
3. Run `verifyAdminRole()` first
4. Run `fixAdminRole()` to fix
5. Run `verifyAdminRole()` again to confirm

## 🔧 Immediate Fixes Applied

### 1. Enhanced Debug Logging
Added comprehensive logging in login component to see exact API response structure.

### 2. Updated Google Apps Script
Added `handleLoginGet()` function to support GET requests for login.

### 3. Created Debug Tools
- `debug-tools/debug-api-response.html`: Test raw API responses
- `debug-tools/debug-admin-login.html`: Comprehensive login testing
- `fix-admin-role.js`: Script to fix Google Sheets data

## 🎯 Next Actions

### Immediate (Do Now):
1. **Use the debug tool** to identify exactly where the wrong role is coming from
2. **Fix the data source** (likely Google Sheets)
3. **Test login again**

### If Google Sheets has wrong data:
```sql
-- In Google Sheets, update admin user row:
-- Change role column from "user" to "admin"
```

### If Google Apps Script needs update:
1. Open Google Apps Script console
2. Replace with updated code from `google-apps-script-auth-code.js`
3. Deploy new version

## 🚀 Expected Results After Fix

### Google Sheets should show:
```
admin | admin123 | admin ← Correct!
```

### API Response should be:
```json
{
  "success": true,
  "message": "Login successful", 
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "role": "admin"  ← Correct!
    }
  }
}
```

### Frontend should store:
```json
{
  "originalUser": {
    "username": "admin",
    "role": "admin"  ← Fixed!
  }
}
```

## 🔍 Verification Steps

1. ✅ Open debug tool and test APIs
2. ✅ Check that Google Sheets has correct admin role  
3. ✅ Test login and verify session data
4. ✅ Confirm admin features are accessible

**The fix is ready - just need to identify and correct the data source!** 🎉
