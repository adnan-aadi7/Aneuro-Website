import React from "react";

export default function DeletePopup({
  open,
  onClose,
  onReviewQuiz,
  onDeleteUser,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="relative bg-[#232432] shadow-lg w-[450px] h-[300px] max-w-lg p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Red Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-600 rounded-full p-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#EF4444" />
              <path
                d="M16 10v8"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="22" r="1.5" fill="#fff" />
              <path
                d="M12 14h8"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {/* Title */}
        <div className="text-white text-xl font-bold mb-6 text-center">
          Are You Sure You Want
          <br />
          Delete This User
        </div>
        {/* Action Buttons */}
        <div className="flex w-full gap-4 mt-2">
          <button
            className="flex-1 py-2 bg-white text-[#232432]  font-medium hover:bg-slate-100 transition-colors"
            onClick={onReviewQuiz}
          >
            Review Quiz
          </button>
          <button
            className="flex-1 py-2 bg-red-600 text-white  font-medium hover:bg-red-700 transition-colors"
            onClick={onDeleteUser}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
