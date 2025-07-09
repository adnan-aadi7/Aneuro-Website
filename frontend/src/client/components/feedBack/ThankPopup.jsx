import React from "react";

const ThankPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="relative bg-[#29293A]  px-8 py-10 w-[450px] h-[300px] flex flex-col items-center shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Icon Circle */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-400 mb-6">
          {/* Star Icon SVG */}
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill="#232432"
            />
            <path
              d="M12 15.4l3.76 2.27-.99-4.28L17.5 10.5l-4.38-.38L12 6.1l-1.12 4.02-4.38.38 3.23 2.89-.99 4.28z"
              fill="#00B8D9"
            />
          </svg>
        </div>
        {/* Title */}
        <h2 className="text-white text-2xl font-bold text-center mb-2">
          Thank You!
        </h2>
        {/* Subtext */}
        <p className="text-gray-300 text-center text-base font-medium">
          Your Request Has Been Submitted. Our
          <br />
          Team Will Get Back To You Shortly
        </p>
      </div>
    </div>
  );
};

export default ThankPopup;
