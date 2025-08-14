// Simple script to check Google Sheets Users data
function checkUsersData() {
  try {
    console.log('🔍 Checking Users data in Google Sheets...');
    
    // Direct API call to get users
    fetch('https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=getUsers')
      .then(response => response.json())
      .then(data => {
        console.log('✅ Users data from Google Sheets:');
        console.table(data);
        
        // Look for admin user specifically
        if (data.users) {
          const adminUser = data.users.find(user => user.username === 'admin');
          if (adminUser) {
            console.log('🔑 Admin user found:');
            console.log('Role:', adminUser.role);
            console.log('Username:', adminUser.username);
            console.log('Has password:', Boolean(adminUser.password));
          } else {
            console.log('❌ Admin user not found');
          }
        }
      })
      .catch(error => {
        console.error('❌ Error fetching users:', error);
      });

    // Test login with admin credentials
    console.log('🧪 Testing admin login...');
    
    fetch('https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec?action=login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('🎯 Login test result:');
      console.log('Success:', data.success);
      if (data.user) {
        console.log('User role:', data.user.role);
        console.log('User username:', data.user.username);
        console.log('User ID:', data.user.id);
      }
      console.log('Full response:', data);
    })
    .catch(error => {
      console.error('❌ Login test error:', error);
    });
    
  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

// Run the check
checkUsersData();
