#!/bin/bash

echo "🚀 Stock Manager App - Deployment Test"
echo "======================================"

# Test 1: Build Production
echo ""
echo "1️⃣ Testing Production Build..."
npm run build:netlify

if [ $? -eq 0 ]; then
    echo "✅ Production build: SUCCESS"
else
    echo "❌ Production build: FAILED"
    exit 1
fi

# Test 2: Check Build Files
echo ""
echo "2️⃣ Checking Build Output..."
if [ -d "dist/stock-app" ]; then
    echo "✅ dist/stock-app directory exists"
    
    if [ -f "dist/stock-app/index.html" ]; then
        echo "✅ index.html exists"
    else
        echo "❌ index.html missing"
    fi
    
    if [ -f "dist/stock-app/_redirects" ]; then
        echo "✅ _redirects file exists"
    else
        echo "❌ _redirects file missing"
    fi
    
    echo "📊 Build files:"
    ls -la dist/stock-app/
    
    echo ""
    echo "📏 Bundle sizes:"
    du -h dist/stock-app/*
    
else
    echo "❌ dist/stock-app directory missing"
    exit 1
fi

# Test 3: Test API URLs
echo ""
echo "3️⃣ Testing API Connectivity..."

STOCK_API="https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec"
AUTH_API="https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec"

echo "Testing Stock API..."
if curl -s -f "${STOCK_API}?action=getItems" > /dev/null; then
    echo "✅ Stock API: Reachable"
else
    echo "⚠️ Stock API: May have issues"
fi

echo "Testing Auth API..."
if curl -s -f "${AUTH_API}?action=test" > /dev/null; then
    echo "✅ Auth API: Reachable"
else
    echo "⚠️ Auth API: May have issues"
fi

# Test 4: Environment Configuration
echo ""
echo "4️⃣ Checking Environment Configuration..."
if grep -q "production.*true" "src/environments/environment.prod.ts"; then
    echo "✅ Production environment configured"
else
    echo "❌ Production environment missing"
fi

if grep -q "fileReplacements" "angular.json"; then
    echo "✅ File replacements configured in angular.json"
else
    echo "❌ File replacements missing in angular.json"
fi

# Test 5: Netlify Configuration
echo ""
echo "5️⃣ Checking Netlify Configuration..."
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml exists"
    echo "Build command: $(grep -A1 '\[build\]' netlify.toml | grep 'command' | cut -d'"' -f2)"
    echo "Publish directory: $(grep -A2 '\[build\]' netlify.toml | grep 'publish' | cut -d'"' -f2)"
else
    echo "❌ netlify.toml missing"
fi

if [ -f ".nvmrc" ]; then
    echo "✅ .nvmrc exists (Node version: $(cat .nvmrc))"
else
    echo "❌ .nvmrc missing"
fi

# Summary
echo ""
echo "📋 Deployment Readiness Summary:"
echo "================================"

# Check if all critical files exist
READY=true

if [ ! -d "dist/stock-app" ]; then READY=false; fi
if [ ! -f "netlify.toml" ]; then READY=false; fi
if [ ! -f "src/environments/environment.prod.ts" ]; then READY=false; fi

if [ "$READY" = true ]; then
    echo "🎉 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://netlify.com"
    echo "2. Connect GitHub repository: Tspkp2540/stock-manager-app"
    echo "3. Use these settings:"
    echo "   - Build command: npm run build:netlify"
    echo "   - Publish directory: dist/stock-app"
    echo "4. Deploy!"
    echo ""
    echo "🔗 Your app will be available at: https://[random-name].netlify.app"
else
    echo "❌ Not ready for deployment. Please fix the issues above."
    exit 1
fi
