# Google Apps Script Debug Checklist

## 1. ตรวจสอบ Google Sheets Structure
ใน Google Sheets ต้องมี columns ตามนี้ (แถวแรกคือ header):
```
username | password | role
admin    | 123456   | admin
user1    | pass123  | user
```

## 2. ตรวจสอบ Google Apps Script
1. ไปที่ https://script.google.com
2. เปิด project ของคุณ
3. ตรวจสอบว่า SHEET_ID ถูกต้อง
4. ลองรันฟังก์ชัน doPost ใน script editor เพื่อดู error

## 3. ตรวจสอบ Deployment
1. คลิก "Deploy" > "Manage deployments"
2. ตรวจสอบ:
   - Execute as: Me (your-email@gmail.com)
   - Who has access: Anyone
3. คัดลอก Web app URL

## 4. ทดสอบ Google Apps Script โดยตรง
ใช้ Postman หรือ curl ทดสอบ:
```bash
curl -X POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

## 5. ตรวจสอบ Permissions
Google Apps Script ต้องได้รับสิทธิ์:
- Google Sheets API access
- Google Drive access (ถ้าจำเป็น)

## Common Issues:
- SHEET_ID ไม่ถูกต้อง
- Google Sheets ไม่มี public access
- Script ไม่ได้ authorize กับ Google Sheets
- URL ของ Web App เปลี่ยนหลังจาก redeploy
