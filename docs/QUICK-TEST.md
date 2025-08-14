# 🔍 Quick Test for Google Sheets API

## 🧪 ทดสอบ APIs

### 1. Test Stock API (GET):
```
https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec?action=test
```

### 2. Test Stock API (GET Items):
```
https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec?action=getItems
```

### 3. Test Auth API:
```
https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=test
```

## 📊 Expected Responses:

### Stock API Test:
```json
{
  "success": true,
  "data": {
    "message": "Google Apps Script is working!",
    "version": "1.0"
  }
}
```

### Get Items:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "ชื่อสินค้า",
      "quantity": "จำนวน",
      "updated": "..."
    }
  ]
}
```

### Auth API Test:
```json
{
  "success": true,
  "data": {
    "message": "Authentication API is working!",
    "endpoints": {...}
  }
}
```

## ⚠️ Common Issues:

1. **"Script function not found"**: ตรวจสอบว่า Deploy แล้วหรือยัง
2. **"Permission denied"**: ตรวจสอบ Execute as: Me, Who has access: Anyone
3. **"Empty response"**: ตรวจสอบ Google Sheets permissions
4. **"CORS error"**: Normal สำหรับ browser requests

## 🔧 Debug Steps:

1. ทดสอบ URLs ข้างบนในเบราว์เซอร์
2. หาก error, ดู Google Apps Script logs
3. ตรวจสอบ Google Sheets permissions
4. ตรวจสอบว่ามี headers ใน Sheet1: `id | name | quantity | updated`

## 📱 Test with Angular App:

1. `npm start`
2. Login: admin/admin123
3. เพิ่มสินค้าทดสอบ
4. ตรวจสอบใน Google Sheets ว่ามีข้อมูลเพิ่มเข้าไปหรือไม่

---

## 🚨 If APIs not working:

1. Re-deploy Google Apps Scripts
2. Check permissions in Google Cloud Console
3. Try creating new deployment
4. Check Sheet ID in both scripts
