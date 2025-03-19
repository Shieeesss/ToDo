<?php

namespace App\Http\Controllers;

use App\Services\ToDoService;
use App\Http\Requests\StoreToDoRequest;
use App\Http\Requests\UpdateToDoRequest;

class ToDoController extends Controller
{
    protected $toDoService;

    public function __construct(ToDoService $toDoService)
    {
        $this->toDoService = $toDoService;
    }

    public function index()
    {
        $todos = $this->toDoService->getAllToDos();
        return response()->json($todos);
    }

    public function store(StoreToDoRequest $request)
    {
        try {
            $todo = $this->toDoService->createToDo($request);
            return response()->json($todo, 201);
        } catch (\Exception $e) {
            \Log::error('Failed to create todo: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create todo: ' . $e->getMessage()], 500);
        }
    }

    public function update(UpdateToDoRequest $request, $id)
    {
        try {
            $todo = $this->toDoService->updateToDo($request, $id);
            return response()->json($todo);
        } catch (\Exception $e) {
            \Log::error('Failed to update todo: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update todo: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->toDoService->deleteToDo($id);
            return response()->json(['message' => 'Todo deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to delete todo: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete todo: ' . $e->getMessage()], 500);
        }
    }
}
