import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import {
  TbFileSearch,
  TbChartBar,
  TbMail,
  TbStars,
  TbClock,
  TbCurrencyDollar,
  TbHeadset,
  TbMessage2,
} from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/auth/logo.png";

const Sidebar = ({ sidebarOpen, onSidebarClose }) => {
  const menuItems = [
    { icon: MdOutlineDashboard, label: "Dashboard", to: "/client/dashboard" },
    { icon: TbFileSearch, label: "Results Overview", to: "/results-overview" },
    {
      icon: TbChartBar,
      label: "Analytics Overview",
      to: "/analytics-overview",
    },
    { icon: TbMail, label: "Email Sequences", to: "/email-sequences" },
    { icon: TbStars, label: "Prompt Packs", to: "/prompt-packs" },
    { icon: TbClock, label: "Funnel Templates", to: "/funnel-templates" },
    {
      icon: TbCurrencyDollar,
      label: "Manage Subscription",
      to: "/manage-subscription",
    },
    { icon: TbHeadset, label: "Support Center", to: "/support-center" },
    { icon: TbMessage2, label: "Leave Feedback", to: "/leave-feedback" },
  ];

  const bottomItems = [
    { icon: CiSettings, label: "Setting", to: "/settings" },
    { icon: FiLogOut, label: "Logout", to: "/logout" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onSidebarClose}
      />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#16161C] text-white flex flex-col  z-50 shadow-md transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:shadow-none`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onSidebarClose}
          className="absolute top-4 right-4 z-[100] size-10 lg:hidden flex items-center justify-center text-white bg-gray-800 rounded-lg"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 6L6 18M6 6l12 12"
            />
          </svg>
        </button>
        {/* Logo */}
        <div className="  flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-[162px] h-[162px] " />
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 font-medium text-[15px] transition-all border-r-2 ${
                    isActive
                      ? "bg-teal-500/20 text-teal-400 border-teal-400 shadow rounded-full"
                      : "text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-800/50 rounded-2xl"
                  }`
                }
              >
                <Icon size={22} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        {/* Bottom Menu */}
        <div className="border-t border-gray-800 py-4 px-4">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 font-medium text-[15px] transition-all border-r-2 ${
                    isActive
                      ? "bg-teal-500/20 text-teal-400 border-teal-400 shadow rounded-full"
                      : "text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-800/50 rounded-2xl"
                  }`
                }
              >
                <Icon size={22} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
