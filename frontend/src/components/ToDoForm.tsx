"use client";

import { useCreateTodo } from "../logics/useCreateTodo";

export default function ToDoForm({ closeForm }: { closeForm: () => void }) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    titleCharCount,
    setTitleCharCount,
    descCharCount,
    setDescCharCount,
    onSubmit,
  } = useCreateTodo();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      
      {/* Title Input with Character Counter */}
      <input
        {...register("title")}
        placeholder="New task title"
        className="border p-2"
        onChange={(e) => setTitleCharCount(e.target.value.length)}
        maxLength={50}
      />
      {errors.title && <span className="text-red-500">{errors.title.message}</span>}
      <div className="text-gray-500 text-xs text-right">{titleCharCount}/50</div>

      {/* Description Input with Character Counter */}
      <textarea
        {...register("description")}
        placeholder="Task description (optional)"
        className="border p-2"
        onChange={(e) => setDescCharCount(e.target.value.length)}
        maxLength={300}
      />
      {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      <div className="text-gray-500 text-xs text-right">{descCharCount}/300</div>

      {/* Deadline Input */}
      <input
        type="date"
        {...register("deadline")}
        placeholder="Deadline"
        className="border p-2"
      />
      {errors.deadline && <span className="text-red-500">{errors.deadline.message}</span>}

      {/* Submit Button */}
      <button 
        type="submit" 
        className="bg-[#205781] hover:bg-[#4F959D] text-white p-2 "
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Task..." : "Add Task"}
      </button>

    </form>
  );
}
