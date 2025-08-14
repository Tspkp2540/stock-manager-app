# Google Apps Script Setup Instructions

## ขั้นตอนการตั้งค่า Google Apps Script

### 1. สร้าง Google Apps Script Project
1. ไปที่ https://script.google.com
2. คลิก "+ New project"
3. ตั้งชื่อโปรเจค เช่น "Stock App Auth API"

### 2. ใส่โค้ดใน Script Editor
1. ลบโค้ดเดิมทั้งหมด
2. คัดลอกโค้ดจากไฟล์ `google-apps-script.js` ไปวาง
3. แก้ไข SHEET_ID ให้ตรงกับ Google Sheets ของคุณ

### 3. Deploy Web App
1. คลิก "Deploy" > "New deployment"
2. ตั้งค่า:
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone" (สำหรับการทดสอบ)
3. คลิก "Deploy"
4. คัดลอก "Web app URL"

### 4. อัพเดท Angular Component
1. เปิดไฟล์ `login.component.ts`
2. แทนที่ `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` ด้วย URL ที่ได้จากขั้นตอนที่ 3
3. เซฟไฟล์

### 5. ทดสอบ
1. รัน Angular app
2. ทดสอบ login
3. ตรวจสอบใน Network tab - จะเห็นแค่ request ไป Google Apps Script
4. Response จะเป็นแค่ {success: true/false} ไม่มีข้อมูลผู้ใช้ทั้งหมด

## ข้อดี
- ✅ ซ่อนข้อมูลใน Network tab
- ✅ ไม่มี CSV data ใน response
- ✅ รักษาความปลอดภัยสูงขึ้น
- ✅ ใช้ POST request แทน GET
- ✅ มี error handling ที่ดีขึ้น

## หมายเหตุ
- URL ของ Google Apps Script จะเปลี่ยนทุกครั้งที่ deploy ใหม่
- ถ้าต้องการอัพเดทโค้ด ให้ deploy "New version" แทน "New deployment"
