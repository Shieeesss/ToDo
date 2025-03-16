<?php

namespace App\Http\Controllers;

use App\Models\ToDo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ToDoController extends Controller {
    public function index() {
        $todos = ToDo::where('user_id', auth()->id())->get(['id', 'title', 'description', 'is_completed', 'deadline', 'created_at', 'updated_at']);
        return response()->json($todos);
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
            'deadline' => 'nullable|date', // Validate the deadline field
        ]);

        try {
            $todo = ToDo::create([
                'title' => $request->title,
                'description' => $request->description,
                'is_completed' => $request->is_completed ?? false,
                'deadline' => $request->deadline,
                'user_id' => auth()->id(),
            ]);

            return response()->json($todo, 201);
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            \Log::error('Failed to create todo: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create todo: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
            'deadline' => 'nullable|date', // Validate the deadline field
        ]);

        $todo = ToDo::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $todo->update($request->only(['title', 'description', 'is_completed', 'deadline']));
        return response()->json($todo);
    }

    public function destroy($id) {
        $todo = ToDo::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully']);
    }
}
