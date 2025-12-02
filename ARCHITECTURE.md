# Pillora Architecture - Laravel MVC + React Native View

## Architecture Overview

This application follows **Laravel MVC architecture** where:
- **Laravel (Backend)**: Contains Models, Controllers, and Routes
- **React Native (Frontend)**: Contains only Views and API service layer

## Backend Structure (Laravel)

### Models (`app/Models/`)
- `User.php` - User model with relationships
- `Medication.php` - Medication model
- `Pharmacy.php` - Pharmacy model
- `Order.php` - Order model
- `OrderItem.php` - Order item model
- `Reminder.php` - Reminder model
- `Payment.php` - Payment model
- `MedicationIntake.php` - Medication intake tracking

### Controllers (`app/Http/Controllers/Api/`)
- `MedicationController.php` - CRUD operations for medications
- `DashboardController.php` - Dashboard data aggregation
- `AnalyticsController.php` - Analytics and adherence calculations
- `ReminderController.php` - Reminder management
- `PharmacyController.php` - Pharmacy listings
- `OrderController.php` - Order management
- `PaymentController.php` - Payment processing

### Routes (`routes/api.php`)
All API routes are protected with `auth:sanctum` middleware:
- `/api/dashboard` - GET dashboard data
- `/api/medications` - CRUD for medications
- `/api/medications/scan` - POST scan barcode
- `/api/analytics` - GET analytics data
- `/api/reminders` - GET/PUT reminders
- `/api/pharmacies` - GET pharmacy list
- `/api/orders` - CRUD for orders
- `/api/payments` - POST process payment

### Migrations (`database/migrations/`)
- `create_medications_table.php`
- `create_pharmacies_table.php`
- `create_orders_table.php`
- `create_order_items_table.php`
- `create_reminders_table.php`
- `create_payments_table.php`
- `create_medication_intakes_table.php`

## Frontend Structure (React Native)

### Views (`mobile/src/views/`)
Pure UI components that receive props and call callbacks:
- `HomeView.jsx` - Home screen UI

### Screens (`mobile/src/screens/`)
Screen components that:
- Call API service
- Handle navigation
- Pass data to views
- Handle errors

### API Service (`mobile/src/api.jsx`)
Simple HTTP client that makes requests to Laravel API endpoints.

### Navigation (`mobile/src/navigation/`)
- `BottomNavigation.jsx` - Bottom tab navigation

## Data Flow

```
React Native View
    ↓ (user interaction)
React Native Screen
    ↓ (API call)
API Service (api.jsx)
    ↓ (HTTP request)
Laravel Route (routes/api.php)
    ↓ (routing)
Laravel Controller (app/Http/Controllers/Api/)
    ↓ (business logic)
Laravel Model (app/Models/)
    ↓ (database query)
Database
```

## Key Principles

1. **Separation of Concerns**: Business logic stays in Laravel, UI logic in React Native
2. **Single Responsibility**: Each layer has one clear purpose
3. **API-First**: All communication through RESTful API
4. **Stateless**: React Native doesn't store business logic, only UI state

## Next Steps

1. Run migrations: `php artisan migrate`
2. Install React Native dependencies: `cd mobile && npm install`
3. Start Laravel server: `php artisan serve --host=0.0.0.0 --port=8000`
4. Start Expo: `cd mobile && npm start`

