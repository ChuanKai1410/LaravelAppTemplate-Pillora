# Architecture Documentation

## MVC Pattern Implementation

This application follows a clear separation of concerns using the Model-View-Controller (MVC) pattern.

### Directory Structure

```
mobile/src/
├── models/          # Data models and API operations
├── controllers/     # Business logic and state management
├── views/           # UI components (presentation layer)
├── screens/         # Screen components (connects Controller + View)
├── navigation/      # Navigation components
└── api.jsx          # API service layer
```

### Components

#### Models (`models/`)
- **Purpose**: Handle all data operations and API calls
- **Responsibilities**:
  - Fetching data from API
  - Data transformation
  - Error handling at data layer
- **Files**:
  - `MedicationModel.jsx` - Medication CRUD operations
  - `DashboardModel.jsx` - Dashboard data
  - `AnalyticsModel.jsx` - Analytics data
  - `ReminderModel.jsx` - Reminder operations
  - `PharmacyModel.jsx` - Pharmacy data
  - `OrderModel.jsx` - Order operations
  - `PaymentModel.jsx` - Payment processing
  - `UserModel.jsx` - User operations

#### Controllers (`controllers/`)
- **Purpose**: Manage business logic and state
- **Responsibilities**:
  - State management
  - Business logic
  - Data validation
  - Coordinating between Models and Views
- **Files**:
  - `HomeController.jsx` - Home screen logic
  - `MedicationsController.jsx` - Medications screen logic
  - `ScanController.jsx` - Scan screen logic
  - `AnalyticsController.jsx` - Analytics screen logic
  - `ProfileController.jsx` - Profile screen logic

#### Views (`views/`)
- **Purpose**: Pure UI components
- **Responsibilities**:
  - Rendering UI
  - Handling user interactions (calls callbacks)
  - No business logic
- **Files**:
  - `HomeView.jsx` - Home screen UI

#### Screens (`screens/`)
- **Purpose**: Connect Controllers and Views
- **Responsibilities**:
  - Initialize controllers
  - Pass data from controllers to views
  - Handle navigation
  - Error handling at screen level

### Data Flow

```
User Interaction
    ↓
Screen Component
    ↓
Controller (useController hook)
    ↓
Model (API calls)
    ↓
API Service
    ↓
Backend
```

### Example: Home Screen

1. **Screen** (`screens/HomeScreen.jsx`):
   - Uses `useHomeController` hook
   - Passes data to `HomeView`
   - Handles navigation

2. **Controller** (`controllers/HomeController.jsx`):
   - Manages state (user, dashboard, loading, error)
   - Calls `DashboardModel.getDashboard()`
   - Returns state and methods

3. **Model** (`models/DashboardModel.jsx`):
   - Calls API service
   - Transforms data
   - Returns formatted data

4. **View** (`views/HomeView.jsx`):
   - Receives props
   - Renders UI
   - Calls callbacks for user actions

### Benefits

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Easy to test each layer independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Reusability**: Views and controllers can be reused
5. **Scalability**: Easy to add new features following the same pattern

