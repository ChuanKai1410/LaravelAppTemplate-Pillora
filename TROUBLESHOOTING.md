# Troubleshooting Login & Network Issues

## ✅ Current Configuration

- **Server IP:** `10.217.99.219:8000` (or `192.168.56.1:8000`)
- **Mobile App API URL:** `http://10.217.99.219:8000`
- **Server Status:** Running on `0.0.0.0:8000` (accessible from network)

## Test Users

- **Email:** `test@example.com` | **Password:** `password123`
- **Email:** `admin@pillora.com` | **Password:** `password123`
- **Email:** `user@pillora.com` | **Password:** `password123`

## Quick Fixes

### 1. Server Not Running
```bash
php artisan serve --host=0.0.0.0 --port=8000
```
**Important:** Use `--host=0.0.0.0` to allow network connections!

### 2. Wrong API URL in Mobile App

**For Android Emulator:**
```javascript
export const API_BASE_URL = 'http://10.0.2.2:8000';
```

**For iOS Simulator:**
```javascript
export const API_BASE_URL = 'http://localhost:8000';
```

**For Physical Device:**
```javascript
export const API_BASE_URL = 'http://10.217.99.219:8000';
// OR
export const API_BASE_URL = 'http://192.168.56.1:8000';
```

### 3. Firewall Blocking Port 8000

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change Settings" → "Allow another app"
4. Browse to `C:\xampp\php\php.exe`
5. Check both "Private" and "Public"
6. Click OK

**Or allow port 8000:**
```powershell
New-NetFirewallRule -DisplayName "Laravel Server" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

### 4. Test API Connection

**From Browser:**
- Ping: `http://10.217.99.219:8000/api/ping`
- Should return: `{"message":"pong"}`

**From Mobile Device Browser:**
- Open browser on your phone
- Go to: `http://10.217.99.219:8000/api/ping`
- Should see: `{"message":"pong"}`

### 5. Check Server Logs

```bash
# View recent errors
Get-Content storage/logs/laravel.log -Tail 50

# Clear logs
php artisan log:clear
```

### 6. Verify Database Connection

```bash
php artisan migrate:status
```

### 7. Clear Laravel Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## Common Error Messages

### "Network request failed"
- **Cause:** Server not running or wrong IP address
- **Fix:** 
  1. Check server is running: `netstat -ano | findstr :8000`
  2. Verify IP address matches your network
  3. Check firewall settings

### "Login Failed"
- **Cause:** Wrong credentials or API endpoint issue
- **Fix:**
  1. Verify test user exists: Check `TEST_USERS.md`
  2. Test API endpoint directly in browser
  3. Check Laravel logs for errors

### "Connection refused"
- **Cause:** Server not accessible from network
- **Fix:**
  1. Restart server with `--host=0.0.0.0`
  2. Check firewall settings
  3. Verify mobile device is on same network

## Testing Steps

1. **Start Server:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. **Test from Computer Browser:**
   - Open: `http://localhost:8000/api/ping`
   - Should see: `{"message":"pong"}`

3. **Test from Mobile Browser:**
   - Open: `http://10.217.99.219:8000/api/ping`
   - Should see: `{"message":"pong"}`

4. **Test Login Endpoint:**
   - Use Postman or curl:
   ```bash
   curl -X POST http://10.217.99.219:8000/api/login \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

5. **Try Login in Mobile App:**
   - Use: `test@example.com` / `password123`

## Still Not Working?

1. **Check if server is accessible:**
   ```bash
   # From mobile device browser, try:
   http://10.217.99.219:8000/api/ping
   ```

2. **Check your network IP:**
   ```bash
   ipconfig | findstr IPv4
   ```

3. **Try alternative IP:**
   - Update `mobile/src/config.jsx` with `192.168.56.1:8000`

4. **Check Expo/React Native logs:**
   - Look for network errors in console
   - Check if API_BASE_URL is correct

5. **Verify CORS is configured:**
   - Check `config/cors.php` - should allow all origins (`*`)

