// Google Apps Script Code for Authentication System
function doGet(e) {
  // Check if parameters exist
  if (!e || !e.parameter) {
    return createResponse(true, { message: 'Authentication API is ready' });
  }
  
  const action = e.parameter.action;
  
  switch(action) {
    case 'test':
      return testAuth();
    case 'getUsers':
      return getUsers();
    case 'login':
      return handleLoginGet(e);
    default:
      return createResponse(true, { message: 'Authentication API is ready' });
  }
}

function doPost(e) {
  // Check if parameters and postData exist
  if (!e || !e.parameter || !e.postData) {
    return createResponse(false, 'No data provided');
  }
  
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'login':
        return handleLogin(e);
      case 'register':
        return handleRegister(e);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, `Error: ${error.message}`);
  }
}

function handleLogin(e) {
  try {
    // ตรวจสอบ POST data
    if (!e.postData || !e.postData.contents) {
      return createResponse(false, 'No POST data received');
    }
    
    const postData = JSON.parse(e.postData.contents);
    const username = postData.username;
    const password = postData.password;
    
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }
    
    // Get users from Google Sheets
    const sheet = getUserSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(false, 'No users found in sheet');
    }
    
    const headers = data[0];
    const users = data.slice(1);
    
    // Debug info
    const debugInfo = {
      sheetsHeaders: headers,
      userCount: users.length,
      providedUsername: username,
      providedPassword: password ? '***' : 'empty'
    };
    
    // Find user
    for (let i = 0; i < users.length; i++) {
      const row = users[i];
      const userData = {};
      headers.forEach((header, index) => {
        userData[header.toString().toLowerCase().trim()] = row[index] ? row[index].toString().trim() : '';
      });
      
      const dbUsername = userData.username || '';
      const dbPassword = userData.password || '';
      const dbRole = userData.role || 'user';
      const dbId = userData.id || (i + 1).toString();
      
      // Debug current user being checked
      debugInfo[`user${i + 1}`] = {
        username: dbUsername,
        hasPassword: Boolean(dbPassword),
        role: dbRole
      };
      
      if (dbUsername.toLowerCase() === username.toLowerCase() && dbPassword === password) {
        return createResponse(true, {
          message: 'Login successful',
          user: {
            id: dbId,
            username: dbUsername,
            role: dbRole
          }
        });
      }
    }
    
    return createResponse(false, 'Invalid username or password', debugInfo);
    
  } catch (error) {
    return createResponse(false, `Login error: ${error.message}`);
  }
}

function handleRegister(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const username = postData.username;
    const password = postData.password;
    
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }
    
    const sheet = getUserSheet();
    const data = sheet.getDataRange().getValues();
    
    // Check if username already exists
    if (data.length > 1) {
      const headers = data[0];
      const users = data.slice(1);
      
      for (let i = 0; i < users.length; i++) {
        const row = users[i];
        const userData = {};
        headers.forEach((header, index) => {
          userData[header] = row[index];
        });
        
        if (userData.username === username) {
          return createResponse(false, 'Username already exists');
        }
      }
    }
    
    // Add new user
    const newId = Date.now().toString();
    const newRow = [
      newId,
      username,
      password,
      'user',
      new Date().toISOString()
    ];
    
    sheet.appendRow(newRow);
    
    return createResponse(true, {
      message: 'User registered successfully',
      user: {
        id: newId,
        username: username,
        role: 'user'
      }
    });
    
  } catch (error) {
    return createResponse(false, `Register error: ${error.message}`);
  }
}

function getUsers() {
  try {
    const sheet = getUserSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, []);
    }
    
    const headers = data[0];
    const users = data.slice(1).map(row => {
      const user = {};
      headers.forEach((header, index) => {
        user[header] = row[index];
      });
      // Don't return password for security
      delete user.password;
      return user;
    });
    
    return createResponse(true, users);
  } catch (error) {
    return createResponse(false, `Error getting users: ${error.message}`);
  }
}

function getUserSheet() {
  // ใช้ Google Sheets เดียวกัน แต่ต่าง tab
  const SHEET_ID = '1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo'; // Google Sheets เดียวกัน
  const SHEET_NAME = 'Users'; // tab สำหรับ Users (แยกจาก Stock)
  
  // ตรวจสอบว่าได้แทนที่ SHEET_ID แล้วหรือยัง
  if (SHEET_ID === 'YOUR_GOOGLE_SHEET_ID') {
    throw new Error('กรุณาแทนที่ SHEET_ID ด้วย Google Sheet ID ที่แท้จริง');
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // สร้าง sheet ใหม่ถ้าไม่มี
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // สร้าง headers
      sheet.appendRow(['id', 'username', 'password', 'role', 'created']);
      
      // เพิ่ม default admin user
      sheet.appendRow([
        '1',
        'admin',
        'admin123',
        'admin',
        new Date().toISOString()
      ]);
    } else if (sheet.getLastRow() === 0) {
      // ถ้า sheet มีแต่ไม่มี headers
      sheet.appendRow(['id', 'username', 'password', 'role', 'created']);
      
      // เพิ่ม default admin user
      sheet.appendRow([
        '1',
        'admin',
        'admin123',
        'admin',
        new Date().toISOString()
      ]);
    }
    
    return sheet;
  } catch (error) {
    throw new Error(`ไม่สามารถเปิด Google Sheet ได้: ${error.message}`);
  }
}

function createResponse(success, data, debugInfo = null) {
  const response = {
    success: success,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  // เพิ่ม debug info หาก success = false
  if (!success && debugInfo) {
    response.debug = debugInfo;
  }
  
  // Google Apps Script automatically handles CORS for Web Apps
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify the auth script is working
function testAuth() {
  return createResponse(true, {
    message: 'Authentication API is working!',
    version: '1.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      login: 'POST with action=login or GET with action=login',
      register: 'POST with action=register',
      getUsers: 'GET with action=getUsers'
    }
  });
}

// Handle login via GET request (for CORS compatibility)
function handleLoginGet(e) {
  try {
    const username = e.parameter.username;
    const password = e.parameter.password;
    
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }
    
    const debugInfo = {
      receivedUsername: username,
      receivedPassword: password ? '***' : null,
      timestamp: new Date().toISOString(),
      method: 'GET'
    };
    
    const sheet = getUserSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(false, 'No users found in database');
    }
    
    const headers = data[0];
    const users = data.slice(1);
    
    debugInfo.totalUsers = users.length;
    debugInfo.headers = headers;
    
    // Find user
    for (let i = 0; i < users.length; i++) {
      const row = users[i];
      const userData = {};
      headers.forEach((header, index) => {
        userData[header] = row[index];
      });
      
      const dbUsername = userData.username;
      const dbPassword = userData.password;
      const dbRole = userData.role;
      const dbId = userData.id;
      
      debugInfo[`user_${i}`] = {
        username: dbUsername,
        role: dbRole,
        passwordMatch: dbPassword === password
      };
      
      if (dbUsername === username && dbPassword === password) {
        debugInfo.loginResult = 'SUCCESS';
        debugInfo.matchedUser = {
          id: dbId,
          username: dbUsername,
          role: dbRole
        };
        
        return createResponse(true, 'Login successful', {
          user: {
            id: dbId,
            username: dbUsername,
            role: dbRole
          }
        });
      }
    }
    
    debugInfo.loginResult = 'FAILED';
    return createResponse(false, 'Invalid username or password', debugInfo);
    
  } catch (error) {
    return createResponse(false, `Login error: ${error.message}`);
  }
}
