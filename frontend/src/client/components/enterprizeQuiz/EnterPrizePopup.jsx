import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EnterPrizePopup() {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/client/dashboard");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative bg-[#18192A] rounded-lg shadow-lg px-8 py-10 flex flex-col items-center min-w-[340px] max-w-[90vw]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#12DCF0] mb-6 mt-2">
          {/* Star icon (can use lucide-react or SVG) */}
          <svg
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-[#18192A]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 17.25l-6.172 3.245 1.179-6.873L2.5 8.755l6.9-1.002L12 1.5l2.6 6.253 6.9 1.002-4.507 4.867 1.179 6.873z"
            />
          </svg>
        </div>
        {/* Main Text */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-white font-semibold text-lg sm:text-xl">
              Enterprise Only
            </span>
            <span
              role="img"
              aria-label="lock"
              className="text-yellow-400 text-xl"
            >
              🔒
            </span>
          </div>
          <div className="text-gray-300 text-sm sm:text-base">
            Upgrade To Access User-Level Insights
          </div>
        </div>
      </div>
    </div>
  );
}
