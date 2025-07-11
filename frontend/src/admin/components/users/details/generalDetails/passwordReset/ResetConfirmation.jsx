import React from "react";

export default function ResetConfirmation({ open, onClose, onContinue }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-[#232432] shadow-lg w-[450px] max-w-lg p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Blue Check Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-cyan-400 rounded-full p-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#06B6D4" />
              <path
                d="M10 17l4 4 8-8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {/* Title */}
        <div className="text-white text-2xl font-bold mb-2 text-center">
          Password Reset!
        </div>
        {/* Subtitle */}
        <div className="text-white text-sm text-center opacity-80 mb-6">
          Your Password Has Been Successfully Reset.
          <br />
          Click Below To Continue Process
        </div>
        {/* Continue Button */}
        <button
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold rounded-md hover:bg-cyan-300 transition-colors"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
