<?php

namespace App\Services;

use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request; // Correct import for Request class
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(RegisterRequest $request)
    {
        $validatedData = $request->validated();

        $user = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        return $user->createToken('auth_token')->plainTextToken;
    }

    public function login(LoginRequest $request)
    {
        $validatedData = $request->validated();

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['No Account found. Please Register.'],
            ]);
        }

        if (!Hash::check($validatedData['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Incorrect Password. Please Try Again.'],
            ]);
        }

        return $user->createToken('auth_token')->plainTextToken;
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}
