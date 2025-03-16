<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ToDoController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)
    ->prefix('auth')
    ->group(function () {
        Route::post('/register', 'register');
        Route::post('/login', 'login');
        Route::middleware('auth:sanctum')->group(function () {
                Route::post('/logout', 'logout');
                Route::get('/me', 'me');
        });
});


// Handle validation errors
Route::fallback(function () {
    return response()->json(['message' => 'Resource not found'], 404);
});
