<?php

namespace App\Services;

use App\Models\ToDo;
use App\Http\Requests\StoreToDoRequest;
use App\Http\Requests\UpdateToDoRequest;

class ToDoService
{
    public function getAllToDos()
    {
        return ToDo::where('user_id', auth()->id())->get(['id', 'title', 'description', 'is_completed', 'deadline', 'created_at', 'updated_at']);
    }

    public function createToDo(StoreToDoRequest $request)
    {
        $validatedData = $request->validated();

        return ToDo::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'] ?? null,
            'is_completed' => $validatedData['is_completed'] ?? false,
            'deadline' => $validatedData['deadline'] ?? null,
            'user_id' => auth()->id(),
        ]);
    }

    public function updateToDo(UpdateToDoRequest $request, $id)
    {
        $validatedData = $request->validated();

        $todo = ToDo::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $todo->update($validatedData);
        return $todo;
    }

    public function deleteToDo($id)
    {
        $todo = ToDo::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $todo->delete();
        return $todo;
    }
}
