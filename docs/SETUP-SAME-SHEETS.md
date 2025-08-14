# 🎯 Setup Guide: Google Sheets เดียวกัน แยก Tabs

## 📊 โครงสร้างที่จะได้:
```
Google Sheets: 1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo
├── Tab: "Stock" ← Stock data (มีอยู่แล้ว)
│   └── Headers: id | name | quantity | price | updated
└── Tab: "Users" ← User data (ต้องสร้างใหม่)
    └── Headers: id | username | password | role | created
```

## 🛠️ ขั้นตอนการตั้งค่า

### Step 1: สร้าง Tab "Users" ใน Google Sheets

1. **เปิด Google Sheets:**
   ```
   https://docs.google.com/spreadsheets/d/1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo/edit
   ```

2. **สร้าง Tab ใหม่:**
   - คลิกขวาที่ tab ล่าง (ข้าง tab "Stock")
   - เลือก "Insert sheet"
   - ตั้งชื่อ: **"Users"**
   - คลิก "Done"

3. **เพิ่ม Headers ใน Row 1:**
   ```
   A1: id
   B1: username
   C1: password
   D1: role
   E1: created
   ```

4. **เพิ่มข้อมูล Admin ใน Row 2:**
   ```
   A2: 1
   B2: admin
   C2: admin123
   D2: admin
   E2: 2025-08-15
   ```

### Step 2: ตรวจสอบ Tab "Stock"

1. **ตรวจสอบ Headers ใน Row 1:**
   ```
   A1: id
   B1: name
   C1: quantity
   D1: price
   E1: updated
   ```

2. **หากไม่มี Headers ให้เพิ่ม**

### Step 3: อัปเดต Google Apps Scripts (ไม่ต้องเปลี่ยน)

✅ **Stock API**: ใช้ tab "Stock" (พร้อมอยู่แล้ว)
✅ **Auth API**: ใช้ tab "Users" (พร้อมอยู่แล้ว)

## 🧪 ทดสอบระบบ

### 1. ทดสอบ Stock API:
```
https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec?action=getItems
```

### 2. ทดสอบ Auth API:
```
https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=test
```

### 3. ทดสอบ Angular App:
```bash
npm start
```
- Login: `admin` / `admin123`

## 📋 Checklist

### Google Sheets Setup:
- [ ] มี tab "Stock" พร้อม headers: id, name, quantity, price, updated
- [ ] มี tab "Users" พร้อม headers: id, username, password, role, created  
- [ ] มีข้อมูล admin ใน tab "Users"

### APIs Status:
- [ ] Stock API ทำงาน (ดึงข้อมูลจาก tab "Stock")
- [ ] Auth API ทำงาน (ตรวจสอบ login จาก tab "Users")

### Angular App:
- [ ] Login สำเร็จด้วย admin/admin123
- [ ] แสดงข้อมูล Stock 
- [ ] เพิ่ม Stock items ได้
- [ ] ข้อมูลบันทึกใน Google Sheets

## 🎉 ผลลัพธ์ที่คาดหวัง

### หลังจากตั้งค่าเสร็จ:
1. **Google Sheets จะมี 2 tabs**: Stock และ Users
2. **Stock API จะอ่าน/เขียน**: tab "Stock"  
3. **Auth API จะอ่าน**: tab "Users"
4. **Angular App จะทำงาน**: Login → Stock Management

### ข้อดี:
- ✅ จัดการง่าย (1 Google Sheets)
- ✅ Backup ง่าย
- ✅ Permissions เดียวกัน
- ✅ แยกข้อมูล Stock/Users ชัดเจน

---

## 🚀 Next Action

**ทำตามขั้นตอนข้างบนแล้วบอกผลลัพธ์:**
1. สร้าง tab "Users" เสร็จหรือยัง?
2. Headers ครบหรือยัง? 
3. APIs ทำงานหรือยัง?
