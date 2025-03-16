<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ToDoController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::controller(AuthController::class)
    ->prefix('auth')
    ->group(function () {
        Route::post('/register', 'register'); // Register a new user
        Route::post('/login', 'login'); // Login a user
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', 'logout'); // Logout a user
            Route::get('/me', 'me'); // Get authenticated user details
        });
    });

// ToDo routes protected by Sanctum middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/todos', [ToDoController::class, 'store']); // Create a new todo
    Route::get('/todos', [ToDoController::class, 'index']); // Fetch user todos
    Route::put('/todos/{id}', [ToDoController::class, 'update']); // Update a todo
    Route::delete('/todos/{id}', [ToDoController::class, 'destroy']); // Delete a todo
});

// Handle validation errors
Route::fallback(function () {
    return response()->json(['message' => 'Resource not found'], 404);
});
