# 🚀 Netlify Deployment Guide

## ขั้นตอนการ Deploy Stock Manager App บน Netlify

### 📋 Pre-requisites
- ✅ Code ได้ push ขึ้น GitHub แล้ว
- ✅ Google Apps Script APIs พร้อมใช้งาน
- ✅ Google Sheets setup เรียบร้อย

### 🌐 Deploy ผ่าน Netlify Web Interface (แนะนำ)

#### 1. ไปที่ Netlify
- เปิด: https://netlify.com
- Sign up หรือ Log in (ใช้ GitHub account)

#### 2. สร้าง New Site
- คลิก **"New site from Git"**
- เลือก **"GitHub"**
- Authorize Netlify ให้เข้าถึง GitHub account
- เลือก repository: **`Tspkp2540/stock-manager-app`**

#### 3. Configure Build Settings
```
Base directory: (leave empty)
Build command: ng build --configuration=production
Publish directory: dist/stock-app
```

#### 4. Advanced Settings (Optional)
Environment Variables:
```
NODE_VERSION: 18
```

#### 5. Deploy
- คลิก **"Deploy site"**
- รอ build process เสร็จสิ้น (2-3 นาที)
- Site จะได้ URL แบบ: `https://amazing-name-123456.netlify.app`

### 🔧 หลังจาก Deploy สำเร็จ

#### 1. Custom Domain (Optional)
- ไปที่ Site settings > Domain management
- เพิ่ม custom domain ถ้าต้องการ

#### 2. ตั้งค่า HTTPS
- Netlify จะ enable HTTPS อัตโนมัติ
- ใช้ Let's Encrypt certificate ฟรี

#### 3. ทดสอบ App
- เปิด URL ที่ได้รับ
- ทดสอบ login ด้วย admin/admin123
- ตรวจสอบการเชื่อมต่อ Google Sheets

### 🛠️ Troubleshooting

#### Build Failed
หาก build ล้มเหลว:
1. ตรวจสอบ Node.js version (ต้องใช้ v16+)
2. ดู build log ใน Netlify dashboard
3. ตรวจสอบ dependencies ใน package.json

#### Page Not Found (404)
หากเจอ 404 เมื่อ refresh page:
- ✅ ไฟล์ `_redirects` ได้ถูกสร้างแล้ว
- ✅ ไฟล์ `netlify.toml` มี redirect rules

#### API Errors
หาก Google Sheets API ไม่ทำงาน:
1. ตรวจสอบ CORS settings ใน Google Apps Script
2. ตรวจสอบ API URLs ใน Angular services
3. ใช้ browser dev tools ดู network requests

### 🔄 Continuous Deployment

Netlify จะ auto-deploy เมื่อมีการ push ไป GitHub:
- ✅ Auto-deploy จาก main branch
- ✅ Build previews สำหรับ pull requests
- ✅ Rollback ได้ถ้าจำเป็น

### 📊 Monitoring

#### Build Status
- ดูได้ใน Netlify dashboard
- มี notifications ผ่าน email
- มี webhook integrations

#### Analytics (Pro plan)
- Page views
- Unique visitors  
- Traffic sources
- Performance metrics

### 🚨 Security

Netlify มี security features:
- ✅ HTTPS by default
- ✅ Security headers (กำหนดใน netlify.toml)
- ✅ DDoS protection
- ✅ Form spam protection

### 💰 Pricing

**Free Plan** เพียงพอสำหรับโปรเจ็กต์นี้:
- 100GB bandwidth/month
- Unlimited personal repositories
- Deploy previews
- Form handling (100 submissions/month)

---

## 🎯 Next Steps After Deployment

1. **Custom Domain**: เพิ่ม domain ของตัวเอง
2. **Environment Variables**: สำหรับ API keys (ถ้ามี)
3. **Performance**: ใช้ Netlify Analytics
4. **SEO**: เพิ่ม meta tags และ sitemap

🎉 **Congratulations!** Stock Manager App พร้อมใช้งานแล้ว!
