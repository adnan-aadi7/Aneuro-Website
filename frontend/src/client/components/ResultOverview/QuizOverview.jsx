import React from "react";

const QuizOverview = () => {
  return (
    <div className="w-full p-2 md:p-0">
      <div className="text-white text-lg md:text-2xl font-medium mb-4 md:mb-6">
        Quiz Engagement Overview
      </div>
      <button className="flex items-center gap-2 bg-[#12DCF0] hover:bg-cyan-300 text-[#232432] font-semibold px-4 py-2 text-base focus:outline-none">
        {/* Calendar Icon */}
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <rect
            x="3"
            y="6"
            width="14"
            height="11"
            rx="2"
            fill="#12DCF0"
            stroke="#232432"
            strokeWidth="1.2"
          />
          <rect x="7" y="2" width="1.5" height="4" rx="0.75" fill="#232432" />
          <rect
            x="11.5"
            y="2"
            width="1.5"
            height="4"
            rx="0.75"
            fill="#232432"
          />
        </svg>
        <span>04/09/2025</span>
        {/* Dropdown Arrow */}
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path
            d="M4 6l4 4 4-4"
            stroke="#232432"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuizOverview;
