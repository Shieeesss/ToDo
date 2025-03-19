<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request; // Correct import for Request class
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // Register User
    public function register(RegisterRequest $request)
    {
        $token = $this->authService->register($request);
        return response()->json(['token' => $token], 201);
    }

    // Login User
    public function login(LoginRequest $request)
    {
        try {
            $token = $this->authService->login($request);
            return response()->json(['token' => $token]);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Logout User
    public function logout(Request $request)
    {
        $this->authService->logout($request);
        return response()->json(['message' => 'Logged out']);
    }

    // Get Authenticated User
    public function me(Request $request)
    {
        $user = $this->authService->me($request);
        return response()->json($user);
    }
}
