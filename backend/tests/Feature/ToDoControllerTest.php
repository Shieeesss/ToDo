<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ToDo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToDoControllerTest extends TestCase
{
    use RefreshDatabase;

    public function it_fetches_all_todos_for_authenticated_user()
    {
        $user = User::factory()->create();
        $todos = ToDo::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/todos');

        $response->assertStatus(200)
                 ->assertJsonCount(3)
                 ->assertJsonStructure([
                     '*' => ['id', 'title', 'description', 'is_completed', 'deadline', 'created_at', 'updated_at']
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_creates_a_todo()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/todos', [
            'title' => 'Test ToDo',
            'description' => 'Test Description',
            'is_completed' => false,
            'deadline' => now()->addDay()->toDateString(),
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'title', 'description', 'is_completed', 'deadline', 'created_at', 'updated_at']);

        $this->assertDatabaseHas('to_dos', ['title' => 'Test ToDo']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_updates_a_todo()
    {
        $user = User::factory()->create();
        $todo = ToDo::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/todos/{$todo->id}", [
            'title' => 'Updated ToDo',
            'description' => 'Updated Description',
            'is_completed' => true,
            'deadline' => now()->addDay()->toDateString(),
        ]);

        $response->assertStatus(200)
                 ->assertJson(['title' => 'Updated ToDo', 'description' => 'Updated Description', 'is_completed' => true]);

        $this->assertDatabaseHas('to_dos', ['title' => 'Updated ToDo']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_deletes_a_todo()
    {
        $user = User::factory()->create();
        $todo = ToDo::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/todos/{$todo->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Todo deleted successfully']);

        $this->assertDatabaseMissing('to_dos', ['id' => $todo->id]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_prevents_unauthenticated_user_from_accessing_todos()
    {
        $response = $this->getJson('/api/todos');

        $response->assertStatus(401);
    }
}
