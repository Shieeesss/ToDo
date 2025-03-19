"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side routing
import { fetchUserData, logout } from "../../lib/auth"; // Path to your auth lib
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToDoList from "../../components/ToDolist";
import ToDoForm from "../../components/ToDoForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Menu, MenuButton, MenuItem, MenuItems, Dialog } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";

// Create a QueryClient instance
const queryClient = new QueryClient();

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null); // Add userData state

  const router = useRouter(); // To handle redirection

  // Fetch user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data); // Set user data
      } catch (error) {
        setError("Failed to fetch user data.");
      }
    };
    getUserData();
  }, []);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirect to login page after logout
  };

  const confirmLogout = () => {
    handleLogout();
    closeLogoutModal();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!userData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Navbar */}
      <nav className="bg-[#3B6B82] fixed w-full z-20 top-0 start-0 border-b border-gray-300 shadow-md">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
           <img className="w-20 h-auto" src="/logo.png" alt="Logo" />

          {/* User Menu */}
          <Menu as="div" className="relative inline-block text-left">
            <div className="flex items-center">
              
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs">
              <span className="text-white mr-2">{userData?.first_name}</span>
                <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-200" />
              </MenuButton>
            </div>
            <MenuItems
              transition

              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <div className="py-1">
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {userData?.email}
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <button onClick={openLogoutModal} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                    Logout
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Floating "+" button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-[#4F959D] hover:bg-[#205781] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-50"
        >
          <PlusIcon className="w-8 h-8" />
        </button>

        <div className="mt-10">
          <ToDoList />
        </div>
      </div>

      {/* Modal for adding a new task */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-50 backdrop-blur-md"
      >
        <Dialog.Panel className="relative bg-white rounded-lg p-6 shadow-lg mx-4 sm:mx-0 max-w-lg w-full">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-[#4D869C]">Add New Task</h2>
          <ToDoForm closeForm={() => setIsModalOpen(false)} />
        </Dialog.Panel>
      </Dialog>

      {/* Modal for logout confirmation */}
      <Dialog open={isLogoutModalOpen} onClose={closeLogoutModal} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-30 backdrop-blur-md">
        <Dialog.Panel className="relative bg-white rounded-lg p-6 shadow-lg mx-4 sm:mx-0 max-w-lg w-full">
          <button onClick={closeLogoutModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
          <div className="flex justify-center space-x-4">
            <button onClick={closeLogoutModal} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={confirmLogout} className="px-4 py-2 bg-[#4F959D] text-white rounded-md">
              Log Out
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </QueryClientProvider>
  );
};

export default Dashboard;