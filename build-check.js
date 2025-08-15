const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting build process...');

try {
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Try to build
  console.log('🏗️ Building for production...');
  execSync('npx ng build --configuration production', { stdio: 'inherit' });
  
  // Check if build succeeded
  if (fs.existsSync('dist')) {
    console.log('✅ Build successful! Files in dist:');
    const files = fs.readdirSync('dist');
    files.forEach(file => {
      console.log(`  - ${file}`);
      if (fs.statSync(path.join('dist', file)).isDirectory()) {
        const subFiles = fs.readdirSync(path.join('dist', file));
        subFiles.forEach(subFile => {
          console.log(`    - ${subFile}`);
        });
      }
    });
  } else {
    console.log('❌ Build failed - no dist directory created');
  }

} catch (error) {
  console.error('❌ Build process failed:', error.message);
  console.log('📋 Build output above should show the specific error');
}
