"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie";
import animationData from "../../public/task.json"; // Adjust the path as needed

const LandingPage: React.FC = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/login");
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-[#3B6B82] fixed w-full z-20 top-0 start-0 border-b border-gray-300 shadow-md">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <img className="w-20 h-auto" src="/logo.png" alt="Logo" />

          <button
                onClick={navigateToLogin}
                className="px-4 py-2 bg-[#4F959D] hover:bg-[#205781] text-white rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
              >
                Log In
           </button>

        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mt-10 text-center">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-8 lg:py-12 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold  text-[#4D869C] tracking-tight leading-none md:text-5xl dark: text-[#4D869C]">Stay on Track, Skip the Slack!</h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-6 md:text-lg lg:text-lg dark:text-gray-400">TODO'Dont is built to help you stay productive by keeping your priorities clear and distractions away. Get more done in less time!</p>



              <button
                onClick={navigateToRegister}
                className="px-6 py-3 bg-[#205781] hover:bg-[#4F959D] text-white rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
              >
                Register
              </button>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <Lottie options={defaultOptions} height={300} width={300} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;