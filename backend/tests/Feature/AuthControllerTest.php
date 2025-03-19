<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
uses(RefreshDatabase::class);

it('can register a user', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['token']);
});

it('can login a user', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['token']);
});

it('cannot login with invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
             ->assertJsonStructure(['error']);
});

it('can logout a user', function () {
    $user = User::factory()->create();
    $token = Auth::login($user);

    $response = $this->postJson('/api/logout', [], [
        'Authorization' => "Bearer $token"
    ]);

    $response->assertStatus(200)
             ->assertJson(['message' => 'Logged out']);
});

it('can get authenticated user', function () {
    $user = User::factory()->create();
    $token = Auth::login($user);

    $response = $this->getJson('/api/me', [
        'Authorization' => "Bearer $token"
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['id', 'name', 'email']);
});
