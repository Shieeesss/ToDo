import React from 'react';

import { FiSearch } from "react-icons/fi"; // Import search icon
interface SearchBarProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, handleSearchChange, handleSearch }) => {
  return (
    <div className="flex items-center w-full sm:w-auto space-x-2">
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="w-32 sm:w-64 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] transition-all duration-300"
      />
      
      {/* Search Button (Icon on Small Screens, Text on Large Screens) */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-4 sm:py-2 bg-[#4D869C] text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-[#CDE8E5] transition-all duration-300"
      >
        <FiSearch className="w-5 h-5 sm:hidden" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
};

export default SearchBar;