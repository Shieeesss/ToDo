"use client";

import { useCreateTodo } from "../logics/useCreateTodo";
import { FaCalendarAlt, FaTasks } from "react-icons/fa";
import { useState } from "react";

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
  } = useCreateTodo(closeForm);

  const [isDateFocused, setIsDateFocused] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      {/* Title Input with Character Counter */}
      <div className="flex flex-col">
        <label htmlFor="title" className="text-gray-700 font-medium mb-1">Task Title</label>
        <div className="relative">
          <input
            id="title"
            {...register("title")}
           
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] placeholder-gray-600"
            onChange={(e) => setTitleCharCount(e.target.value.length)}
            maxLength={50}
          />
          <FaTasks className="absolute right-3 top-3 text-gray-400" />
        </div>
        {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>}
        <div className="text-gray-500 text-xs text-right mt-1">{titleCharCount}/50</div>
      </div>

      {/* Description Input with Character Counter */}
      <div className="flex flex-col">
        <label htmlFor="description" className="text-gray-700 font-medium mb-1">Task Description (optional)</label>
        <textarea
          id="description"
          {...register("description")}
    
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] placeholder-gray-600"
          onChange={(e) => setDescCharCount(e.target.value.length)}
          maxLength={300}
        />
        {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>}
        <div className="text-gray-500 text-xs text-right mt-1">{descCharCount}/300</div>
      </div>

      {/* Deadline Input */}
      <div className="flex flex-col">
        <label htmlFor="deadline" className="text-gray-700 font-medium mb-1">Deadline</label>
        <div className="relative mb-6">
          <input
            id="deadline"
            type="date"
            {...register("deadline")}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] placeholder-gray-600 ${!isDateFocused && !errors.deadline ? "text-gray-400" : "text-gray-900"}`}
            defaultValue=""
            onFocus={() => setIsDateFocused(true)}
            onBlur={(e) => {
              setIsDateFocused(false);
              if (!e.target.value) {
                e.target.value = "";
              }
            }}
          />
          
        </div>
        {errors.deadline && <span className="text-red-500 text-sm mt-1">{errors.deadline.message}</span>}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full bg-[#205781] hover:bg-[#4F959D] text-white py-2 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Task..." : "Add Task"}
      </button>
    </form>
  );
}
