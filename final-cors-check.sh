#!/bin/bash

echo "🔍 Final CORS Diagnostic Check"
echo "=============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

STOCK_API="https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec"
AUTH_API="https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec"

echo -e "${BLUE}1. Testing API Connectivity${NC}"
echo "----------------------------"

# Test Stock API
echo "Stock API connectivity test:"
if timeout 10 curl -s -f -o /dev/null "$STOCK_API"; then
    echo -e "✅ ${GREEN}Stock API: Reachable${NC}"
else
    echo -e "❌ ${RED}Stock API: Not reachable${NC}"
fi

# Test Auth API
echo "Auth API connectivity test:"
if timeout 10 curl -s -f -o /dev/null "$AUTH_API"; then
    echo -e "✅ ${GREEN}Auth API: Reachable${NC}"
else
    echo -e "❌ ${RED}Auth API: Not reachable${NC}"
fi

echo -e "\n${BLUE}2. CORS Headers Check${NC}"
echo "---------------------"

echo "Stock API CORS headers:"
STOCK_CORS=$(timeout 5 curl -s -I "$STOCK_API" | grep -i "access-control-allow-origin")
if [ ! -z "$STOCK_CORS" ]; then
    echo -e "✅ ${GREEN}$STOCK_CORS${NC}"
else
    echo -e "❌ ${RED}No CORS headers found${NC}"
fi

echo -e "\n${BLUE}3. Build & Environment Check${NC}"
echo "----------------------------"

# Check environment files
if [ -f "src/environments/environment.prod.ts" ]; then
    echo -e "✅ ${GREEN}Production environment exists${NC}"
else
    echo -e "❌ ${RED}Production environment missing${NC}"
fi

# Check interceptor
if [ -f "src/app/interceptors/cors.interceptor.ts" ]; then
    echo -e "✅ ${GREEN}CORS interceptor exists${NC}"
else
    echo -e "⚠️ ${YELLOW}CORS interceptor missing${NC}"
fi

# Check build
if [ -f "dist/stock-app/index.html" ]; then
    echo -e "✅ ${GREEN}Production build exists${NC}"
    echo "Bundle size: $(du -sh dist/stock-app/main*.js 2>/dev/null | cut -f1 | head -1)"
else
    echo -e "⚠️ ${YELLOW}No production build found${NC}"
    echo "Run: npm run build:netlify"
fi

echo -e "\n${BLUE}4. Suggested Actions${NC}"
echo "-------------------"

echo "1. 🌐 Open diagnostic tool:"
echo "   file://$(pwd)/debug-tools/cors-problem-diagnostic.html"
echo ""
echo "2. 🧪 Test in browser console:"
echo "   fetch('$STOCK_API')"
echo ""
echo "3. 🔧 If CORS still fails, check Google Apps Script:"
echo "   - Deployment settings"
echo "   - Execute as: Me"
echo "   - Access: Anyone"
echo ""
echo "4. 🚀 Ready to deploy:"
echo "   git add . && git commit -m 'Fix CORS issues'"
echo "   git push origin main"

echo -e "\n${GREEN}🎉 CORS troubleshooting complete!${NC}"
