// Clear all existing sessions
console.log('🧹 Clearing all existing sessions...');
localStorage.clear();
sessionStorage.clear();
console.log('✅ All sessions cleared');

// Reload page to start fresh
setTimeout(() => {
    location.reload();
}, 1000);
