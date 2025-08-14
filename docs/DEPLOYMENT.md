# 🚀 Deployment Guide

คำแนะนำสำหรับ Deploy Stock Manager App

## 📋 Pre-deployment Checklist

- [ ] Google Sheets พร้อมใช้งาน
- [ ] Google Apps Script deployed และมี URL แล้ว
- [ ] ทดสอบ API endpoints แล้ว
- [ ] Admin user ใน Google Sheets พร้อมใช้งาน
- [ ] Build production ผ่าน

## 🔧 Google Apps Script Setup

### 1. สร้าง Google Sheets
1. ไปที่ https://sheets.google.com
2. สร้าง Spreadsheet ใหม่
3. เปลี่ยนชื่อ Sheet แรกเป็น "Stock"
4. สร้าง Sheet ใหม่ชื่อ "Users"

### 2. Setup Sheet Structure

#### Sheet: "Stock"
```
A1: id | B1: name | C1: quantity | D1: price | E1: updated
```

#### Sheet: "Users"  
```
A1: id | B1: username | C1: password | D1: role | E1: created
A2: 1  | B2: admin    | C2: admin123 | D2: admin | E2: [current_date]
```

### 3. Deploy Apps Scripts

#### Stock Management API:
1. ไปที่ Extensions > Apps Script
2. ลบ code เก่าใน Code.gs
3. Copy code ทั้งหมดจาก `google-apps-script-code.js`
4. แทนที่ `YOUR_GOOGLE_SHEET_ID` ด้วย Sheet ID จริง
5. Save และ Deploy > New deployment
6. Type: Web app
7. Execute as: Me
8. Who has access: Anyone
9. Copy Web app URL

#### Authentication API:
1. สร้าง Google Apps Script project ใหม่
2. Copy code จาก `google-apps-script-auth-code.js`
3. แทนที่ Sheet ID
4. Deploy เหมือนข้างต้น
5. Copy Web app URL

## 🌐 Update API URLs in Angular

### 1. Stock Service
แก้ไขใน `src/app/services/stock.service.ts`:
```typescript
private apiUrl = 'YOUR_STOCK_API_URL_HERE';
```

### 2. Auth Service (ถ้าใช้)
แก้ไขใน `src/app/services/auth.service.ts`:
```typescript
private authApiUrl = 'YOUR_AUTH_API_URL_HERE';
```

## 🏗️ Build for Production

```bash
# Install dependencies
npm install

# Build for production
ng build --configuration=production

# หรือ
npm run build
```

## 🚀 Deployment Options

### Option 1: GitHub Pages
```bash
# Install angular-cli-ghpages
npm install -g angular-cli-ghpages

# Build และ deploy
ng build --configuration=production --base-href="https://yourusername.github.io/repository-name/"
npx angular-cli-ghpages --dir=dist/stock-app
```

### Option 2: Netlify
1. Build project: `ng build --configuration=production`
2. Upload `dist/stock-app` folder to Netlify
3. หรือเชื่อม Git repository ให้ auto-deploy

### Option 3: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 4: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login และ init
firebase login
firebase init hosting

# Build และ deploy
ng build --configuration=production
firebase deploy
```

## ✅ Post-deployment Testing

### 1. Basic Functionality Test
- [ ] เปิดเว็บได้
- [ ] หน้า Login แสดงถูกต้อง
- [ ] Login ด้วย admin/admin123 ได้
- [ ] แสดงรายการสินค้า
- [ ] เพิ่มสินค้าได้ (admin)
- [ ] ลบสินค้าได้ (admin)

### 2. Permission Test
- [ ] สร้าง user account ใหม่
- [ ] Login ด้วย user account
- [ ] ไม่เห็นปุ่มเพิ่ม/ลบสินค้า
- [ ] เห็นข้อความ "ไม่มีสิทธิ์"

### 3. Mobile Test
- [ ] ใช้งานบนมือถือได้
- [ ] Responsive design ถูกต้อง
- [ ] Touch interaction ทำงาน

## 🔍 Troubleshooting

### CORS Issues
หาก API ไม่ทำงาน:
1. ตรวจสอบว่า Google Apps Script deploy ถูกต้อง
2. ตรวจสอบ "Who has access" = Anyone
3. ลองเปิด API URL ใน browser ตรงๆ

### Permission Issues  
หาก role ไม่ถูกต้อง:
1. ตรวจสอบข้อมูลใน Google Sheets
2. ลบ localStorage และ login ใหม่
3. ใช้ debug tools ใน `/debug-session.html`

### Build Issues
หาก build ไม่ผ่าน:
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Update Angular CLI
npm update -g @angular/cli
```

## 📱 Production Optimizations

### Performance
- ✅ Production build ใช้ minification
- ✅ Tree shaking enabled
- ✅ Lazy loading (ถ้าใช้)

### SEO
- ✅ Title และ meta tags
- ✅ Proper HTML structure
- ✅ Alt texts สำหรับ images

### Security
- ✅ API keys ไม่อยู่ใน client code
- ✅ HTTPS enabled
- ✅ Input validation

## 🔄 Continuous Deployment

### GitHub Actions Example
สร้าง `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: ng build --configuration=production --base-href="/repository-name/"
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/stock-app
```

---

🎯 **Ready to deploy!** หากมีปัญหาในการ deploy สามารถดูที่ troubleshooting section หรือสร้าง issue ใน repository ได้ครับ
