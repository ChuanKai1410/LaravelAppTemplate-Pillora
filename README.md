# Pillora - Laravel 11 API + Expo (React Native)

A minimal API backend (Laravel 11, Sanctum, Breeze API, Bouncer) and a mobile/web client (Expo React Native) with Login, Register, Forgot Password, and a simple Home screen.

## Prerequisites

- PHP 8.3+
- Composer
- MySQL (Laragon, XAMPP or local MySQL)
- Node.js 18+ and npm
- Expo Go on your device (Android/iOS)

## 1) Backend setup (Laravel)

1. Clone the repo and install PHP deps:
```bash
composer install
```

2. Copy env and set app key:
```bash
cp .env.example .env
php artisan key:generate
```

3. Configure database in `.env` (Laragon default below):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pillora_database
DB_USERNAME=root
DB_PASSWORD=
```
Create the database `pillora_database` in phpMyAdmin (or MySQL CLI) if it doesn’t exist.

4. Run migrations:
```bash
php artisan migrate
```

5. Start the API server (bind to all interfaces for devices):
```bash
php artisan serve --host=0.0.0.0 --port=8000
```
Backend health checks:
- `http://localhost:8000/up` → Laravel health
- `http://localhost:8000/api/ping` → {"message":"pong"}

## 2) CORS (already configured)
CORS is open for development and applies to all routes. No action needed for dev.

## 3) Auth
- Endpoints (stateless JSON):
  - `POST /api/register` → returns `{ token, user }`
  - `POST /api/login` → returns `{ token, user }`
  - `POST /api/logout` (auth)
  - `GET  /api/user` (auth)
- Send token as `Authorization: Bearer <token>`

## 4) Email for Forgot Password
By default emails are logged to a file (dev-friendly):
```env
MAIL_MAILER=log
```
- Reset link will appear in `storage/logs/laravel.log`

To send real emails via Gmail (recommended only for testing with App Passwords):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=<your-gmail-app-password>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your@gmail.com
MAIL_FROM_NAME="Pillora"
```
Then:
```bash
php artisan config:clear
php artisan queue:work --tries=3
```
(Queue worker sends the email.)

Alternative: use Mailtrap (sandbox SMTP) and replace host/credentials accordingly.

## 5) Client app (Expo)

1. Install client deps:
```bash
cd mobile
npm install
```

2. Start Expo for web:
```bash
npm run web
```
Web should open at `http://localhost:8081`.

3. Start Expo for devices (LAN):
```bash
npx expo start --lan --clear
```
- Scan the QR in Expo Go.
- The URL should look like `exp://<YOUR_LAN_IP>:8081` (NOT 127.0.0.1).

If your network blocks LAN, use a tunnel:
```bash
npx expo start --tunnel --clear
```

## 6) Configure API base URL for the app
The app reads the backend URL from `mobile/src/config.jsx`:
```js
export const API_BASE_URL = 'http://YOUR_LAN_IP:8000';
```
- For local web (same machine): `http://localhost:8000` works.
- For phones/emulators: use your PC’s LAN IP, e.g. `http://192.168.1.23:8000`.

### How to find your LAN IP (Windows)
- Settings → Network & Internet → your active Wi‑Fi/Ethernet → IPv4 address
- Or Command Prompt:
```bash
ipconfig
```
Use the IPv4 address of your active adapter (not VirtualBox/VMware; ignore 169.* addresses).

### Verify connectivity from your device
Open the phone browser and visit:
```
http://YOUR_LAN_IP:8000/api/ping
```
It must return `{"message":"pong"}`.

## 7) Common issues

- Expo shows `exp://127.0.0.1:8081`
  - Start with LAN mode: `npx expo start --lan --clear`
  - Ensure Windows firewall allows `node.exe` on Private networks
  - iOS: Settings → Expo Go → enable Local Network
  - Clear Expo Go cache/reinstall if needed

- Phone can’t hit the API
  - Use `php artisan serve --host=0.0.0.0 --port=8000`
  - Use your PC’s LAN IP in `mobile/src/config.jsx`
  - Allow firewall for `php.exe` (port 8000)

- 419 or 500 during auth
  - Make sure you call `/api/register` and `/api/login` (not web routes)
  - Restart server: `php artisan route:clear` then re-run `serve`

- Password too short during register
  - Breeze defaults to min 8 characters. Use a longer password.

## 8) Project structure (high-level)
```
app/Http/Controllers/Auth/*      # API controllers for auth
routes/api.php                   # API routes (stateless)
mobile/                          # Expo app (JSX)
  src/config.jsx                 # API base URL
  src/screens/*                  # Login, Register, Forgot, Home
  src/styles.jsx                 # Shared theme/styles
```

## 9) Development scripts
- Start backend: `php artisan serve --host=0.0.0.0 --port=8000`
- Start Expo (LAN): `cd mobile && npx expo start --lan --clear`
- Start Expo Web: `cd mobile && npm run web`

## 10) Security notes
- Do not commit real SMTP credentials
- Use App Passwords with Gmail
- Lock down CORS before production
- Rotate Sanctum tokens when needed

---
If anything fails, share: the request URL, status code, and the last 20 lines of `storage/logs/laravel.log`.
