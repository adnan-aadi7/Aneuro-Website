import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import axiosInstance from "../../store/axiosInstance"; // ensure path is correct

const Sidebar = ({ sidebarOpen, onSidebarClose, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: MdOutlineDashboard, label: "Dashboard", to: "/client/dashboard" },
    { icon: TbFileSearch, label: "Results Overview", to: "/results-overview" },
    // { icon: TbChartBar, label: "Analytics Overview", to: "/analytics-overview" },
    { icon: TbMail, label: "Email Sequences", to: "/email-sequences" },
    { icon: TbStars, label: "Prompt Packs", to: "/prompt-packs" },
    { icon: TbClock, label: "Funnel Templates", to: "/funnel-templates" },
    {
      icon: TbCurrencyDollar,
      label: "Manage Subscription",
      to: "/client/manage-subscription/subscriptions",
    },
    { icon: TbHeadset, label: "Support Center", to: "/support-center" },
    { icon: TbMessage2, label: "Leave Feedback", to: "/leave-feedback" },
  ];

  const bottomItems = [
    { icon: CiSettings, label: "Setting", to: "/client-settings" },
    { icon: FiLogOut, label: "Logout" }, // special-cased to be a button
  ];

  const handleLogout = async () => {
    try {
      // (optional) tell backend if you have an API for logout
      // await axiosInstance.post("/logout");

      // 1) Clear storages
      localStorage.clear();
      sessionStorage.clear();

      // 2) Drop Authorization header from axios instance (belt & suspenders)
      if (axiosInstance?.defaults?.headers?.common?.Authorization) {
        delete axiosInstance.defaults.headers.common.Authorization;
      }

      // 3) (optional) clear auth cookies if you set any (e.g., "token")
      // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      // 4) Let app-level context know (if provided)
      if (typeof onLogout === "function") onLogout();

      // 5) Close sidebar on mobile, then navigate
      if (typeof onSidebarClose === "function") onSidebarClose();
      navigate("/login", { replace: true });

      // 6) (optional) hard refresh to flush any in-memory state
      // window.location.reload();
    } catch (e) {
      console.error("Logout error:", e);
      // still navigate away even if an optional API call failed
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onSidebarClose}
      />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col z-50 shadow-md transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shadow-none overflow-y-auto lg:overflow-visible`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onSidebarClose}
          className="absolute top-4 right-4 z-[100] size-10 lg:hidden flex items-center justify-center text-white bg-gray-800 rounded-lg border-r border-[#FFFFFF14]"
        >
          <img src="/logo.png" alt="logo" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-[162px] h-[162px]" />
        </div>

        {/* Navigation */}
        <div
          style={{
            overflowY: "auto",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
          className="custom-scroll"
        >
          <nav className="flex flex-col gap-4 flex-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 font-medium text-[15px] transition-all border-l-7 ${
                      isActive
                        ? "bg-teal-500/20 text-teal-400 border-teal-400 shadow"
                        : "text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-800/50"
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
          <div className="py-4 px-4 mt-6">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              if (item.label === "Logout") {
                // Render as a button to run logout logic
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 font-medium text-[15px] transition-all text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  >
                    <Icon size={22} />
                    {item.label}
                  </button>
                );
              }
              // Regular nav items
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 font-medium text-[15px] transition-all border-l-7 ${
                      isActive
                        ? "bg-teal-500/20 text-teal-400 border-teal-400 shadow"
                        : "text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-800/50"
                    }`
                  }
                >
                  <Icon size={22} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Vertical separator for large screens */}
      <div className="hidden lg:block fixed top-0 left-64 h-screen w-[2px] bg-[#232432] z-50" />
    </>
  );
};

export default Sidebar;
