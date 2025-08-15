# 🚨 Local vs Production Issue - Analysis & Solutions

## 📊 Problem Analysis

**Problem:** Local ทำงานถูก (admin role = "admin") แต่ Production ผิด (admin role = "user")

## 🔍 Possible Root Causes

### 1. **Environment Variables Issue**
- Production build ไม่ได้ใช้ environment.prod.ts  
- File replacement ใน angular.json ไม่ทำงาน
- Build process มีปัญหา

### 2. **CORS Origin-Based Behavior**  
- Google Apps Script มี behavior ต่างกันตาม origin
- Localhost vs production domain ได้ response ต่างกัน
- CORS headers มีผลต่อ API response

### 3. **Build Configuration Issues**
- TypeScript compilation errors
- Missing dependencies ใน production build
- Angular configuration ผิด

### 4. **Google Apps Script Deployment**
- Different deployment versions
- Cache issues ใน Google Apps Script
- Permissions settings ต่างกัน

## 🔧 Immediate Solutions

### Solution 1: Force Environment Configuration
สร้าง environment detection ใน runtime:

```typescript
// Add to login component
ngOnInit() {
  const isProduction = window.location.hostname.includes('netlify.app');
  console.log('🌍 Environment detected:', isProduction ? 'PRODUCTION' : 'LOCAL');
  
  if (isProduction) {
    console.log('🔧 Forcing production API behavior');
    // Add production-specific logic
  }
}
```

### Solution 2: API Response Debugging
เพิ่ม detailed logging ใน production:

```typescript
// In login component
console.log('🔍 PRODUCTION DEBUG:', {
  origin: window.location.origin,
  hostname: window.location.hostname,
  isProduction: environment.production,
  apiUrl: environment.authApiUrl,
  rawResponse: response,
  parsedRole: response.data?.user?.role
});
```

### Solution 3: Google Apps Script Fix
เพิ่ม origin-aware logic ใน Google Apps Script:

```javascript
function handleLoginGet(e) {
  // Get request origin
  const origin = e.parameters?.origin || 'unknown';
  
  // Log for debugging
  console.log('Request from origin:', origin);
  
  // Force admin role for specific origins
  if (userData.username === 'admin') {
    userData.role = 'admin'; // Force correct role
  }
  
  return createResponse(true, 'Login successful', {
    user: userData,
    debug: { origin: origin }
  });
}
```

## 🧪 Debug Steps

### Step 1: Test Current Environment
```javascript
console.log('Environment check:', {
  hostname: window.location.hostname,
  origin: window.location.origin,
  isLocalhost: window.location.hostname.includes('localhost'),
  isNetlify: window.location.hostname.includes('netlify.app'),
  environmentProduction: environment.production
});
```

### Step 2: Compare API Responses
1. Test login on localhost → log response
2. Test login on production → log response  
3. Compare the role values
4. Check if API URLs are different

### Step 3: Manual Google Sheets Check
1. Open Google Sheets directly
2. Find admin user row
3. Verify role column = "admin"
4. Test Google Apps Script in Apps Script editor

## 🎯 Quick Fixes to Try

### Fix 1: Hardcode Admin Role (Temporary)
```typescript
// In login component - temporary fix
if (response.success && this.username === 'admin') {
  const userData = {
    id: response.data?.user?.id || '1',
    username: 'admin',
    role: 'admin' // Force admin role
  };
  console.log('🔧 FORCED ADMIN ROLE:', userData);
  this.authService.login(userData);
}
```

### Fix 2: Update Google Apps Script
Add this to handleLoginGet function:
```javascript
// Force admin role for admin user
if (dbUsername === 'admin' && dbPassword === password) {
  return createResponse(true, 'Login successful', {
    user: {
      id: dbId,
      username: dbUsername,
      role: 'admin' // Force admin role
    }
  });
}
```

### Fix 3: Environment-Specific API URLs
```typescript
// In environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://script.google.com/.../exec',
  authApiUrl: 'https://script.google.com/.../exec',
  forceAdminRole: true // Add flag
};
```

## 🚀 Deployment Strategy

1. **Deploy debug version** to production with extra logging
2. **Compare logs** between local and production
3. **Apply targeted fix** based on findings  
4. **Test and verify** admin role works correctly

## 💡 Recommended Action Plan

1. ✅ Use debug tools created: `debug-tools/local-vs-production.html`
2. ✅ Deploy with hardcoded admin role (temporary fix)
3. ✅ Compare production vs local API responses
4. ✅ Fix root cause (Google Sheets or Apps Script)
5. ✅ Remove temporary hardcode fix

**The tools and fixes are ready - deploy and compare!** 🎉
