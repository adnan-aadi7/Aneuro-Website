import React from "react";
import { ArrowLeft, Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = ({ onHamburgerClick }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/client/dashboard";
  return (
    <header className="bg-[#16161C] text-white lg:px-6 py-5 flex items-center justify-between">
      {/* Left side - Hamburger (mobile) and Back button */}
      <div className="flex items-center">
        {/* Hamburger menu for mobile */}
        <button
          className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          onClick={onHamburgerClick}
          aria-label="Open sidebar menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {!isDashboard && (
          <>
            {/* Search Bar */}
            <div className="flex items-center  rounded-full px-4 py-2 w-28 sm:w-64 max-w-full">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#B0B0B0"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Type Here To Search..."
                className="hidden sm:block bg-transparent outline-none text-[#B0B0B0] placeholder-[#B0B0B0] w-full text-lg"
              />
              <input
                type="text"
                placeholder="Search"
                className="block sm:hidden bg-transparent outline-none text-[#B0B0B0] placeholder-[#B0B0B0] w-full text-base"
              />
            </div>
          </>
        )}
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-3">
        {/* Profile Icon */}
        <button className="p-2 lg:p-3 hover:bg-gray-700 transition-colors border border-gray-400 cursor-pointer">
          <User className="text-gray-300 w-4 h-4 lg:w-5 lg:h-5" />
        </button>

        {/* Notification Bell with badge */}
        <button className="p-2 lg:p-3 transition-colors relative border border-gray-400 hover:bg-gray-700 cursor-pointer">
          <Bell className="text-gray-300 w-4 h-4 lg:w-5 lg:h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ">
            1
          </span>
        </button>

        {/* Add Admin Button */}
        <button className="px-2 py-2 lg:px-4 lg:py-3 hover:bg-gray-700 text-white text-xs lg:text-sm font-medium border border-gray-400 transition-colors cursor-pointer">
          Add Admin
        </button>
      </div>
    </header>
  );
};

export default Header;
