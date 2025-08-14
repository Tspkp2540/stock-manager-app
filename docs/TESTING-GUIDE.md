# 🧪 คู่มือทดสอบระบบ Stock Management + Authentication

## 🔗 URLs ที่ใช้งาน

### 1. Stock Management API:
```
https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec
```

### 2. Authentication API:
```
https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec
```

## 🧪 ขั้นตอนทดสอบ

### 1. ทดสอบ Stock API
เปิดเบราว์เซอร์และไปที่:
```
https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec?action=test
```

**ผลลัพธ์ที่คาดหวัง**:
```json
{
  "success": true,
  "data": {
    "message": "Google Apps Script is working!",
    "version": "1.0",
    "timestamp": "..."
  },
  "timestamp": "..."
}
```

### 2. ทดสอบ Auth API
เปิดเบราว์เซอร์และไปที่:
```
https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=test
```

**ผลลัพธ์ที่คาดหวัง**:
```json
{
  "success": true,
  "data": {
    "message": "Authentication API is working!",
    "version": "1.0",
    "timestamp": "...",
    "endpoints": {
      "login": "POST with action=login",
      "register": "POST with action=register",
      "getUsers": "GET with action=getUsers"
    }
  },
  "timestamp": "..."
}
```

### 3. ตรวจสอบ Google Sheets

#### Stock Sheet:
- **URL**: https://docs.google.com/spreadsheets/d/1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo/edit
- **Headers ใน Row 1**: `id`, `name`, `quantity`, `updated`

#### Users Sheet (ถ้ามี):
- **Tab Name**: "Users"
- **Headers ใน Row 1**: `id`, `username`, `password`, `role`, `created`
- **Default User**: admin/admin123

### 4. ทดสอบ Angular App

#### รัน Application:
```bash
cd /Users/ar657110/Downloads/stock-app
npm start
```

#### เปิดเบราว์เซอร์:
```
http://localhost:4200
```

#### ทดสอบ Login:
- **Username**: `admin`
- **Password**: `admin123`

#### ทดสอบ Stock Management:
1. **ดู Connection Status**:
   - 🟢 "เชื่อมต่อ Google Sheets" = ออนไลน์
   - 🟡 "ใช้ข้อมูลออฟไลน์" = ออฟไลน์

2. **เพิ่มสินค้าทดสอบ**:
   - ชื่อ: "สินค้าทดสอบ"
   - จำนวน: 10

3. **ตรวจสอบใน Google Sheets**:
   - ข้อมูลควรปรากฏในชีตอัตโนมัติ

## 🔧 Troubleshooting

### ❌ หาก Stock API ไม่ทำงาน:
1. ตรวจสอบ SHEET_ID ใน Google Apps Script
2. ตรวจสอบ Headers ในชีต: `id`, `name`, `quantity`, `updated`
3. ตรวจสอบสิทธิ์การเข้าถึงชีต

### ❌ หาก Auth API ไม่ทำงาน:
1. ตรวจสอบว่ามี tab "Users" ในชีต
2. ตรวจสอบ default admin user
3. ตรวจสอบ Headers: `id`, `username`, `password`, `role`, `created`

### ❌ หาก Angular App แสดง "ออฟไลน์":
1. ตรวจสอบ `environment.ts` มี URL ถูกต้อง
2. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
3. ตรวจสอบ CORS ใน Google Apps Script

## 📊 สถานะระบบปัจจุบัน

- ✅ Stock Management API: Deployed
- ✅ Authentication API: Deployed  
- ✅ Angular App: Ready
- ✅ Google Sheets: Configured
- ✅ URLs: Updated

## 🎯 ขั้นตอนต่อไป

1. ทดสอบ APIs ตาม URLs ด้านบน
2. รัน Angular app
3. ทดสอบ login ด้วย admin/admin123
4. ทดสอบเพิ่มข้อมูลสต๊อก
5. ตรวจสอบข้อมูลใน Google Sheets

---
**หมายเหตุ**: หากมีปัญหาใด ให้ทดสอบ API URLs ในเบราว์เซอร์ก่อนเพื่อตรวจสอบว่า Google Apps Script ทำงานถูกต้อง
