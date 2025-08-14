// Google Apps Script Code - ใส่ใน script.google.com
function doPost(e) {
  try {
    // เพิ่ม logging สำหรับ debugging
    console.log('Received event:', e);
    console.log('postData:', e.postData);
    
    const response = {
      success: false,
      message: 'Unknown error'
    };
    
    // ตรวจสอบว่ามี event object หรือไม่
    if (!e) {
      response.message = 'ไม่พบ event object';
      return createResponse(response);
    }
    
    // ตรวจสอบว่ามีข้อมูล POST หรือไม่
    if (!e.postData) {
      response.message = 'ไม่พบ postData - กรุณาส่งข้อมูลแบบ POST';
      return createResponse(response);
    }
    
    if (!e.postData.contents) {
      response.message = 'ไม่พบ postData contents';
      return createResponse(response);
    }
    
    // รับข้อมูลจาก POST request
    console.log('postData contents:', e.postData.contents);
    const data = JSON.parse(e.postData.contents);
    const username = data.username;
    const password = data.password;
    
    console.log('Parsed data:', { username: username, password: '***' });
    
    if (!username || !password) {
      response.message = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      return createResponse(response);
    }
    
    // ใส่ Spreadsheet ID ของคุณที่นี่ (จาก URL edit ของ Google Sheets)
    // URL: https://docs.google.com/spreadsheets/d/1aeiIjj7RX24Qpp3wgAnoYxdf8WAONxIEEidLg1i-quY/edit
    const SHEET_ID = '1aeiIjj7RX24Qpp3wgAnoYxdf8WAONxIEEidLg1i-quY';
    
    // เปิด Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    // หา header row
    const headers = values[0];
    const usernameCol = headers.indexOf('username');
    const passwordCol = headers.indexOf('password');
    const roleCol = headers.indexOf('role');
    
    if (usernameCol === -1 || passwordCol === -1) {
      response.message = 'ไม่พบคอลัมน์ username หรือ password ใน Google Sheets';
      return createResponse(response);
    }
    
    // ตรวจสอบผู้ใช้
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[usernameCol] && row[passwordCol]) {
        if (row[usernameCol].toString().toLowerCase().trim() === username.toLowerCase().trim() &&
            row[passwordCol].toString().trim() === password.trim()) {
          
          // ส่งกลับข้อมูลที่จำเป็นเท่านั้น
          response.success = true;
          response.user = {
            username: row[usernameCol],
            role: row[roleCol] || 'user'
          };
          delete response.message;
          return createResponse(response);
        }
      }
    }
    
    // ไม่พบผู้ใช้
    response.message = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    return createResponse(response);
      
  } catch (error) {
    console.error('Google Apps Script Error:', error);
    return createResponse({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.toString()
    });
  }
}

// ฟังก์ชันสำหรับสร้าง response พร้อม CORS headers
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// สำหรับ CORS
function doGet(e) {
  return ContentService
    .createTextOutput('This endpoint only accepts POST requests')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ฟังก์ชันทดสอบ - ใช้สำหรับ debug
function testFunction() {
  try {
    const SHEET_ID = '1aeiIjj7RX24Qpp3wgAnoYxdf8WAONxIEEidLg1i-quY';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    console.log('Sheet data:', values);
    console.log('Headers:', values[0]);
    
    return values;
  } catch (error) {
    console.error('Test function error:', error);
    return error.toString();
  }
}

// ฟังก์ชันทดสอบ POST (จำลอง event)
function testPostFunction() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        username: "admin",
        password: "123456"
      })
    }
  };
  
  return doPost(mockEvent);
}
