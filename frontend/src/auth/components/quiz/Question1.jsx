import React, { useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const options = [
  "None of my business, let some body else take care of it",
  "Ask the person to leave the facility",
  "Escort the person to the security and raise a security incident",
  "Raise a security incident and go back doing your work",
];

const Question1 = ({ onNext }) => {
  const [selected, setSelected] = useState(1); // 1 is the second option (as selected in screenshot)

  const handleSelect = (idx) => {
    setSelected(idx);
    if (onNext) {
      setTimeout(() => onNext(), 150); // slight delay for click effect
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dark background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"></div>
      {/* Modal content */}
      <div className="relative z-10 bg-black rounded-xl p-8 shadow-xl w-full max-w-xl mx-4">
        {/* Top bar with arrows and close */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-white hover:text-cyan-400 transition">
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-wide text-center flex-1">
            QUESTION 1
          </h2>
          <button className="text-white hover:text-cyan-400 transition">
            <X size={28} />
          </button>
        </div>
        {/* Question text */}
        <p className="text-white text-base mb-8 text-center">
          You see a non-familiar face in the access-controlled areas of our
          office, the person does not have the MGL ID/Visitor/Staff/Vendor tag
          with him. <br />
          What would you do?
        </p>
        {/* Options */}
        <div className="flex flex-col gap-4">
          {options.map((opt, idx) => (
            <button
              key={opt}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-6 py-4 rounded-none border transition font-medium text-base
                hover:bg-cyan-400 hover:text-black hover:border-cyan-400
                bg-transparent text-white border border-[#12DCF0]
              `}
              style={{ borderRadius: 0 }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question1;
