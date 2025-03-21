import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodos } from "../logics/todoLogic";
import ToDoItem from "./TodoItem";
import FilterSortControls from "./FilterSortControls";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import ConfirmCompletionModal from "./ConfirmCompletionModal";
import ToDoForm from "./ToDoForm"; // Import the ToDoForm component
import { Dialog } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

const SORT_OPTIONS = ["created_at", "updated_at"];

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  date: z.string().optional(),
});

interface ToDoListProps {
  searchQuery: string;
}

export default function ToDoList({ searchQuery }: ToDoListProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'overdue'>('pending');
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0]);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add form modal
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [todoToComplete, setTodoToComplete] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<any | null>(null);

  const { todos, deleteMutation, updateMutation } = useTodos(filter, sortBy, searchQuery);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(todoSchema),
  });

  // Handle edit button click
  const handleEditClick = (todo: any) => {
    setEditingTodo(todo);
    setValue("title", todo.title);
    setValue("description", todo.description || "");
    setValue("deadline", todo.deadline || new Date().toISOString().split('T')[0]);
    setValue("date", todo.date || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: { title: string, description?: string, deadline: string }) => {
    if (data.title.trim() === "") return;

    const updates: any = { title: data.title };
    updates.description = data.description?.trim() !== "" ? data.description : "";
    updates.deadline = data.deadline;
    updates.date = new Date().toISOString();

    updateMutation.mutate({
      id: editingTodo.id,
      updates,
    });

    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'all' | 'completed' | 'pending' | 'overdue');
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Handle date change in calendar
  const handleDateChange = (value: Date | Date[] | null, event: React.MouseEvent<HTMLButtonElement>) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Handle clear date
  const handleClearDate = () => {
    setSelectedDate(null);
  };

  // Handle today date
  const handleTodayDate = () => {
    setSelectedDate(new Date());
  };

  // Handle checkbox click
  const handleCheckboxClick = (todo: any) => {
    setTodoToComplete(todo);
    setIsConfirmModalOpen(true);
  };

  // Confirm completion
  const confirmCompletion = () => {
    if (todoToComplete) {
      updateMutation.mutate({ id: todoToComplete.id, updates: { is_completed: !todoToComplete.is_completed, deadline: todoToComplete.deadline, date: todoToComplete.date } });
      setIsConfirmModalOpen(false);
      setTodoToComplete(null);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (todo: any) => {
    setTodoToDelete(todo);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDeletion = () => {
    if (todoToDelete) {
      deleteMutation.mutate(todoToDelete.id);
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDeletion = () => {
    setIsDeleteModalOpen(false);
    setTodoToDelete(null);
  };

  // Cancel completion
  const cancelCompletion = () => {
    setIsConfirmModalOpen(false);
    setTodoToComplete(null);
  };

  // Ensure todos is defined before filtering
  const filteredTodos = todos ? todos.filter((todo: any) => {
    if (filter === 'completed') {
      return todo.is_completed;
    } else if (filter === 'pending') {
      return !todo.is_completed;
    } else if (filter === 'overdue') {
      return !todo.is_completed && new Date(todo.deadline) < new Date();
    }
    return true;
  }) : [];

  // Filter todos based on the selected date
  const dateFilteredTodos = selectedDate ? filteredTodos.filter((todo: any) => {
    const todoDate = new Date(todo.deadline).toDateString();
    return todoDate === selectedDate.toDateString();
  }) : filteredTodos;

  // Sort todos based on the selected sort option
  const sortedTodos = dateFilteredTodos.sort((a: any, b: any) => {
    if (sortBy === "created_at") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
  });

  // Filter todos based on the search query
  const searchResults = sortedTodos.filter((todo: any) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const title = todo.title ? todo.title.toLowerCase() : "";
    const description = todo.description ? todo.description.toLowerCase() : "";
    return (
      title.includes(lowerSearchQuery) ||
      description.includes(lowerSearchQuery)
    );
  });

  // Highlight search query in the text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <span key={index} className="bg-yellow-300">{part}</span> : part
    );
  };

  // Determine the message to display based on the filter
  const getEmptyMessage = () => {
    switch (filter) {
      case 'completed':
        return 'No tasks completed.';
      case 'pending':
        return 'No pending tasks.';
      case 'overdue':
        return 'No overdue tasks.';
      default:
        return 'Your to-do list is empty.';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap pt-5">
        <div className="relative w-full bg-[#EEF7FF] shadow-md sm:rounded-lg p-4">
          <FilterSortControls
            filter={filter}
            sortBy={sortBy}
            handleFilterChange={handleFilterChange}
            handleSortChange={handleSortChange}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            setSelectedDate={setSelectedDate}
            handleClearDate={handleClearDate}
            handleTodayDate={handleTodayDate}
            searchQuery={searchQuery}
            handleSearchChange={() => { }}
            handleSearch={() => { }}
          />
        </div>
      </div>

      {/* To-Do List */}
      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-gray-500 mb-4">{getEmptyMessage()}</p>
          <button
            onClick={() => setIsAddModalOpen(true)} // Open add form modal
            className="flex items-center justify-center w-16 h-16 text-black"
          >
            <svg className="w-20 h-20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h4M9 3v4a1 1 0 0 1-1 1H4m11 6v4m-2-2h4m3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="columns-1 md:columns-3 lg:columns-3 gap-4 space-y-4 mt-4">
          {searchResults.map((todo: any) => (
            <ToDoItem
              key={todo.id}
              todo={todo}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              handleCheckboxClick={handleCheckboxClick}
              highlightText={highlightText}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}

      {/* Modal for adding a new to-do */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-400 bg-opacity-80 backdrop-blur-sm"
      >
        <Dialog.Panel className="relative bg-white rounded-lg p-6 shadow-lg mx-4 sm:mx-0 max-w-lg w-full">
          <button onClick={() => setIsAddModalOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-center text-[#4D869C]">Add New Task</h2>
          <ToDoForm closeForm={() => setIsAddModalOpen(false)} />
        </Dialog.Panel>
      </Dialog>

      {/* Modal for complete */}
      <ConfirmCompletionModal
        isConfirmModalOpen={isConfirmModalOpen}
        cancelCompletion={cancelCompletion}
        confirmCompletion={confirmCompletion}
      />

      {/* Modal for Delete */}
      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        cancelDeletion={cancelDeletion}
        confirmDeletion={confirmDeletion}
      />

      {/* Modal for Edit */}
      <EditModal
        isModalOpen={isModalOpen}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        titleCharCount={titleCharCount}
        setTitleCharCount={setTitleCharCount}
        descCharCount={descCharCount}
        setDescCharCount={setDescCharCount}
        isDateFocused={isDateFocused}
        setIsDateFocused={setIsDateFocused}
        isSubmitting={isSubmitting}
        handleCancel={handleCancel}
      />
    </div>
  );
}