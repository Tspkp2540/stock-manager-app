// Google Apps Script Code for Stock Management
function doGet(e) {
  // Check if parameters exist
  if (!e || !e.parameter) {
    return getItems(); // Default action when no parameters
  }
  
  const action = e.parameter.action;
  
  switch(action) {
    case 'getItems':
      return getItems();
    case 'test':
      return testScript();
    default:
      return getItems();
  }
}

function doPost(e) {
  // Check if parameters and postData exist
  if (!e || !e.parameter) {
    return createResponse(false, 'No parameters provided');
  }
  
  if (!e.postData || !e.postData.contents) {
    return createResponse(false, 'No POST data provided');
  }
  
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'addItem':
        return addItem(e);
      case 'deleteItem':
        return deleteItem(e);
      case 'updateItem':
        return updateItem(e);
      default:
        return createResponse(false, `Invalid action: ${action}`);
    }
  } catch (error) {
    return createResponse(false, `doPost error: ${error.message}`);
  }
}

function getItems() {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, []);
    }
    
    const headers = data[0];
    const items = data.slice(1).map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
      });
      return item;
    });
    
    return createResponse(true, items);
  } catch (error) {
    return createResponse(false, `Error getting items: ${error.message}`);
  }
}

function addItem(e) {
  try {
    // ตรวจสอบ POST data
    if (!e.postData || !e.postData.contents) {
      return createResponse(false, 'No POST data received');
    }
    
    const sheet = getSheet();
    const postData = JSON.parse(e.postData.contents);
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!postData.name || !postData.quantity) {
      return createResponse(false, 'Name and quantity are required');
    }
    
    // สร้าง ID ใหม่โดยใช้ timestamp
    const newId = Date.now().toString();
    
    const newRow = [
      newId,
      postData.name.toString().trim(),
      parseInt(postData.quantity) || 0,
      parseFloat(postData.price) || 0,
      new Date().toISOString()
    ];
    
    sheet.appendRow(newRow);
    
    return createResponse(true, {
      id: newId,
      name: postData.name.toString().trim(),
      quantity: parseInt(postData.quantity) || 0,
      price: parseFloat(postData.price) || 0,
      updated: new Date().toISOString()
    });
  } catch (error) {
    return createResponse(false, `Add item error: ${error.message}`);
  }
}

function deleteItem(e) {
  const sheet = getSheet();
  const postData = JSON.parse(e.postData.contents);
  const itemId = postData.id;
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === itemId) {
      sheet.deleteRow(i + 1);
      return createResponse(true, { deleted: true });
    }
  }
  
  return createResponse(false, 'Item not found');
}

function getSheet() {
  // แทนที่ด้วย Sheet ID ของคุณ - ดูได้จาก URL ของ Google Sheets
  // ตัวอย่าง: https://docs.google.com/spreadsheets/d/1ABC123XYZ789/edit
  // Sheet ID คือ: 1ABC123XYZ789
  const SHEET_ID = '1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo';
  const SHEET_NAME = 'Stock'; // เปลี่ยนเป็น Stock (ตัวใหญ่)
  
  // ตรวจสอบว่าได้แทนที่ SHEET_ID แล้วหรือยัง
  if (SHEET_ID === 'YOUR_GOOGLE_SHEET_ID') {
    throw new Error('กรุณาแทนที่ SHEET_ID ด้วย Google Sheet ID ที่แท้จริง\nดู SETUP-GOOGLE-SHEETS.md สำหรับคำแนะนำ');
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // สร้าง header ถ้ายังไม่มี
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['id', 'name', 'quantity', 'price', 'updated']);
    }
    
    return sheet;
  } catch (error) {
    throw new Error(`ไม่สามารถเปิด Google Sheet ได้: ${error.message}\nกรุณาตรวจสอบ SHEET_ID และสิทธิ์การเข้าถึง`);
  }
}

function createResponse(success, data) {
  const response = {
    success: success,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  // Google Apps Script automatically handles CORS for Web Apps
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify the script is working
function testScript() {
  return createResponse(true, {
    message: 'Google Apps Script is working!',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
}
