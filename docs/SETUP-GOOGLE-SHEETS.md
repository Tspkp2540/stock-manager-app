# � การตั้งค่า Google Sheets Integration

> ⚠️ **สำคัญ**: ต้องทำตามขั้นตอนนี้ให้ครบทุกขั้นตอน มิฉะนั้นระบบจะไม่ทำงาน!

## � ขั้นตอนที่ 1: สร้าง Google Sheets

1. เปิด [Google Sheets](https://sheets.google.com)
2. สร้าง Spreadsheet ใหม่
3. ตั้งชื่อตาราง เช่น "Stock Management"
4. ใน **แถวแรก** ใส่ header ดังนี้:
   - **A1**: `id`
   - **B1**: `name`  
   - **C1**: `quantity`
   - **D1**: `updated`

5. บันทึก Sheet ID จาก URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

## ⚙️ ขั้นตอนที่ 2: สร้าง Google Apps Script

1. เปิด [Google Apps Script](https://script.google.com)
2. สร้าง New project
3. ตั้งชื่อโปรเจกต์ เช่น "Stock API"
4. ลบโค้ดเดิม แล้วคัดลอกโค้ดจากไฟล์ `google-apps-script-code.js`
5. **🎯 สำคัญ!** แก้ไข `SHEET_ID`:
   ```javascript
   const SHEET_ID = 'ใส่ SHEET_ID ที่คัดลอกไว้';
   ```
   **ตัวอย่าง**: `const SHEET_ID = '1ABC123XYZ789DEF456GHI012JKL345MNO678PQR901';`
6. บันทึกโปรเจกต์ (Ctrl+S)

## 🌐 ขั้นตอนที่ 3: Deploy Web App

1. คลิก **Deploy** → **New deployment**
2. เลือก Type: **Web app**
3. ตั้งค่า:
   - **Execute as**: Me (อีเมลของคุณ)
   - **Who has access**: Anyone
4. คลิก **Deploy**
5. **อนุญาต** การเข้าถึง (Grant permission)
6. คัดลอก **Web app URL**

## ✅ ขั้นตอนที่ 3.5: ทดสอบ Google Apps Script

**ก่อนที่จะไปขั้นตอนถัดไป ให้ทดสอบว่า Script ทำงานได้:**

1. เปิดเบราว์เซอร์ใหม่
2. ไปที่ URL: `YOUR_WEB_APP_URL?action=test`
   - แทนที่ `YOUR_WEB_APP_URL` ด้วย URL ที่คัดลอกมา
3. ถ้าทำงานได้ จะเห็น JSON Response:
   ```json
   {
     "success": true,
     "data": {
       "message": "Google Apps Script is working!",
       "version": "1.0",
       "timestamp": "..."
     }
   }
   ```

**หากเกิดข้อผิดพลาด:**
- ตรวจสอบว่าได้ Grant permission แล้ว
- ลองเปิด URL ใน Incognito mode
- ตรวจสอบว่า SHEET_ID ถูกต้อง

## 🔧 ขั้นตอนที่ 4: อัปเดต Angular App

เปิดไฟล์ `src/environments/environment.ts` และแทนที่:

```typescript
export const environment = {
  production: false,
  apiUrl: 'ใส่ Web app URL ที่คัดลอกไว้'
};
```

## ✅ ขั้นตอนที่ 5: ทดสอบ

1. เปิด Web app URL ใน browser
2. ควรเห็น JSON response:
   ```json
   {
     "success": true,
     "data": [],
     "timestamp": "2025-08-14T..."
   }
   ```

3. รันแอป Angular:
   ```bash
   ng serve
   ```

4. ทดสอบเพิ่มสินค้า → ตรวจสอบใน Google Sheets

## 🔄 การทำงาน

- ✅ **Online**: ข้อมูลจะบันทึกใน Google Sheets
- ⚠️ **Offline**: ข้อมูลจะบันทึกใน LocalStorage ชั่วคราว
- 🔄 **กลับ Online**: ข้อมูลจะโหลดจาก Google Sheets อีกครั้ง

## 🛠️ Troubleshooting

### ❌ Error: "Cannot read properties of undefined (reading 'parameter')"
- **สาเหตุ**: ลืมแทนที่ `SHEET_ID` ใน Google Apps Script
- **แก้ไข**: ไปที่ Google Apps Script → แก้ไข `const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';`

### ❌ Error: "Unexpected error while getting the method or property openById"
- **สาเหตุ**: SHEET_ID ไม่ถูกต้องหรือไม่มีสิทธิ์เข้าถึง
- **แก้ไข**: 
  1. ตรวจสอบ SHEET_ID จาก URL Google Sheets
  2. ตรวจสอบว่า Sheet เป็น public หรือมีสิทธิ์เข้าถึง
  3. ลอง Share Google Sheets ให้ "Anyone with the link can view"

### ❌ ไม่สามารถเพิ่มข้อมูลได้
- ตรวจสอบ CORS settings ใน Google Apps Script
- ตรวจสอบ permissions ของ Web app

### ⚠️ แสดง "ใช้ข้อมูลออฟไลน์"
- ตรวจสอบ `apiUrl` ใน environment.ts
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ตรวจสอบว่า Web app URL ถูกต้อง

### 🔍 วิธีหา Sheet ID
```
URL: https://docs.google.com/spreadsheets/d/1ABC123XYZ789DEF456GHI012JKL345MNO678PQR901/edit
Sheet ID: 1ABC123XYZ789DEF456GHI012JKL345MNO678PQR901
```

## 📝 ข้อมูลเพิ่มเติม

- ข้อมูลจะ sync real-time กับ Google Sheets
- สามารถแก้ไขข้อมูลใน Google Sheets โดยตรง
- ระบบจะ fallback เป็น LocalStorage เมื่อออฟไลน์
