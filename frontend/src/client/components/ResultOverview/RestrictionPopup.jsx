import React from "react";

export default function RestrictionPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm">
      <div className="relative bg-[#29293A]  shadow-2xl px-12 py-12 w-[420px] flex flex-col items-center">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Icon Circle */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-cyan-400 mb-6">
          {/* Star Icon SVG */}
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="#29293A"
            />
          </svg>
        </div>
        {/* Title & Lock */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white text-2xl font-semibold text-center">
            Growth & Enterprise Only
          </span>
          {/* Lock Icon */}
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path
              d="M17 11V7a5 5 0 10-10 0v4"
              stroke="#FFC94D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="5"
              y="11"
              width="14"
              height="9"
              rx="2"
              fill="none"
              stroke="#FFC94D"
              strokeWidth="2"
            />
          </svg>
        </div>
        {/* Subtitle */}
        <div className="text-gray-300 text-lg text-center mb-2">
          Upgrade To Access User-Level Insights
        </div>
      </div>
    </div>
  );
}
