import React, { useRef } from "react";

export default function EnterCode({
  open,
  onClose,
  onContinue,
  onResend,
  email,
}) {
  const [code, setCode] = React.useState(["", "", "", ""]);
  const inputs = [useRef(), useRef(), useRef(), useRef()];

  if (!open) return null;

  const handleChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 3) {
      inputs[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs[idx - 1].current.focus();
    }
  };

  const handleContinue = () => {
    onContinue(code.join(""));
  };

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
          Enter Confirmation Code
        </div>
        {/* Subtitle */}
        <div className="text-white text-sm text-center opacity-80 mb-4">
          We sent a code to <span className="text-cyan-400">{email}</span>
        </div>
        {/* Code Inputs */}
        <div className="flex gap-4 mb-6">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={inputs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-14 h-14 text-2xl text-center rounded bg-[#232432] border border-slate-600 text-white focus:outline-none focus:border-cyan-400"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>
        {/* Continue Button */}
        <button
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold  hover:bg-cyan-300 transition-colors mb-2"
          onClick={handleContinue}
        >
          Continue
        </button>
        {/* Resend Link */}
        <div className="text-slate-400 text-xs text-center mt-2">
          Didn’t receive the email?{" "}
          <button
            className="text-cyan-400 underline"
            onClick={onResend}
            type="button"
          >
            Click to resend
          </button>
        </div>
      </div>
    </div>
  );
}
