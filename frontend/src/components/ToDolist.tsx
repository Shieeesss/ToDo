"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, deleteTodo, updateTodo } from "../lib/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "./LoadingSpinner";

// Define the sorting options
const SORT_OPTIONS = ["created_at", "updated_at"];

// Zod schema for validation
const todoSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(50, "Title is too long! Maximum of 50 Characters."),
  description: z.string()
    .max(300, "Description cannot exceed 300 characters")
    .optional(), // Make the description field optional
  deadline: z.string().min(1, "Deadline is required"), // Make deadline required
  date: z.string().min(1, "Date is required"), // Make date required
});

export default function ToDoList() {
  const queryClient = useQueryClient();

  // State for filtering, sorting, and search query
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [editingTodo, setEditingTodo] = useState<any | null>(null); // Local state for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);

  // Fetching todos from the API
  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos", filter, sortBy, searchQuery], // Add searchQuery to query key
    queryFn: async () => {
      const fetchedTodos = await fetchTodos();
      return fetchedTodos.map((todo: any) => ({
        ...todo,
        deadline: isNaN(new Date(todo.deadline).getTime()) ? new Date().toISOString().split('T')[0] : new Date(todo.deadline).toISOString().split('T')[0], // Ensure deadline is valid and formatted correctly
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Fix here
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: { title?: string; description?: string; is_completed?: boolean; deadline: string, date: string } }) =>
      updateTodo(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }), // Fix here
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(todoSchema),
  });

  const handleEditClick = (todo: any) => {
    setEditingTodo(todo);
    setValue("title", todo.title); // Pre-fill the title field with the current title
    setValue("description", todo.description || ""); // Pre-fill the description field with the current description
    setValue("deadline", todo.deadline || new Date().toISOString().split('T')[0]); // Pre-fill the deadline field with the current deadline or default to today
    setValue("date", todo.date || new Date().toISOString().split('T')[0]); // Pre-fill the date field with the current date or default to today
    setIsModalOpen(true); // Open the modal when edit is clicked
  };

  const onSubmit = (data: { title: string, description?: string, deadline: string }) => {
    if (data.title.trim() === "") return; // Prevent saving if title is empty

    const updates: any = { title: data.title };

    // Ensure empty descriptions are removed
    updates.description = data.description?.trim() !== "" ? data.description : "";
    updates.deadline = data.deadline; // Use the provided deadline
    updates.date = new Date().toISOString(); // Include date field

    updateMutation.mutate({
      id: editingTodo.id,
      updates,
    });

    setIsModalOpen(false); // Close modal after saving
    setEditingTodo(null); // Reset edit state
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without saving
    setEditingTodo(null); // Clear the editing todo
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'all' | 'completed' | 'pending');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  if (isLoading) return <LoadingSpinner />;

  // Filter todos based on the filter state
  const filteredTodos = todos.filter((todo: any) => {
    if (filter === 'completed') {
      return todo.is_completed;
    } else if (filter === 'pending') {
      return !todo.is_completed;
    }
    return true; // Show all tasks
  });

  // Sort todos based on the sortBy state
  const sortedTodos = filteredTodos.sort((a: any, b: any) => {
    if (sortBy === "created_at") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
  });

  // Filter todos based on the search query
  const searchResults = sortedTodos.filter((todo: any) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const title = todo.title ? todo.title.toLowerCase() : ""; // Ensure title is a string
    const description = todo.description ? todo.description.toLowerCase() : ""; // Ensure description is a string
    return (
      title.includes(lowerSearchQuery) ||
      description.includes(lowerSearchQuery)
    );
  });

  const highlightText = (text: string, query: string) => {
    if (!query) return text; // Return the text as is if there's no query
    const regex = new RegExp(`(${query})`, 'gi'); // Case-insensitive regex
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <span key={index} className="bg-yellow-300">{part}</span> : part
    );
  };

  return (
    <div>
      <div className="flex flex-wrap pt-5">
        <div className="relative w-full bg-[#EEF7FF] shadow-md sm:rounded-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 sm:space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-[#4D869C]"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full p-2 ps-10 text-sm border border-[#7AB2B2] rounded-lg bg-white focus:ring-[#4D869C] focus:border-[#4D869C]"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto space-y-3 sm:space-y-4 md:space-y-0 md:space-x-3">
              <select
                onChange={handleFilterChange}
                value={filter}
                className="p-2 border border-[#7AB2B2] rounded-lg bg-white text-[#4D869C] w-full md:w-auto"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed Tasks</option>
                <option value="pending">Pending Tasks</option>
              </select>
              <select
                onChange={handleSortChange}
                value={sortBy}
                className="p-2 border border-[#7AB2B2] rounded-lg bg-white text-[#4D869C] w-full md:w-auto"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    Sort by {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* To-Do List */}
      <div className="columns-2 md:columns-3 lg:columns-3 gap-4 space-y-4 mt-4">
        {searchResults.map((todo: any) => (
          <div
            key={todo.id}
            className={`relative break-inside-avoid w-full p-4 rounded-lg shadow-lg border-2 border-gray-300 bg-white flex flex-col 
        before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-b before:from-transparent before:via-gray-200/30 before:to-transparent before:pointer-events-none 
        ${todo.is_completed ? "bg-[#EEF7FF] border-[#4D869C]" : "bg-yellow-100 border-gray-300"}
      `}
          >
            {/* Top Section: Status & Actions */}
            <div className="flex relative items-center justify-between w-full absolute left-2 right-2">
              <span className={`text-[10px] font-semibold px-3 py-1 rounded-full 
          ${todo.is_completed ? "bg-green-200 text-green-600" : "bg-red-200 text-red-500"}`}>
                {todo.is_completed ? "Completed" : "Pending"}
              </span>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => updateMutation.mutate({ id: todo.id, updates: { is_completed: !todo.is_completed, deadline: todo.deadline, date: todo.date } })}
                  className="w-4 h-4 cursor-pointer accent-white-500"
                />

                {/* Dropdown */}
                <div className="relative group">
                  <button className="p-2 text-gray-700 hover:text-black">
                    <svg className="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-300 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={() => handleEditClick(todo)}
                      className="flex items-center w-full px-3 py-2 text-sm text-blue-500 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(todo.id)}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                      disabled={deleteMutation.isLoading} // Disable button while mutation is in progress
                    >
                      {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Title & Description */}
            <div className="flex flex-col p-3  flex-grow">
              {/* Task Title */}
              <span className={`font-bold text-lg font-serif w-full break-words ${todo.is_completed ? "text-gray-500" : "text-black"}`}>
                {highlightText(todo.title, searchQuery)}
              </span>
              <hr className={todo.is_completed ? "border-b-1 border-gray-300" : "border-b-1 border-black"} />

              {/* Task Description - Full Text & Expands */}
              <span className={`text-xs italic font-mono mt-2 w-full leading-relaxed border-l-4 pl-2 bg-gray-50 break-words    ${todo.is_completed ? "border-green-500" : "border-red-500"}`}>
                {highlightText(todo.description || "No description available", searchQuery)}
              </span>
              <p className="text-black">
                Deadline: {isNaN(new Date(todo.deadline).getTime()) ? "Invalid Date" : new Date(todo.deadline).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

            </div>

            {/* Bottom Section: Dates (Fixed at the Bottom) */}
            <div className="text-gray-500 text-[8px] sm:text-[10px] flex justify-between border-t border-gray-300 pt-2 p-2 mt-auto">
              <p>Created: {new Date(todo.created_at).toLocaleDateString()}</p>
              <p>Updated: {new Date(todo.updated_at).toLocaleDateString()}</p>
            </div>

          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">Edit Todo</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

              {/* Title Input with Character Count */}
              <input
                type="text"
                {...register("title")}
                className="border p-2 rounded mb-1"
                placeholder="Update title"
                onChange={(e) => setTitleCharCount(e.target.value.length)}
                maxLength={50} // Optional
              />
              {errors.title && <span className="text-red-500">{errors.title.message}</span>}
              <div className="text-gray-500 text-xs text-right">{titleCharCount}/50</div>

              {/* Description Input with Character Count */}
              <textarea
                {...register("description")}
                className="border p-2 rounded mb-1"
                placeholder="Update description"
                onChange={(e) => setDescCharCount(e.target.value.length)}
                maxLength={300} // Optional
              />
              {errors.description && <span className="text-red-500">{errors.description.message}</span>}
              <div className="text-gray-500 text-xs text-right">{descCharCount}/300</div>

              {/* Deadline Input */}
              <input
                type="date"
                {...register("deadline")}
                className="border p-2 rounded mb-1"
                placeholder="Update deadline"
              />
              {errors.deadline && <span className="text-red-500">{errors.deadline.message}</span>}

              <div className="flex justify-between mt-2">
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                <button type="button" onClick={handleCancel} className="text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
