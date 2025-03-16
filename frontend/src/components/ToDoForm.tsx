"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../lib/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for validation
const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is too long! Maximum of 50 characters."),
  description: z.string()
    .max(300, "Description cannot exceed 300 characters")
    .optional() // ✅ Makes it optional
    .default(""), // ✅ Defaults to an empty string if not provided
  deadline: z.string().min(1, "Deadline is required"), // Make deadline required
});

export default function ToDoForm({ closeForm }: { closeForm: () => void }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(todoSchema),
  });

  const mutation = useMutation({
    mutationFn: createTodo,
    onMutate: () => setIsSubmitting(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      reset();
      closeForm();
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = (data: { title: string; description?: string; deadline: string }) => {
    mutation.mutate({ title: data.title, description: data.description || "", deadline: data.deadline, date: new Date().toISOString() });
  };

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
