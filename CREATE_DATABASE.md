# How to Create Database in XAMPP

## Method 1: Using phpMyAdmin (Easiest)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services

2. **Open phpMyAdmin**
   - Open your browser
   - Go to: `http://localhost/phpmyadmin`
   - Or: `http://127.0.0.1/phpmyadmin`

3. **Create Database**
   - Click on **"New"** or **"Databases"** tab (left sidebar)
   - In **"Database name"** field, type: `pillora_database`
   - **Collation**: Select `utf8mb4_unicode_ci` (or leave default)
   - Click **"Create"** button

4. **Verify**
   - You should see `pillora_database` in the left sidebar
   - Click on it to see it's empty (no tables yet)

## Method 2: Using MySQL Command Line

1. **Open Command Prompt or Terminal**

2. **Navigate to MySQL (if in PATH)**
   ```bash
   mysql -u root -p
   ```
   - Password: (usually empty for XAMPP, just press Enter)
   - Or if you set a password, enter it

3. **Or use XAMPP's MySQL directly**
   ```bash
   # Windows - XAMPP MySQL path
   C:\xampp\mysql\bin\mysql.exe -u root -p
   ```

4. **Create Database**
   ```sql
   CREATE DATABASE pillora_database;
   ```

5. **Verify**
   ```sql
   SHOW DATABASES;
   ```
   You should see `pillora_database` in the list

6. **Exit**
   ```sql
   EXIT;
   ```

## Method 3: Using Laravel Artisan (After Database is Created)

Once the database exists, you can verify connection:

```bash
php artisan migrate:status
```

If connection works, you'll see migration status (or "No migrations found").

Then run migrations:
```bash
php artisan migrate
```

This will create all the tables in `pillora_database`.

## Verify Your .env Configuration

Make sure your `.env` file has:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pillora_database
DB_USERNAME=root
DB_PASSWORD=
```

**Note:** For XAMPP, `DB_PASSWORD` is usually empty (no password).

## Quick Checklist

- [ ] XAMPP MySQL service is running (green in XAMPP Control Panel)
- [ ] Database `pillora_database` created in phpMyAdmin
- [ ] `.env` file configured with correct database name
- [ ] `php artisan migrate` runs successfully
- [ ] Tables appear in phpMyAdmin under `pillora_database`

## Troubleshooting

**"Access denied" error:**
- Check if MySQL password is set in XAMPP
- Update `DB_PASSWORD` in `.env` if needed

**"Unknown database" error:**
- Database doesn't exist - create it first using Method 1 or 2

**"Connection refused" error:**
- MySQL service not running - start it in XAMPP Control Panel


