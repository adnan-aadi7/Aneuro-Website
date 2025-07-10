import React from "react";
import { ArrowLeft, Bell, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ onHamburgerClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/client/dashboard";
  return (
    <header className="bg-[#16161C] text-white px-6 py-5 flex items-center justify-between">
      {/* Left side - Hamburger (mobile) and Back button */}
      <div className="flex items-center">
        {/* Hamburger menu for mobile */}
        <button
          className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          onClick={onHamburgerClick}
          aria-label="Open sidebar menu"
        >
          <svg
            className="w-5 h-5 lg:w-6 lg:h-6"
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
          <button
            className="flex items-center gap-2 text-gray-300  transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-3">
        {/* Profile Icon */}
        <button className="p-3 rounded-lg hover:bg-gray-700  transition-colors border border-gray-400 cursor-pointer">
          <User className="text-gray-300 w-3 h-3 lg:w-5 lg:h-5" />
        </button>

        {/* Notification Bell with badge */}
        <button className="p-3 rounded-lg  = transition-colors relative border border-gray-400 hover:bg-gray-700 cursor-pointer">
          <Bell className="text-gray-300 w-3 h-3 lg:w-5 lg:h-5" />
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
