# 📊 โครงสร้าง Google Sheets แยกตามประเภทข้อมูล

## 🎯 แนวคิด: แยก Stock และ Users

### วิธีที่ 1: ใช้ Google Sheets เดียวกัน แยก Tabs ✅ (แนะนำ)
```
Google Sheets: 1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo
├── Tab: "Stock" ← Stock data
│   └── Headers: id | name | quantity | price | updated
└── Tab: "Users" ← User authentication
    └── Headers: id | username | password | role | created
```

### วิธีที่ 2: ใช้ Google Sheets แยกกัน
```
Stock Google Sheets: 1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo
└── Tab: "Stock"
    └── Headers: id | name | quantity | price | updated

Users Google Sheets: [USERS_SHEET_ID]
└── Tab: "Users"  
    └── Headers: id | username | password | role | created
```

## 🔧 ขั้นตอนการตั้งค่า

### สำหรับวิธีที่ 1 (แนะนำ):

#### 1. สร้าง Tab "Users" ใน Google Sheets เดียวกัน:
1. เปิด: https://docs.google.com/spreadsheets/d/1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo/edit
2. คลิกขวาที่ tab ล่าง → "Insert sheet"
3. ตั้งชื่อ: "Users"
4. เพิ่ม headers ใน Row 1: `id | username | password | role | created`
5. เพิ่มข้อมูล admin ใน Row 2: `1 | admin | admin123 | admin | 2025-08-15`

#### 2. ตรวจสอบ APIs:
- **Stock API**: ใช้ tab "Stock"
- **Auth API**: ใช้ tab "Users" (ใน Google Sheets เดียวกัน)

### สำหรับวิธีที่ 2:

#### 1. สร้าง Google Sheets ใหม่สำหรับ Users:
1. ไปที่ Google Sheets
2. สร้าง Spreadsheet ใหม่
3. ตั้งชื่อ: "User Management"
4. เพิ่ม headers: `id | username | password | role | created`
5. เพิ่มข้อมูล admin: `1 | admin | admin123 | admin | 2025-08-15`
6. คัดลอก Sheet ID จาก URL

#### 2. แก้ไข Authentication API:
- เปลี่ยน `SHEET_ID` ใน `google-apps-script-auth-code.js`
- ใส่ Sheet ID ใหม่สำหรับ Users

## 📋 ข้อดี-ข้อเสีย

### วิธีที่ 1: Google Sheets เดียวกัน
**ข้อดี:**
- ✅ จัดการง่าย (1 Google Sheets)
- ✅ Permissions เดียวกัน
- ✅ Backup ง่าย

**ข้อเสีย:**
- ❌ ข้อมูล Stock และ Users อยู่ที่เดียวกัน

### วิธีที่ 2: Google Sheets แยกกัน
**ข้อดี:**
- ✅ แยกข้อมูล Stock และ Users
- ✅ Security ดีกว่า (แยก permissions)
- ✅ Scale ได้ดีกว่า

**ข้อเสีย:**
- ❌ จัดการ 2 Google Sheets
- ❌ Permissions 2 ชุด
- ❌ ซับซ้อนกว่า

## 🚀 การใช้งาน

### Current Status:
- **Stock API**: ✅ พร้อม (ใช้ tab "Stock")
- **Auth API**: ⏳ รอการตัดสินใจ

### Next Steps:
1. เลือกวิธีที่ 1 หรือ 2
2. ตั้งค่า Google Sheets ตามที่เลือก
3. อัปเดต Authentication API
4. ทดสอบระบบ

## 💡 คำแนะนำ

**สำหรับระบบ Stock Management ขนาดเล็กถึงกลาง:**
→ แนะนำ **วิธีที่ 1** (Google Sheets เดียวกัน แยก tabs)

**สำหรับระบบขนาดใหญ่หรือต้องการ Security สูง:**
→ แนะนำ **วิธีที่ 2** (Google Sheets แยกกัน)

---

**คำถาม**: คุณต้องการใช้วิธีไหนครับ? 
1️⃣ Google Sheets เดียวกัน แยก tabs
2️⃣ Google Sheets แยกกันทีเดียว
