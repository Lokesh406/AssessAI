# Local Network Setup Guide

## Quick Start (2 minutes)

### Step 1: Find Your Computer's IP Address

**Windows (PowerShell):**
```powershell
ipconfig
```
Look for "IPv4 Address" under your network (usually something like `192.168.x.x`)

**macOS/Linux:**
```bash
ifconfig
```
Look for `inet` address (usually `192.168.x.x`)

### Step 2: Set Environment Variables

#### Backend Setup
Create/Update `Backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:3000,http://YOUR_IP:3000
MONGODB_URI=mongodb://localhost:27017/ai-grading
```

Replace `YOUR_IP` with your actual IP (e.g., `192.168.1.100`)

#### Frontend Setup
Create/Update `Frontend/.env.local`:
```env
REACT_APP_API_URL=http://YOUR_IP:5000/api
```

Replace `YOUR_IP` with your actual IP

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```
Expected output:
```
Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm start
```
Expected output:
```
Compiled successfully!
You can now view ai-grading-frontend in the browser.
  Local:            http://localhost:3000
  Network:          http://YOUR_IP:3000
```

### Step 4: Access from Other Devices

**From your computer:**
```
http://localhost:3000
```

**From other devices on the network:**
```
http://YOUR_IP:3000
```

Example: `http://192.168.1.100:3000`

---

## Detailed Setup Instructions

### Windows Setup

#### Finding Your IP:
```powershell
# Run this in PowerShell
ipconfig
```

Output example:
```
Ethernet adapter Local Area Connection:
   IPv4 Address. . . . . . . . . . : 192.168.1.100
```

The IP is **192.168.1.100**

#### Creating Backend .env:
```bash
cd Backend
# Open file in text editor and add:
# PORT=5000
# NODE_ENV=development
# FRONTEND_URLS=http://localhost:3000,http://192.168.1.100:3000
# MONGODB_URI=mongodb://localhost:27017/ai-grading
```

#### Creating Frontend .env.local:
```bash
cd Frontend
# Open file in text editor and add:
# REACT_APP_API_URL=http://192.168.1.100:5000/api
```

---

### macOS Setup

#### Finding Your IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Output example:
```
inet 192.168.1.100 netmask 0xffffff00
```

The IP is **192.168.1.100**

#### Creating Backend .env:
```bash
cd Backend
cat > .env << EOF
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:3000,http://192.168.1.100:3000
MONGODB_URI=mongodb://localhost:27017/ai-grading
EOF
```

#### Creating Frontend .env.local:
```bash
cd Frontend
cat > .env.local << EOF
REACT_APP_API_URL=http://192.168.1.100:5000/api
EOF
```

---

### Linux Setup

#### Finding Your IP:
```bash
hostname -I
```

Output example:
```
192.168.1.100 172.17.0.1
```

The IP is **192.168.1.100** (first one usually)

#### Creating Backend .env:
```bash
cd Backend
cat > .env << EOF
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:3000,http://192.168.1.100:3000
MONGODB_URI=mongodb://localhost:27017/ai-grading
EOF
```

#### Creating Frontend .env.local:
```bash
cd Frontend
cat > .env.local << EOF
REACT_APP_API_URL=http://192.168.1.100:5000/api
EOF
```

---

## Network Configuration

### Backend CORS Settings (Already Configured ✅)

The backend already supports network access:
- ✅ Listens on `0.0.0.0` (all interfaces)
- ✅ Allows private LAN IPs (10.x.x.x, 172.16.x.x - 172.31.x.x, 192.168.x.x)
- ✅ Allows localhost and 127.0.0.1
- ✅ Allows URLs specified in FRONTEND_URLS environment variable

No changes needed to `server.js` - already optimized!

### Frontend Proxy Settings

The frontend proxy in `package.json` already configured:
```json
"proxy": "http://localhost:5000"
```

This allows:
- Development with `npm start` using relative URLs
- Environment variable override with `REACT_APP_API_URL`
- Automatic fallback to `/api` if nothing specified

---

## Device Compatibility 

### Mobile Devices (iOS, Android)

**Requirements:**
- On same WiFi network as your computer
- Can ping your computer's IP

**Steps:**
1. Find your computer's IP (from above)
2. On mobile, open browser
3. Enter: `http://YOUR_IP:3000`

**Note:** If using HTTPS, you may get warnings on iOS/Android - that's normal for local IPs.

### Tablets

Same as mobile - use `http://YOUR_IP:3000`

### Laptops

Same as mobile - use `http://YOUR_IP:3000`

### Desktop Computers

Same as mobile - use `http://YOUR_IP:3000`

---

## Responsive Design Features ✅

