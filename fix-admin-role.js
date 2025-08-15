// Google Apps Script - Fix Admin Role Script
// Copy และรันใน Google Apps Script console เพื่อแก้ไข admin role

function fixAdminRole() {
  try {
    console.log('🔧 Starting admin role fix...');
    
    const sheet = getUserSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('❌ No data found in sheet');
      return;
    }
    
    const headers = data[0];
    console.log('📋 Headers:', headers);
    
    const roleIndex = headers.indexOf('role');
    const usernameIndex = headers.indexOf('username');
    
    if (roleIndex === -1 || usernameIndex === -1) {
      console.log('❌ Required columns not found');
      return;
    }
    
    // Find and fix admin user
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const username = row[usernameIndex];
      const currentRole = row[roleIndex];
      
      console.log(`Row ${i}: username="${username}", role="${currentRole}"`);
      
      if (username === 'admin') {
        if (currentRole !== 'admin') {
          console.log(`🔧 Fixing admin role from "${currentRole}" to "admin"`);
          
          // Update the role in the sheet
          sheet.getRange(i + 1, roleIndex + 1).setValue('admin');
          
          console.log('✅ Admin role fixed successfully!');
        } else {
          console.log('✅ Admin role is already correct');
        }
        
        break;
      }
    }
    
    console.log('🎉 Fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
  }
}

function verifyAdminRole() {
  try {
    console.log('🔍 Verifying admin role...');
    
    const sheet = getUserSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('❌ No data found');
      return;
    }
    
    const headers = data[0];
    const users = data.slice(1);
    
    console.log(`📊 Found ${users.length} users:`);
    
    users.forEach((row, index) => {
      const userData = {};
      headers.forEach((header, idx) => {
        userData[header] = row[idx];
      });
      
      console.log(`${index + 1}. ${userData.username}: ${userData.role}`);
      
      if (userData.username === 'admin') {
        if (userData.role === 'admin') {
          console.log('✅ Admin role is correct!');
        } else {
          console.log(`❌ Admin role is wrong: "${userData.role}" (should be "admin")`);
        }
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

function getUserSheet() {
  const SPREADSHEET_ID = '1dCXrK2GxGVOy_TBXxA9gkL5SFqC2O4-ILwV9CWVs_cM';
  const SHEET_NAME = 'users';
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'username', 'password', 'role', 'created']);
    
    // Add default admin user
    sheet.appendRow([
      '1',
      'admin',
      'admin123', 
      'admin',
      new Date().toISOString()
    ]);
  }
  
  return sheet;
}

// Run these functions:
// 1. verifyAdminRole() - to check current state
// 2. fixAdminRole() - to fix the role if needed
// 3. verifyAdminRole() - to confirm the fix
