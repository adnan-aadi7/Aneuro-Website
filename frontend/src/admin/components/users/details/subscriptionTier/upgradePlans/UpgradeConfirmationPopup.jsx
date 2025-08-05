import React from "react";

export default function UpgradeConfirmationPopup({ open, onClose, plan }) {
  if (!open) return null;

  const handleClose = () => {
    onClose();
    // Optionally refresh the page to show updated subscription data
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-[#232432] shadow-lg w-[450px] max-w-lg p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={handleClose}
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
          Successfully Upgraded!
        </div>
        {/* Subtitle */}
        <div className="text-white text-sm text-center opacity-80 mb-6">
          User plan has been successfully changed to <strong>{plan}</strong>.
        </div>
        {/* Close Button */}
        <button
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold hover:bg-cyan-300 transition-colors"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
