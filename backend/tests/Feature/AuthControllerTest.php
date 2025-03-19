<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\postJson;
use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('registers a user', function () {
    $response = postJson('/api/auth/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['token']);
});

it('logs in a user', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure(['token']);
});

it('fails to log in with invalid credentials', function () {
    $response = postJson('/api/auth/login', [
        'email' => 'wrong@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
             ->assertJsonStructure(['error']);
});

it('logs out a user', function () {
    $user = User::factory()->create();
    $token = $user->createToken('authToken')->plainTextToken;

    $response = actingAs($user)->postJson('/api/auth/logout');

    $response->assertStatus(200)
             ->assertJson(['message' => 'Logged out']);
});

it('gets the authenticated user', function () {
    $user = User::factory()->create();
    $token = $user->createToken('authToken')->plainTextToken;

    $response = actingAs($user)->getJson('/api/auth/me');

    $response->assertStatus(200)
             ->assertJson(['id' => $user->id, 'email' => $user->email]);
});

it('prevents registration with invalid data', function () {
    $response = postJson('/api/auth/register', [
        'first_name' => '',
        'last_name' => '',
        'email' => 'invalid-email',
        'password' => 'short',
        'password_confirmation' => 'different',
    ]);

    $response->assertStatus(422)
             ->assertJsonStructure(['errors']);
});

it('prevents login with invalid data', function () {
    $response = postJson('/api/auth/login', [
        'email' => 'invalid-email',
        'password' => '',
    ]);

    $response->assertStatus(422)
             ->assertJsonStructure(['errors']);
});
