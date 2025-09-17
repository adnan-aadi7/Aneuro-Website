import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import {
  TbFileSearch,
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
import axiosInstance from "../../store/axiosInstance"; 

const Sidebar = ({ sidebarOpen, onSidebarClose, onLogout }) => {
  const navigate = useNavigate();
  const [on, setOn] = useState(false);

  // Load initial toggle state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("actAsClient");
    setOn(saved === "1");
  }, []);

  const menuItems = [
    { icon: MdOutlineDashboard, label: "Dashboard", to: "/client/dashboard" },
    { icon: TbFileSearch, label: "Results Overview", to: "/results-overview" },
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
    { icon: FiLogOut, label: "Logout" },
  ];

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      if (axiosInstance?.defaults?.headers?.common?.Authorization) {
        delete axiosInstance.defaults.headers.common.Authorization;
      }

      document.cookie =
        "token=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      if (typeof onLogout === "function") onLogout();
      if (typeof onSidebarClose === "function") onSidebarClose();

      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout error:", e);
      navigate("/login", { replace: true });
    }
  };

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
        className={`fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col z-50 shadow-md transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:shadow-none overflow-y-auto lg:overflow-visible`}
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
            scrollbarWidth: "none",
            msOverflowStyle: "none",
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

            {/* Client View Toggle */}
            <button
              type="button"
              className="flex items-center gap-3 px-6 py-3 font-medium text-[17px] text-gray-400 focus:outline-none cursor-pointer"
              onClick={() => {
                const next = !on;
                setOn(next);
                localStorage.setItem("actAsClient", next ? "1" : "0");
                if (next) {
                  navigate("/client/dashboard");
                } else {
                  navigate("/admin/dashboard");
                }
              }}
              aria-pressed={on}
            >
              <span
                className={`w-9 h-5 flex items-center rounded-full transition-colors duration-200 ${
                  on ? "bg-[#12DCF0]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-black transition-all duration-200 ${
                    on ? "ml-4" : "ml-1"
                  }`}
                />
              </span>
              Client View
            </button>
          </nav>

          {/* Bottom Menu */}
          <div className="py-4 px-4 mt-6">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              if (item.label === "Logout") {
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

      {/* Vertical separator */}
      <div className="hidden lg:block fixed top-0 left-64 h-screen w-[2px] bg-[#232432] z-50" />
    </>
  );
};

export default Sidebar;
