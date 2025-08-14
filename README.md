# 📦 Stock Manager App

ระบบจัดการสินค้าด้วย Angular และ Google Sheets โดยมีระบบ Authentication และ Role-based Permissions

## 🌟 Features

- **📊 จัดการสินค้า**: เพิ่ม, แก้ไข, ลบ, และดูรายการสินค้า
- **🔐 ระบบ Authentication**: Login/Logout ด้วยระบบ session
- **👥 Role-based Permissions**: 
  - **Admin**: สามารถเพิ่ม, ลบสินค้าได้
  - **User**: สามารถดูรายการสินค้าได้อย่างเดียว
- **🌐 Google Sheets Integration**: เก็บข้อมูลใน Google Sheets
- **💾 Offline Support**: ทำงานออฟไลน์ได้เมื่อไม่มีเน็ต
- **🎨 Responsive Design**: ใช้งานได้บนมือถือและคอมพิวเตอร์

## 🚀 Tech Stack

- **Frontend**: Angular 18.2.13
- **UI Framework**: Angular Material
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Styling**: Custom CSS with modern design
- **Notifications**: SweetAlert2

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── add-item/          # เพิ่มสินค้า (Admin only)
│   │   ├── login/             # หน้า Login
│   │   ├── logout/            # ปุ่ม Logout
│   │   ├── navigation/        # Navigation buttons
│   │   └── stock-list/        # แสดงรายการสินค้า
│   ├── models/
│   │   └── item.model.ts      # Data model สำหรับสินค้า
│   ├── services/
│   │   ├── auth.service.ts    # Authentication & Authorization
│   │   └── stock.service.ts   # Stock management
│   └── app.component.*        # Main app component
├── environments/              # Environment configurations
└── assets/                   # Static assets
```

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone [repository-url]
cd stock-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Google Apps Script Setup
1. สร้าง Google Sheets ใหม่
2. ไปที่ Extensions > Apps Script
3. Copy code จากไฟล์ `google-apps-script-code.js` (สำหรับ Stock management)
4. Copy code จากไฟล์ `google-apps-script-auth-code.js` (สำหรับ Authentication)
5. Deploy เป็น Web app และ copy URL

### 4. Configure API URLs
แก้ไข URL ในไฟล์:
- `src/app/services/stock.service.ts`
- `src/app/services/auth.service.ts` (ถ้าใช้)

### 5. Setup Google Sheets Structure
#### Sheet "Stock":
| id | name | quantity | price | updated |
|----|------|----------|-------|---------|

#### Sheet "Users":
| id | username | password | role | created |
|----|----------|----------|------|---------|
| 1  | admin    | admin123 | admin| [date]  |

### 6. Run the application
```bash
npm start
```

## 🔑 Default Login Credentials

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`
  - Permissions: Add, Delete, View stock

## 🎨 Color Scheme

- Primary: `#344648` (Dark slate gray)
- Secondary: `#7D8E95` (Light slate gray)  
- Accent 1: `#FBE0C3` (Light peach)
- Accent 2: `#FFBB98` (Peach)

## 📱 Responsive Design

- ✅ Mobile-friendly
- ✅ Tablet optimized
- ✅ Desktop responsive
- ✅ Touch-friendly buttons

## 🔒 Security Features

- Session-based authentication
- Role-based access control
- Password protection
- Secure API endpoints
- Input validation

## 🌐 API Endpoints

### Stock Management API
- `GET ?action=getItems` - ดึงรายการสินค้าทั้งหมด
- `POST ?action=addItem` - เพิ่มสินค้าใหม่
- `POST ?action=deleteItem` - ลบสินค้า

### Authentication API
- `POST ?action=login` - เข้าสู่ระบบ
- `POST ?action=register` - สมัครสมาชิก (ถ้าเปิดใช้)
- `GET ?action=getUsers` - ดึงรายการผู้ใช้

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย:

1. **CORS Error**: ตรวจสอบว่า Google Apps Script deploy เป็น Web app แล้ว
2. **Permission Denied**: ตรวจสอบสิทธิ์ Google Sheets
3. **Role ไม่ถูกต้อง**: ตรวจสอบข้อมูลใน Sheet "Users"

### Debug Tools:
- เปิด `debug-session.html` เพื่อ debug session
- เปิด `auth-test.html` เพื่อทดสอบ authentication
- เปิด `quick-test.html` เพื่อทดสอบ API

## 📄 License

MIT License

## 👨‍💻 Development

```bash
# Development server
ng serve

# Build for production
ng build

# Run tests (ถ้ามี)
ng test
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

⭐ หากโปรเจ็กต์นี้มีประโยชน์ กรุณา Star ให้ด้วยนะครับ!
