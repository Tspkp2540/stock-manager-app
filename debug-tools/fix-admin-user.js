// Fix Admin User Script - Run this in Google Apps Script Console
function fixAdminUser() {
  const SHEET_ID = '1IT-5Lzb7pFtAiNl6t7jLagIXW4w9v1dNHoH7snEm2mo';
  const SHEET_NAME = 'Users';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      console.log('Created new Users sheet');
    }
    
    // Clear all data first
    sheet.clear();
    
    // Add headers
    sheet.appendRow(['id', 'username', 'password', 'role', 'created']);
    
    // Add admin user with correct role
    sheet.appendRow([
      '1',
      'admin', 
      'admin123',
      'admin',  // ← IMPORTANT: Make sure this is 'admin' not 'user'
      new Date().toISOString()
    ]);
    
    // Add test user
    sheet.appendRow([
      '2',
      'testuser',
      'testpass',
      'user',
      new Date().toISOString()
    ]);
    
    // Verify data
    const data = sheet.getDataRange().getValues();
    console.log('Updated Users sheet data:');
    console.table(data);
    
    // Find admin user specifically
    const headers = data[0];
    const adminRow = data[1]; // Should be admin user
    
    const adminUser = {};
    headers.forEach((header, index) => {
      adminUser[header] = adminRow[index];
    });
    
    console.log('Admin user details:', adminUser);
    console.log('Admin role:', adminUser.role);
    
    return 'Admin user fixed successfully';
    
  } catch (error) {
    console.error('Error fixing admin user:', error);
    return 'Error: ' + error.message;
  }
}

// Test the fix
function testFixedAdmin() {
  const result = handleLogin({
    postData: {
      contents: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    }
  });
  
  console.log('Test login result:', result);
}

// Run the fix
console.log('🔧 Starting admin user fix...');
const result = fixAdminUser();
console.log(result);

console.log('🧪 Testing fixed admin...');
testFixedAdmin();
