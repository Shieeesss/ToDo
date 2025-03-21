"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { fetchUserData, logout } from "../../lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToDoList from "../../components/ToDolist"; 
import ToDoForm from "../../components/ToDoForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import SearchBar from "../../components/SearchBar"; 
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

// Create a QueryClient instance
const queryClient = new QueryClient();

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [tempSearchQuery, setTempSearchQuery] = useState(""); 

  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data); 
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
    router.push("/login"); 
  };

  const confirmLogout = () => {
    handleLogout();
    closeLogoutModal();
  };

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchQuery(e.target.value);
  };

  
  const handleSearch = () => {
    setSearchQuery(tempSearchQuery); 
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
          
          {/* Logo */}
          <img className="w-16 h-auto sm:w-20" src="/logo.png" alt="Logo" />

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar */}
            <SearchBar
              searchQuery={tempSearchQuery}
              handleSearchChange={handleSearchChange}
              handleSearch={handleSearch}
            />

            {/* User Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="inline-flex items-center rounded-md px-2 py-1 sm:px-3 sm:py-2 text-sm font-semibold text-white shadow-xs">
                <span className="text-white mr-1 sm:mr-2">{userData?.first_name} {userData?.last_name}</span>
                <ChevronDownIcon aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-200" />
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-32 sm:w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <a href="#" className={`block px-3 py-1 sm:px-4 sm:py-2 text-sm ${active ? "bg-gray-100" : "text-gray-700"}`}>
                      {userData?.email}
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button 
                      onClick={openLogoutModal} 
                      className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-sm ${active ? "bg-gray-200" : "text-gray-700"}`}>
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full md:w-11/12 lg:w-10/12 xl:w-9/12 mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Floating "+" button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-[#4F959D] hover:bg-[#205781] text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-50"
        >
          <PlusIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <div className="mt-10">
          <ToDoList searchQuery={searchQuery} /> 
        </div>
      </div>

      {/* Modal for adding a new task */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-400 bg-opacity-80 backdrop-blur-sm"
      >
        <Dialog.Panel className="relative bg-white rounded-lg p-6 shadow-lg mx-4 sm:mx-0 max-w-lg w-full">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-center text-[#4D869C]">Add New Task</h2>
          <ToDoForm closeForm={() => setIsModalOpen(false)} />
        </Dialog.Panel>
      </Dialog>

      {/* Modal for logout confirmation */}
      <Dialog open={isLogoutModalOpen} onClose={closeLogoutModal} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-400 bg-opacity-80 backdrop-blur-md">
        <Dialog.Panel className="relative bg-white  rounded-lg p-6 shadow-lg mx-4 sm:mx-0 max-w-lg w-full">
          <h2 className="text-xl font-bold text-center mb-4">Are you sure you want to log out?</h2>
          <div className="flex justify-center space-x-4">
            <button onClick={closeLogoutModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={confirmLogout} className="px-4 py-2 bg-red-500 text-white rounded-md">
              Log Out
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </QueryClientProvider>
  );
};

export default Dashboard;