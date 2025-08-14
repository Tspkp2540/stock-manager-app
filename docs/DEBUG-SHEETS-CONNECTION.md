# 🔍 Debug Guide: Google Sheets Connection Issues

## 🚨 ปัญหา: Stock API ไม่เชื่อมต่อ Google Sheets

### ขั้นตอนการแก้ไขปัญหา:

## 1. 🧪 ทดสอบการเชื่อมต่อ Google Sheets

### วิธีที่ 1: ใช้ Debug Script
1. ไปที่ Google Apps Script ของ Stock API
2. แทนที่โค้ดทั้งหมดด้วยโค้ดจาก `debug-sheets-connection.js`
3. Save และ Deploy ใหม่
4. ทดสอบที่ URL:
   ```
   https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec
   ```

### วิธีที่ 2: ตรวจสอบ Google Sheets โดยตรง
1. เปิด: https://docs.google.com/spreadsheets/d/1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo/edit
2. ตรวจสอบว่ามี tab "Sheet1" หรือไม่
3. ตรวจสอบว่ามี headers: `id | name | quantity | price | updated`
4. ตรวจสอบสิทธิ์การเข้าถึง (Share settings)

## 2. 🔧 สาเหตุที่เป็นไปได้

### ❌ Sheet Name ไม่ถูกต้อง
- **ปัญหา**: Apps Script หา "Sheet1" แต่ชื่อจริงอาจเป็น "Sheet 1" หรืออื่น
- **แก้ไข**: ตรวจสอบชื่อ tab ในGoogle Sheets

### ❌ Headers ไม่ครบหรือไม่ถูกต้อง
- **ปัญหา**: ไม่มี headers หรือ headers ไม่ตรงกับที่ Apps Script คาดหวัง
- **แก้ไข**: เพิ่ม headers: `id | name | quantity | price | updated`

### ❌ Permissions ไม่ถูกต้อง
- **ปัญหา**: Google Apps Script ไม่มีสิทธิ์เข้าถึง Google Sheets
- **แก้ไข**: Re-deploy Apps Script และให้สิทธิ์ใหม่

### ❌ SHEET_ID ผิด
- **ปัญหา**: Sheet ID ในโค้ดไม่ตรงกับจริง
- **แก้ไข**: ตรวจสอบ URL Google Sheets

## 3. 🛠️ การแก้ไขทีละขั้นตอน

### Step 1: ตรวจสอบ Sheet ID
```
URL: https://docs.google.com/spreadsheets/d/1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo/edit
Sheet ID: 1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo ✅
```

### Step 2: ตรวจสอบ Sheet Name และ Headers
1. เปิด Google Sheets
2. ดู tab name (ควรเป็น "Sheet1")
3. ตรวจสอบ Row 1: `id | name | quantity | price | updated`

### Step 3: ทดสอบด้วย Debug Script
1. ใช้โค้ดจาก `debug-sheets-connection.js`
2. Deploy และทดสอบ
3. ดู response ว่าเชื่อมต่อได้หรือไม่

### Step 4: แก้ไขปัญหาตาม Debug Results

#### หาก Sheet ไม่พบ:
```json
{
  "success": false,
  "error": "Sheet not found",
  "availableSheets": ["Sheet 1", "Users"]
}
```
**แก้ไข**: เปลี่ยน SHEET_NAME ใน Apps Script เป็น "Sheet 1"

#### หาก Sheet ว่าง:
```json
{
  "success": true,
  "isEmpty": true,
  "message": "Sheet is empty"
}
```
**แก้ไข**: เพิ่ม headers ใน Row 1

#### หาก Headers ไม่ถูกต้อง:
```json
{
  "success": true,
  "headers": ["col1", "col2", "col3"]
}
```
**แก้ไข**: แก้ไข headers เป็น: `id | name | quantity | price | updated`

## 4. 🎯 แก้ไขอัตโนมัติ

หากต้องการแก้ไขอัตโนมัติ ใช้ฟังก์ชัน `setupSheet()` ใน debug script:

```javascript
// เรียกใช้ใน Apps Script Console
setupSheet();
```

## 5. ✅ ขั้นตอนสุดท้าย

เมื่อแก้ไขเสร็จแล้ว:
1. แทนที่โค้ด debug ด้วยโค้ดจริงจาก `google-apps-script-code.js`
2. Save และ Deploy
3. ทดสอบ Angular App
4. ตรวจสอบข้อมูลใน Google Sheets

## 📞 Common Error Messages

### "Cannot find sheet named 'Sheet1'"
**แก้ไข**: เปลี่ยนชื่อ tab เป็น "Sheet1" หรือแก้ไข SHEET_NAME ในโค้ด

### "You do not have permission to access this sheet"
**แก้ไข**: Share Google Sheets ให้ Google Apps Script หรือตั้งเป็น Public

### "Range is empty"
**แก้ไข**: เพิ่มข้อมูลใน Google Sheets หรือเพิ่ม headers

---

## 🚀 Quick Fix Commands

### ทดสอบเร่งด่วน:
1. Replace code with debug script
2. Test URL
3. Fix issues based on response
4. Restore original code
5. Test Angular app