The frontend already includes:
- ✅ Tailwind CSS with responsive breakpoints
- ✅ Mobile-first design approach
- ✅ Flexible layouts with `flex` and `grid`
- ✅ Responsive text sizing
- ✅ Touch-friendly buttons and spacing
- ✅ Viewport meta tag configured

All components are optimized for:
- 📱 Mobile (320px+)
- 📱 Tablet (640px+)
- 💻 Laptop (1024px+)
- 🖥️ Desktop (1280px+)

---

## Troubleshooting

### Issue: "Cannot find my IP"

**Solution:**
- Windows: Use `ipconfig` command
- Mac: Use `ifconfig` command
- Linux: Use `hostname -I` command
- Look for IPv4 address starting with 192.168, 10.x.x.x, or 172.16-31.x.x

### Issue: "Connection refused from other device"

**Solutions:**
1. Check firewall - allow port 3000 and 5000
2. Verify both devices are on same WiFi
3. Try pinging your IP: `ping YOUR_IP`
4. Check .env files have correct IP
5. Double-check IP address (typo?)

### Issue: "Page loads but API calls fail"

**Solutions:**
1. Verify `REACT_APP_API_URL` is set correctly
2. Check backend is running: `http://YOUR_IP:5000/api/health`
3. Check CORS settings - frontend IP should match FRONTEND_URLS
4. Look at browser console for errors

### Issue: "Mobile loads but looks weird"

**Solutions:**
1. Check viewport is correct (meta tag exists)
2. Try different screen orientations
3. Clear browser cache: Ctrl+Shift+Delete on Chrome
4. Check CSS classes load properly
5. Verify no hard-coded widths in components

### Issue: "Backend won't start on 0.0.0.0"

**Note:** This is normal - the connection log might not show 0.0.0.0.
The server IS listening on all interfaces.

---

## Testing Checklist

### Local Testing:
- [ ] Backend starts: `npm start` in Backend/
- [ ] Frontend starts: `npm start` in Frontend/
- [ ] Open `http://localhost:3000` → works
- [ ] Can login
- [ ] Can create assignment
- [ ] Can submit assignment

### Network Testing (from another device):
- [ ] Other device on same WiFi
- [ ] Open `http://YOUR_IP:3000`
- [ ] Page loads (may take 30 seconds first time)
- [ ] Can login
- [ ] Can navigate between pages
- [ ] API calls work (check Network tab in DevTools)
- [ ] Can create assignment
- [ ] Can submit assignment

### Mobile Testing:
- [ ] Landscape orientation works
- [ ] Portrait orientation works
- [ ] Touch buttons work
- [ ] Can scroll smoothly
- [ ] Text is readable
- [ ] Forms are usable

---

## Environment Variables Reference

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Frontend URLs (CORS whitelist)
FRONTEND_URLS=http://localhost:3000,http://192.168.1.100:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-grading

# Optional: Add other services
OPENAI_API_KEY=your_api_key
```

### Frontend (.env.local)
```env
# Backend API URL (use your IP for network access)
REACT_APP_API_URL=http://192.168.1.100:5000/api

# Optional: Add other configs
REACT_APP_ENVIRONMENT=development
```

---

## Security Notes ⚠️

### For Local Network (Safe):
- ✅ Fine to share on private WiFi
- ✅ Fine to use HTTP (no sensitive production data)
- ✅ Fine to disable HTTPS for testing

### For Public Networks (NOT SAFE):
- ❌ Do NOT expose to internet without HTTPS
- ❌ Do NOT share credentials over HTTP
- ❌ Set up proper authentication
- ❌ Use environment variables for secrets

### Best Practices:
- Keep IP addresses private
- Use HTTPS in production
- Don't commit .env files
- Rotate API keys regularly
- Use strong passwords

---

## Performance Tips

### For Slower Networks:
1. Reduce image sizes
2. Enable compression
3. Cache dependencies
4. Use production build: `npm run build`

### For Many Devices:
1. Ensure WiFi has good signal
2. Use 5GHz band if available
3. Monitor network bandwidth
4. Check if router needs restart

---

## Quick Reference Table

| Device | URL | Requirements |
|--------|-----|--------------|
| Your Computer | `http://localhost:3000` | None |
| Laptop on WiFi | `http://YOUR_IP:3000` | Same WiFi |
| Mobile on WiFi | `http://YOUR_IP:3000` | Same WiFi |
| Tablet on WiFi | `http://YOUR_IP:3000` | Same WiFi |
| Desktop on WiFi | `http://YOUR_IP:3000` | Same WiFi |

Replace `YOUR_IP` with your actual IP address (e.g., 192.168.1.100)

---

## Support

For issues:
1. Check troubleshooting section above
2. Verify IP address is correct
3. Check .env files are properly formatted
4. Ensure both frontend and backend are running
5. Look at browser console (F12) for errors
6. Check server logs for API errors

---

**Happy sharing! 🎓**
