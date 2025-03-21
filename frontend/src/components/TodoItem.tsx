import React from 'react';

interface TodoItemProps {
  todo: {
    id: number;
    title: string;
    description: string;
    is_completed: boolean;
    deadline: string;
    created_at: string;
    updated_at: string;
  };
  handleCheckboxClick: (todo: any) => void;
  handleEditClick: (todo: any) => void;
  handleDeleteClick: (todo: any) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
  searchQuery: string;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, handleCheckboxClick, handleEditClick, handleDeleteClick, highlightText, searchQuery }) => {
  const deleteMutation = { isPending: false }; 
  const isOverdue = !todo.is_completed && new Date(todo.deadline) < new Date();

  return (
    <div
      key={todo.id}
      className={`relative break-inside-avoid w-full p-4 rounded-lg shadow-lg border-2 border-black-300 bg-white flex flex-col 
                  ${todo.is_completed ? "bg-green-100 border-green-500" : isOverdue ? "bg-orange-100 border-red-500" : "bg-[#e6ecff] border-[#668cff]"}
                `}
    >
      {/* Top Section: Status & Actions */}
      <div className="flex relative items-center justify-between w-full absolute left-2 right-2">
        <span className={`text-[10px] font-semibold px-3 py-1 rounded-full 
                    ${todo.is_completed ? "bg-green-200 text-green-600" : isOverdue ? "bg-red-200 text-red-500" : "bg-[#668cff] text-white"}`}>
          {todo.is_completed ? "Completed" : isOverdue ? "Overdue" : "Pending"}
        </span>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={todo.is_completed}
            onChange={() => handleCheckboxClick(todo)}
            className="w-4 h-4 text-blue-600 bg-white-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-white-800 focus:ring-2 dark:bg-white-700 dark:border-white-600"
          />

          {/* Dropdown */}
          <div className="relative group">
            <button className="p-2 text-gray-700 hover:text-black">
              <svg className="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
              </svg>
            </button>

            <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-300 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={() => handleEditClick(todo)}
                className="flex items-center w-full px-3 py-2 text-sm text-blue-500 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(todo)}
                className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Title & Description */}
      <div className="flex flex-col p-3 flex-grow">
        {/* Task Title */}
        <span className={`font-bold text-lg font-serif w-full break-words ${todo.is_completed ? "text-gray-500" : "text-black"}`}>
          {highlightText(todo.title, searchQuery)}
        </span>

        <p className="text-[9px] text-gray-600">
          <span className="font-bold text-black text-[9px] uppercase tracking-wide">Deadline:</span>
          <span className="ml-1 text-gray-700 italic">{new Date(todo.deadline).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>

        <hr className={todo.is_completed ? "border-b-1 border-gray-300" : "border-b-1 border-black"} />

        {/* Task Description - Full Text & Expands */}
        <span
          className={`text-xs italic font-mono mt-2 w-full leading-relaxed border-l-4 pl-2 bg-gray-50 break-words border-b-2 border-black ${todo.is_completed ? "border-green-500" : isOverdue ? "border-red-500" : "border-blue-500"
            }`}
        >
          {highlightText(todo.description || "No description available", searchQuery)}
        </span>
      </div>

      {/* Bottom Section: Dates (Fixed at the Bottom) */}
      <div className="text-gray-500 text-[7px] sm:text-[8px] flex justify-between border-t border-gray-300 pt-2 p-2 mt-auto italic tracking-wide font-serif">
        <p>
          <span className="text-black uppercase text-[7px] sm:text-[8px] tracking-wide">Created:</span>
          <span className="ml-1 text-gray-700">{new Date(todo.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
        <p>
          <span className="text-black uppercase text-[7px] sm:text-[8px] tracking-wide">Updated:</span>
          <span className="ml-1 text-gray-700">{new Date(todo.updated_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
      </div>
    </div>
  );
};

export default TodoItem;