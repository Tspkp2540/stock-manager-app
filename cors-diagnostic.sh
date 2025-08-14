#!/bin/bash

echo "🔍 Stock Manager App - CORS & Connectivity Diagnostic"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API URLs
STOCK_API="https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec"
AUTH_API="https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec"

echo -e "\n${BLUE}1️⃣ Testing Basic Connectivity${NC}"
echo "================================"

# Test basic connectivity
echo "Testing Stock API connectivity..."
if curl -s --head --fail "$STOCK_API" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Stock API: Reachable${NC}"
else
    echo -e "${RED}❌ Stock API: Not reachable${NC}"
fi

echo "Testing Auth API connectivity..."
if curl -s --head --fail "$AUTH_API" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth API: Reachable${NC}"
else
    echo -e "${RED}❌ Auth API: Not reachable${NC}"
fi

echo -e "\n${BLUE}2️⃣ Testing CORS Headers${NC}"
echo "=========================="

echo "Stock API CORS Headers:"
curl -I -s "$STOCK_API" | grep -i "access-control" || echo "No CORS headers found"

echo -e "\nAuth API CORS Headers:"
curl -I -s "$AUTH_API" | grep -i "access-control" || echo "No CORS headers found"

echo -e "\n${BLUE}3️⃣ Testing GET Requests${NC}"
echo "========================"

echo "Testing Stock API GET request..."
STOCK_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" "$STOCK_API")
STOCK_HTTP_CODE=$(echo $STOCK_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
STOCK_BODY=$(echo $STOCK_RESPONSE | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')

if [ $STOCK_HTTP_CODE -eq 200 ] || [ $STOCK_HTTP_CODE -eq 302 ]; then
    echo -e "${GREEN}✅ Stock API GET: HTTP $STOCK_HTTP_CODE${NC}"
    echo "Response length: $(echo "$STOCK_BODY" | wc -c) bytes"
else
    echo -e "${RED}❌ Stock API GET: HTTP $STOCK_HTTP_CODE${NC}"
fi

echo -e "\nTesting Auth API GET request..."
AUTH_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" "$AUTH_API")
AUTH_HTTP_CODE=$(echo $AUTH_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
AUTH_BODY=$(echo $AUTH_RESPONSE | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')

if [ $AUTH_HTTP_CODE -eq 200 ] || [ $AUTH_HTTP_CODE -eq 302 ]; then
    echo -e "${GREEN}✅ Auth API GET: HTTP $AUTH_HTTP_CODE${NC}"
    echo "Response length: $(echo "$AUTH_BODY" | wc -c) bytes"
else
    echo -e "${RED}❌ Auth API GET: HTTP $AUTH_HTTP_CODE${NC}"
fi

echo -e "\n${BLUE}4️⃣ Testing POST Requests (Auth)${NC}"
echo "================================="

echo "Testing Auth API POST request..."
AUTH_POST_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"username":"test","password":"test","action":"login"}' \
    "$AUTH_API")

AUTH_POST_HTTP_CODE=$(echo $AUTH_POST_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ $AUTH_POST_HTTP_CODE -eq 200 ] || [ $AUTH_POST_HTTP_CODE -eq 302 ]; then
    echo -e "${GREEN}✅ Auth API POST: HTTP $AUTH_POST_HTTP_CODE${NC}"
else
    echo -e "${RED}❌ Auth API POST: HTTP $AUTH_POST_HTTP_CODE${NC}"
fi

echo -e "\n${BLUE}5️⃣ Environment Configuration Check${NC}"
echo "==================================="

if [ -f "src/environments/environment.prod.ts" ]; then
    echo -e "${GREEN}✅ Production environment file exists${NC}"
    echo "Production API URLs:"
    grep -E "(apiUrl|authApiUrl)" src/environments/environment.prod.ts | sed 's/^/  /'
else
    echo -e "${RED}❌ Production environment file missing${NC}"
fi

echo -e "\n${BLUE}6️⃣ Build Configuration Check${NC}"
echo "=============================="

if grep -q "fileReplacements" angular.json; then
    echo -e "${GREEN}✅ File replacement configured in angular.json${NC}"
else
    echo -e "${YELLOW}⚠️  File replacement not configured${NC}"
fi

if [ -f "dist/stock-app/index.html" ]; then
    echo -e "${GREEN}✅ Production build exists${NC}"
else
    echo -e "${YELLOW}⚠️  No production build found${NC}"
fi

if [ -f "dist/stock-app/_redirects" ]; then
    echo -e "${GREEN}✅ _redirects file exists in build${NC}"
else
    echo -e "${RED}❌ _redirects file missing in build${NC}"
fi

echo -e "\n${BLUE}7️⃣ Deployment Readiness${NC}"
echo "======================"

ISSUES=0

# Check for critical files
if [ ! -f "netlify.toml" ]; then
    echo -e "${RED}❌ netlify.toml missing${NC}"
    ((ISSUES++))
else
    echo -e "${GREEN}✅ netlify.toml exists${NC}"
fi

if [ ! -f ".nvmrc" ]; then
    echo -e "${RED}❌ .nvmrc missing${NC}"
    ((ISSUES++))
else
    echo -e "${GREEN}✅ .nvmrc exists ($(cat .nvmrc))${NC}"
fi

if [ ! -f "package.json" ] || ! grep -q "@angular/cli" package.json; then
    echo -e "${RED}❌ @angular/cli not in dependencies${NC}"
    ((ISSUES++))
else
    echo -e "${GREEN}✅ @angular/cli in dependencies${NC}"
fi

echo -e "\n${BLUE}📋 Summary${NC}"
echo "=========="

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    echo
    echo "Next steps:"
    echo "1. Commit all changes: git add . && git commit -m 'Fix CORS and deployment config'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Deploy on Netlify with these settings:"
    echo "   - Build command: npm run build:netlify"
    echo "   - Publish directory: dist/stock-app"
    echo
    echo -e "${BLUE}🚀 Your app will be available at: https://[your-app-name].netlify.app${NC}"
else
    echo -e "${RED}❌ Found $ISSUES issues. Please resolve them before deployment.${NC}"
fi

echo -e "\n${YELLOW}🔧 Troubleshooting Tools:${NC}"
echo "- Advanced CORS Test: open debug-tools/advanced-cors-test.html"
echo "- Local test server: cd dist/stock-app && python3 -m http.server 8080"
echo "- Check browser console for detailed error messages"
