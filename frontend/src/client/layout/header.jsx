import React from "react";
import { ArrowLeft, Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#16161C] text-white px-6 py-10 flex items-center justify-between">
      {/* Left side - Back button */}
      <div className="flex items-center">
        <button className="flex items-center gap-2 text-gray-300  transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-3">
        {/* Profile Icon */}
        <button className="p-3 rounded-lg hover:bg-gray-700  transition-colors border border-gray-400 cursor-pointer">
          <User size={18} className="text-gray-300" />
        </button>

        {/* Notification Bell with badge */}
        <button className="p-3 rounded-lg  = transition-colors relative border border-gray-400 hover:bg-gray-700 cursor-pointer">
          <Bell size={18} className="text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ">
            1
          </span>
        </button>

        {/* Add Admin Button */}
        <button className="p-3  hover:bg-gray-700 text-white text-sm font-medium rounded-lg border border-gray-400 transition-colors cursor-pointer">
          Add Admin
        </button>
      </div>
    </header>
  );
};

export default Header;
