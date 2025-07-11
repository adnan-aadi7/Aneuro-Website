import React, { useState } from "react";

export default function GetCode({ open, onClose, onGetCode }) {
  const [name, setName] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="relative bg-[#232432] shadow-lg w-[450px] max-w-lg p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Blue Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-cyan-400 rounded-full p-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#06B6D4" />
              <path
                d="M16 10a4 4 0 0 1 4 4v2h-8v-2a4 4 0 0 1 4-4zm-6 6v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="17" r="2" fill="#fff" />
            </svg>
          </div>
        </div>
        {/* Title */}
        <div className="text-white text-2xl font-bold mb-2 text-center">
          Reset Your Password
        </div>
        {/* Subtitle */}
        <div className="text-white text-sm text-center opacity-80 mb-4">
          Forgot you password?
        </div>
        {/* Input */}
        <input
          type="text"
          className="w-full mb-6 px-4 py-2  bg-[#232432] border border-slate-600 text-white focus:outline-none focus:border-cyan-400 placeholder-slate-400"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* Button */}
        <button
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold  hover:bg-cyan-300 transition-colors"
          onClick={() => onGetCode(name)}
        >
          Get 4 digit code
        </button>
      </div>
    </div>
  );
}
