"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Create a Zod schema for form validation
const schema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  // Setup react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: FormData) => login(data.email, data.password),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="bg-gray-500 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <img className="w-24 h-auto" src="/logo.png" alt="Logo" />
        </div>
        <h1 className="text-xl font-bold text-[#4D869C] text-center">Sign in</h1>
        
        {error && <p className="text-red-500 text-center">{(error as Error).message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#4D869C]">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="name@company.com"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#4D869C]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2 border border-[#7AB2B2] rounded-lg bg-[#EEF7FF] text-gray-900 focus:ring-[#4D869C] focus:border-[#4D869C] ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
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
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4D869C] hover:bg-[#7AB2B2]  text-white py-2 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Sign In"}
          </button>

          <p className="text-sm text-gray-700 text-center">
            Don’t have an account yet?{" "}
            <a href="/register" className="font-medium text-[#4D869C] hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
