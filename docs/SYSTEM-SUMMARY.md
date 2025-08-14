# 🎯 ข้อมูลสรุประบบ Stock Management

## 📡 APIs ที่ Deploy แล้ว

### 🛒 Stock Management API:
```
https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec
```
- **ไฟล์โค้ด**: `google-apps-script-code.js`
- **Google Sheet**: หลัก (Sheet1)
- **หน้าที่**: จัดการข้อมูลสต๊อก (เพิ่ม/ลบ/แก้ไข/ดู)

### 🔐 Authentication API:
```
https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec
```
- **ไฟล์โค้ด**: `google-apps-script-auth-code.js`
- **Google Sheet**: Users tab
- **หน้าที่**: ระบบ Login/Register

## 🗂️ Google Sheets Structure

### Sheet ID: `1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo`

#### Tab "Sheet1" (Stock Data):
| id | name | quantity | updated |
|----|------|----------|---------|
| 1  | สินค้าตัวอย่าง | 10 | 2025-08-15... |

#### Tab "Users" (Authentication):
| id | username | password | role | created |
|----|----------|----------|------|---------|
| 1  | admin    | admin123 | admin| 2025-08-15... |

## 🔧 Angular Configuration

### `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec'
};
```

### `src/app/components/login/login.component.ts`:
```typescript
private readonly authApiUrl = 'https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec';
```

## 🧪 Quick Test Commands

### 1. Test Stock API:
```bash
curl "https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec?action=test"
```

### 2. Test Auth API:
```bash
curl "https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=test"
```

### 3. Run Angular App:
```bash
npm start
```

## 🎮 Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

## 🎨 Color Scheme Applied

- **Primary**: #FBE0C3 (ครีมอ่อน)
- **Secondary**: #FFBB98 (ส้มอ่อน)  
- **Accent**: #7D8E95 (เทาน้ำเงิน)
- **Dark**: #344648 (เทาเข้ม)

## ✅ System Features

### 🔄 Hybrid Mode:
- ✅ Online: ข้อมูลซิงค์กับ Google Sheets
- ✅ Offline: ข้อมูลบันทึกใน LocalStorage
- ✅ Auto Detection: ตรวจสอบสถานะออนไลน์/ออฟไลน์อัตโนมัติ

### 🛡️ Security:
- ✅ Authentication system
- ✅ Password validation  
- ✅ Session management
- ✅ Error handling

### 🎯 Stock Management:
- ✅ Add/Edit/Delete items
- ✅ Real-time sync with Google Sheets
- ✅ Search and filter
- ✅ Responsive design

## 🚀 Ready to Go!

ระบบพร้อมใช้งาน 100%! 🎉

สั่งรัน: `npm start` แล้วเปิด http://localhost:4200
