import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface FilterSortControlsProps {
  filter: 'all' | 'completed' | 'pending' | 'overdue';
  sortBy: string;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  selectedDate: Date | null;
  handleDateChange: (value: Date | Date[] | null, event: React.MouseEvent<HTMLButtonElement>) => void;
  setSelectedDate: (date: Date | null) => void;
  handleClearDate: () => void;
  handleTodayDate: () => void;
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  filter,
  handleFilterChange,
  sortBy,
  handleSortChange,
  showCalendar,
  setShowCalendar,
  selectedDate,
  handleDateChange,
  setSelectedDate,
  handleClearDate,
  handleTodayDate,
  searchQuery,
  handleSearchChange,
  handleSearch,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2 sticky top-0  z-10 p-2 ">
      <div className="flex items-center space-x-2">
        {/* Calendar Button */}
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-2 py-1 bg-[#4D869C] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CDE8E5]"
        >
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>

        {/* Calendar Popup */}
        {showCalendar && (
          <div className="absolute top-full mt-2 z-50 bg-white p-4 rounded-lg shadow-lg w-72 sm:w-80">
            <div className="flex justify-between mb-1">
              <button
                onClick={handleClearDate}
                className="px-2 py-1 text-sm hover:text-blue-500 hover:underline"
              >
                Clear Selection
              </button>
              <button
                onClick={handleTodayDate}
                className="px-2 py-1 text-sm hover:text-blue-500 hover:underline"
              >
                Today
              </button>
            </div>
            <Calendar
              onChange={(value, event) => handleDateChange(value as Date | Date[] | null, event as React.MouseEvent<HTMLButtonElement>)}
              value={selectedDate}
              className="border border-gray-300 rounded-lg shadow-lg w-full"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 relative">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-2 py-1 bg-[#4D869C] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CDE8E5] md:hidden ${showFilters ? 'hidden' : 'block'}`}
        >
          Show Filters
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-2 py-1 bg-[#4D869C] text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CDE8E5] md:hidden ${showFilters ? 'block' : 'hidden'}`}
        >
          Hide Filters
        </button>

        {/* Filter Dropdowns */}
        <div className={`absolute top-full mt-2 z-50 bg-white p-4 rounded-lg shadow-lg w-48 md:w-auto max-w-xs overflow-auto max-h-[200px] right-0 ${showFilters ? 'block' : 'hidden'} md:flex md:relative md:top-0 md:mt-0 md:bg-transparent md:p-0 md:shadow-none md:w-auto space-y-2 md:space-y-0 md:space-x-2`}>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4D869C] focus:border-[#4D869C] w-full md:w-auto"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4D869C] focus:border-[#4D869C] w-full md:w-auto mt-2 md:mt-0"
          >
            <option value="created_at">Created At</option>
            <option value="updated_at">Updated At</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSortControls;