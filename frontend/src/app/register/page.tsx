"use client";

import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the Zod schema for validation
const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric"),
    password_confirmation: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  // Initialize react-hook-form with Zod validation
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: FormData) =>
      register(data.first_name, data.last_name, data.email, data.password, data.password_confirmation),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  // Setup react-hook-form
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle form submission
  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <section className="bg-gray-500 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <img className="w-24 h-auto" src="/logo.png" alt="Logo" />
        </div>
        <h1 className="text-xl font-bold text-[#4D869C] text-center">Register Page</h1>
        {error && <p className="text-red-500 text-center">{(error as Error).message}</p>}
  
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* First Name Input */}
          <div>
            <label className="block text-sm font-medium text-[#4D869C]">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${errors.first_name ? "border-red-500" : ""}`}
              {...formRegister("first_name")}
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
          </div>

          {/* Last Name Input */}
          <div>
            <label className="block text-sm font-medium text-[#4D869C]">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${errors.last_name ? "border-red-500" : ""}`}
              {...formRegister("last_name")}
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
          </div>
  
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#4D869C]">Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${errors.email ? "border-red-500" : ""}`}
              {...formRegister("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
  
          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#4D869C]">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${errors.password ? "border-red-500" : ""}`}
              {...formRegister("password")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-9 transform -translate-y-1/2"
            >
              {showPassword ? (
                <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              )}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#4D869C]">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${errors.password_confirmation ? "border-red-500" : ""}`}
              {...formRegister("password_confirmation")}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-4 top-9 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              )}
            </button>
            {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4D869C] hover:bg-[#7AB2B2] text-white py-2 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Register"}
          </button>
  
          <p className="text-sm text-gray-700 text-center">
            Already have an account? {" "}
            <a href="/login" className="font-medium text-[#4D869C] hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
