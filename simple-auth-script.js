// Google Apps Script Simple Authentication (No Google Sheets needed)
function doGet(e) {
  if (!e || !e.parameter) {
    return createResponse(true, { message: 'Simple Authentication API is ready' });
  }
  
  const action = e.parameter.action;
  
  switch(action) {
    case 'test':
      return testAuth();
    default:
      return createResponse(true, { message: 'Simple Authentication API is ready' });
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
        return handleSimpleLogin(e);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    return createResponse(false, `Error: ${error.message}`);
  }
}

function handleSimpleLogin(e) {
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
    
    // Hard-coded users (no Google Sheets needed)
    const validUsers = [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
      { id: '2', username: 'user', password: 'user123', role: 'user' },
      { id: '3', username: 'manager', password: 'manager123', role: 'manager' }
    ];
    
    // Find matching user
    const user = validUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      return createResponse(true, {
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      return createResponse(false, 'Invalid username or password');
    }
    
  } catch (error) {
    return createResponse(false, `Login error: ${error.message}`);
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
    message: 'Simple Authentication API is working!',
    version: '2.0',
    timestamp: new Date().toISOString(),
    availableUsers: [
      { username: 'admin', role: 'admin' },
      { username: 'user', role: 'user' },
      { username: 'manager', role: 'manager' }
    ],
    note: 'Passwords are not shown for security'
  });
}
