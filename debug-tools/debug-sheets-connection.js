// Google Apps Script Debug Code - ใช้สำหรับทดสอบการเชื่อมต่อ Google Sheets
function debugSheetConnection() {
  try {
    const SHEET_ID = '1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo';
    const SHEET_NAME = 'Stock'; // เปลี่ยนเป็น Stock (ตัวใหญ่)
    
    // ทดสอบเปิด spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    console.log('✅ Spreadsheet opened successfully');
    console.log('Spreadsheet name:', spreadsheet.getName());
    
    // ทดสอบเปิด sheet
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.log('❌ Sheet not found:', SHEET_NAME);
      console.log('Available sheets:', spreadsheet.getSheets().map(s => s.getName()));
      return {
        success: false,
        error: 'Sheet not found',
        availableSheets: spreadsheet.getSheets().map(s => s.getName())
      };
    }
    
    console.log('✅ Sheet opened successfully');
    console.log('Sheet name:', sheet.getName());
    console.log('Last row:', sheet.getLastRow());
    console.log('Last column:', sheet.getLastColumn());
    
    // ทดสอบอ่านข้อมูล
    if (sheet.getLastRow() > 0) {
      const data = sheet.getDataRange().getValues();
      console.log('✅ Data read successfully');
      console.log('Headers:', data[0]);
      console.log('Total rows:', data.length);
      
      return {
        success: true,
        sheetName: sheet.getName(),
        lastRow: sheet.getLastRow(),
        lastColumn: sheet.getLastColumn(),
        headers: data[0],
        totalRows: data.length,
        sampleData: data.slice(0, 3) // แสดงแค่ 3 แถวแรก
      };
    } else {
      console.log('⚠️ Sheet is empty');
      return {
        success: true,
        sheetName: sheet.getName(),
        isEmpty: true,
        message: 'Sheet is empty'
      };
    }
    
  } catch (error) {
    console.error('❌ Error:', error.toString());
    return {
      success: false,
      error: error.toString(),
      message: 'Failed to connect to Google Sheets'
    };
  }
}

// ฟังก์ชันสำหรับทดสอบผ่าน doGet
function doGet(e) {
  if (!e || !e.parameter) {
    return debugSheetConnection();
  }
  
  const action = e.parameter.action;
  
  switch(action) {
    case 'debug':
    case 'test':
      return ContentService
        .createTextOutput(JSON.stringify(debugSheetConnection(), null, 2))
        .setMimeType(ContentService.MimeType.JSON);
    default:
      return ContentService
        .createTextOutput(JSON.stringify(debugSheetConnection(), null, 2))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// ฟังก์ชันสำหรับสร้าง headers หาก sheet ว่าง
function setupSheet() {
  try {
    const SHEET_ID = '1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo';
    const SHEET_NAME = 'Stock'; // เปลี่ยนเป็น Stock (ตัวใหญ่)
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // สร้าง sheet ใหม่
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      newSheet.appendRow(['id', 'name', 'quantity', 'price', 'updated']);
      
      return {
        success: true,
        message: 'New sheet created with headers',
        headers: ['id', 'name', 'quantity', 'price', 'updated']
      };
    }
    
    if (sheet.getLastRow() === 0) {
      // เพิ่ม headers
      sheet.appendRow(['id', 'name', 'quantity', 'price', 'updated']);
      
      return {
        success: true,
        message: 'Headers added to existing sheet',
        headers: ['id', 'name', 'quantity', 'price', 'updated']
      };
    }
    
    return {
      success: true,
      message: 'Sheet already has data',
      currentHeaders: sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
