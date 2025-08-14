# Stock Manager App - Deployment Guide

## 🚀 Netlify Deployment

### Quick Setup:
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git" 
3. Connect your GitHub repository
4. Use these build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist/stock-app`
   - **Node version**: 18.20.8 (automatically detected from .nvmrc)

### Environment Configuration:
- **Development**: Uses localhost APIs in `src/environments/environment.ts`
- **Production**: Uses Google Apps Script APIs in `src/environments/environment.prod.ts`

### API Endpoints:
- **Stock API**: `https://script.google.com/macros/s/AKfycbwSSJK8GTNP1D4VS-PF6XDZg4c_PDd4RQxj7hXE3Udxck_SwKWPPApuKORGFTF3wNdB/exec`
- **Auth API**: `https://script.google.com/macros/s/AKfycbw7-F46lou4iiIg0_JOldcsLiUUib2XO_EZXiQ90U4shMdRz-VY1mkTYqno2rf5NU2w/exec`

### Features:
- ✅ Production build optimized (592KB bundle)
- ✅ SPA routing with _redirects
- ✅ CORS configured for Google Apps Script
- ✅ Angular Material UI
- ✅ Responsive design

### Testing:
Run deployment test: `./deployment-test.sh`

### Troubleshooting CORS:
If you encounter CORS issues, use the debugging tool:
Open `debug-tools/cors-test.html` in your browser after deployment.

---
**Live Demo**: Your app will be available at `https://[your-app-name].netlify.app`
