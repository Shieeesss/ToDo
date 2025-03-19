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
    .optional() // Makes it optional
    .default(""), // Defaults to an empty string if not provided
  deadline: z.string().min(1, "Deadline is required"), // Make deadline required
});

export function useCreateTodo(onSuccess: () => void) {
  const queryClient = useQueryClient();
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);
  const [isSubmittingState, setIsSubmitting] = useState(false);

  // Initialize react-hook-form with Zod schema validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isSubmittingForm },
    reset,
  } = useForm({
    resolver: zodResolver(todoSchema),
  });

  // Define the mutation for creating a new to-do item
  const mutation = useMutation({
    mutationFn: createTodo,
    onMutate: () => setIsSubmitting(true), // Set submitting state to true when mutation starts
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Invalidate todos query to refresh the list
      reset(); // Reset the form fields
      onSuccess(); // Call the onSuccess callback after the task is successfully added
    },
    onSettled: () => setIsSubmitting(false), // Set submitting state to false when mutation is settled
  });

  // Handle form submission
  const onSubmit = async (data: { title: string; description?: string; deadline: string }) => {
    try {
      mutation.mutate({ title: data.title, description: data.description || "", deadline: data.deadline, date: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  return {
    register, // Register form fields
    handleSubmit, // Handle form submission
    errors, // Form validation errors
    isSubmitting: isSubmittingState || isSubmittingForm, // Submitting state
    titleCharCount, // Character count for title
    setTitleCharCount, // Set character count for title
    descCharCount, // Character count for description
    setDescCharCount, // Set character count for description
    onSubmit, // Form submission handler
  };
}