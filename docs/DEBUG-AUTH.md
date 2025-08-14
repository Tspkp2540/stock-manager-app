# 🐛 Debug Guide for Authentication Issue

## ปัญหาที่พบ
- Google Sheets มีข้อมูล: `1 | admin | admin123 | Admin | 2025/08/15`
- Login ไม่สำเร็จ แสดง "ข้อมูลไม่ถูกต้อง"

## 🔍 วิธีแก้ไข

### ขั้นตอนที่ 1: ตรวจสอบ Headers ใน Google Sheets

1. เปิด Google Sheets: https://docs.google.com/spreadsheets/d/1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo/edit

2. ไปที่ Tab "Users"

3. **ตรวจสอบ Row 1 (Headers) ต้องเป็น**:
   ```
   A1: id
   B1: username  
   C1: password
   D1: role
   E1: created
   ```

4. **ตรวจสอบ Row 2 (Data) ต้องเป็น**:
   ```
   A2: 1
   B2: admin
   C2: admin123  
   D2: admin    (ตัวเล็กทั้งหมด)
   E2: 2025-08-15...
   ```

### ขั้นตอนที่ 2: ทดสอบ Auth API

เปิดเบราว์เซอร์และไปที่ URL นี้:
```
https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=test
```

ควรเห็น response:
```json
{
  "success": true,
  "data": {
    "message": "Authentication API is working!",
    ...
  }
}
```

### ขั้นตอนที่ 3: ทดสอบ Debug Mode

1. Login ผ่าน Angular app
2. เปิด Developer Tools (F12)  
3. ดู Console logs
4. ดู Network tab สำหรับ API calls

### ขั้นตอนที่ 4: Manual Test

ใช้ Postman หรือ curl:
```bash
curl -X POST \
  "https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔧 วิธีแก้ไขที่น่าจะได้ผล

### 1. แก้ไข Google Sheets:
- เปลี่ยน "Admin" เป็น "admin" (ตัวเล็ก)
- ตรวจสอบไม่มีช่องว่างเพิ่ม

### 2. หรือใช้ Debug Version:
โค้ดใหม่ที่ฉันแก้ไขจะแสดง debug information ใน error message

### 3. ทดสอบขั้นเบื้องต้น:
ลองใส่ข้อมูล admin ใหม่ใน row 3:
```
A3: 2
B3: admin  
C3: admin123
D3: admin
E3: 2025-08-15
```

## 📋 Checklist

- [ ] Headers ใน Row 1 ถูกต้อง
- [ ] ข้อมูล admin ใน Row 2 ถูกต้อง  
- [ ] role เป็น "admin" (ตัวเล็ก)
- [ ] ไม่มีช่องว่างเพิ่ม
- [ ] Auth API ทำงานได้ (ทดสอบด้วย ?action=test)
- [ ] Deploy Google Apps Script ใหม่

## 🚨 หากยังไม่ได้

1. ลบ tab "Users" ทั้งหมด
2. Google Apps Script จะสร้างใหม่อัตโนมัติพร้อม default admin
3. Deploy ใหม่
4. ทดสอบอีกครั้ง
