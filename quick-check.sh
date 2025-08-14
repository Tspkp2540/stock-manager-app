#!/bin/bash

# Simple diagnostic for CORS issues
echo "🔍 Stock Manager CORS Quick Check"
echo "================================"

STOCK_API="https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec"

echo "Testing Stock API CORS headers..."
curl -s -I "$STOCK_API" | grep -i "access-control-allow-origin" || echo "No CORS headers found"

echo -e "\nTesting basic connectivity..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$STOCK_API")
echo "HTTP Status: $STATUS"

echo -e "\nEnvironment files:"
if [ -f "src/environments/environment.prod.ts" ]; then
    echo "✅ environment.prod.ts exists"
    grep "apiUrl" src/environments/environment.prod.ts
else
    echo "❌ environment.prod.ts missing"
fi

echo -e "\nBuild check:"
if [ -f "dist/stock-app/main.d0a739049b740b4f.js" ]; then
    echo "✅ Production build exists"
    echo "Bundle size: $(du -h dist/stock-app/main.*.js | cut -f1)"
else
    echo "❌ No production build found"
fi
