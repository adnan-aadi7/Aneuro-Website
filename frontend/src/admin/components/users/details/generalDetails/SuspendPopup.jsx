import React from "react";

export default function SuspendPopup({ open, onClose, onSuspend }) {
  if (!open) return null;

  const handleSuspend = () => {
    if (onSuspend) {
      onSuspend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="relative bg-[#232432] shadow-lg w-[400px] h-[400px] max-w-md max-h-md p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-600 rounded-full p-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#EF4444" />
              <path
                d="M16 10v6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="22" r="1.5" fill="#fff" />
            </svg>
          </div>
        </div>
        {/* Title */}
        <div className="text-white text-2xl font-bold mb-2 text-center">
          Suspend Account
        </div>
        {/* Subtitle */}
        <div className="text-white text-sm text-center opacity-80 mb-6">
          Are you sure you want to temporarily disable this user's access to the platform?
        </div>
        {/* Action Buttons */}
        <div className="flex w-full gap-4 mt-2">
          <button
            className="flex-1 py-2 bg-white text-[#232432] font-medium hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            onClick={handleSuspend}
          >
            Suspend User
          </button>
        </div>
      </div>
    </div>
  );
}
