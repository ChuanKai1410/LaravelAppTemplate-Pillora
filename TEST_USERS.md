# Test Users Created

The following test users have been created in the database for testing:

## Test Accounts

### Account 1
- **Email:** `test@example.com`
- **Password:** `password123`
- **Name:** Test User

### Account 2
- **Email:** `admin@pillora.com`
- **Password:** `password123`
- **Name:** Admin User

### Account 3
- **Email:** `user@pillora.com`
- **Password:** `password123`
- **Name:** Demo User

## How to Login

1. **Start the Laravel API server:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```
   The `--host=0.0.0.0` allows connections from other devices on your network.

2. **Update API URL in mobile app:**
   - For **local testing** (emulator/simulator): Use `http://localhost:8000`
   - For **physical device**: Use your computer's IP address (e.g., `http://192.168.1.xxx:8000`)
   
   Edit `mobile/src/config.jsx` to set the correct `API_BASE_URL`.

3. **Find your computer's IP address:**
   - **Windows:** Open Command Prompt and run: `ipconfig | findstr IPv4`
   - **Mac/Linux:** Run: `ifconfig` or `ip addr`

4. **Test the API connection:**
   - Open browser: `http://localhost:8000/api/ping`
   - Should return: `{"message":"pong"}`

## Troubleshooting "Network Login Failed"

1. **Check if Laravel server is running:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. **Verify API URL in mobile app:**
   - Check `mobile/src/config.jsx`
   - Make sure it matches your server address

3. **Test API endpoint directly:**
   - Try: `http://YOUR_IP:8000/api/ping` in browser
   - Should return: `{"message":"pong"}`

4. **Check firewall:**
   - Make sure port 8000 is not blocked by Windows Firewall
   - Allow Laravel through firewall if needed

5. **Verify database connection:**
   ```bash
   php artisan migrate:status
   ```

## Creating More Test Users

To create additional test users, you can:

1. **Use the registration endpoint** via the mobile app
2. **Run the seeder again:**
   ```bash
   php artisan db:seed
   ```
3. **Create manually via Tinker:**
   ```bash
   php artisan tinker
   ```
   Then:
   ```php
   User::create([
       'name' => 'Your Name',
       'email' => 'your@email.com',
       'password' => Hash::make('yourpassword'),
   ]);
   ```

