<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;

Route::get('/ping', fn () => ['message' => 'pong']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Auth routes - defined directly here so they get /api prefix
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('api.register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('api.login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('api.password.email');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('api.logout');
    
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
    
    // Medications
    Route::apiResource('medications', \App\Http\Controllers\Api\MedicationController::class);
    Route::post('/medications/scan', [\App\Http\Controllers\Api\MedicationController::class, 'scan']);
    
    // Analytics
    Route::get('/analytics', [\App\Http\Controllers\Api\AnalyticsController::class, 'index']);
    
    // Reminders
    Route::get('/reminders', [\App\Http\Controllers\Api\ReminderController::class, 'index']);
    Route::post('/reminders', [\App\Http\Controllers\Api\ReminderController::class, 'store']);
    Route::put('/reminders/{reminder}', [\App\Http\Controllers\Api\ReminderController::class, 'update']);
    Route::delete('/reminders/{reminder}', [\App\Http\Controllers\Api\ReminderController::class, 'destroy']);
    Route::put('/reminders/settings', [\App\Http\Controllers\Api\ReminderController::class, 'updateSettings']);
    
    // Pharmacies
    Route::get('/pharmacies', [\App\Http\Controllers\Api\PharmacyController::class, 'index']);
    
    // Orders
    Route::apiResource('orders', \App\Http\Controllers\Api\OrderController::class);
    
    // Payments
    Route::post('/payments', [\App\Http\Controllers\Api\PaymentController::class, 'process']);
});
