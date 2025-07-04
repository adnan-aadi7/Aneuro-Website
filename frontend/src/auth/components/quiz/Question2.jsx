import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const options = [
  "Report the incident to your supervisor",
  "Try to resolve the issue yourself",
  "Ignore the situation and continue working",
  "Discuss with your team before taking action",
];

const Question2 = ({ onSubmit, onBack, onClose }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dark background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"></div>
      {/* Modal content */}
      <div className="relative z-10 bg-black rounded-xl p-8 shadow-xl w-full max-w-xl mx-4">
        {/* Top bar with arrows and close */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="text-white hover:text-cyan-400 transition"
            onClick={onBack}
          >
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-wide text-center flex-1">
            QUESTION 2
          </h2>
          <button
            className="text-white hover:text-cyan-400 transition"
            onClick={onClose}
          >
            <X size={28} />
          </button>
        </div>
        {/* Question text */}
        <p className="text-white text-base mb-8 text-center">
          You notice a potential security breach in your department. What is
          your immediate response?
        </p>
        {/* Options */}
        <div className="flex flex-col gap-4 mb-8">
          {options.map((opt, idx) => (
            <button
              key={opt}
              onClick={() => setSelected(idx)}
              className={`w-full text-left px-6 py-4 rounded-none border transition font-medium text-base
                ${
                  selected === idx
                    ? "bg-cyan-400 text-black border-cyan-400"
                    : "bg-transparent text-white border border-white hover:bg-cyan-900/20"
                }
              `}
              style={{ borderRadius: 0 }}
            >
              {opt}
            </button>
          ))}
        </div>
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            className="bg-cyan-400 text-black font-semibold px-8 py-3 rounded-md text-lg hover:bg-cyan-300 transition-all"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question2;
