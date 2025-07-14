import React, { useState } from "react";
import logo from "../../../assets/auth/logo.png";

const CYAN = "#2de0fb";

const question = {
  text: "When You're Faced With A Big Decision, What Helps You Feel Most Confident?",
  options: [
    "Weighing pros and cons logically",
    "Acting on gut instinct",
    "Talking it through with someone",
    "Researching options thoroughly first",
  ],
};

const Quiz = () => {
  const [selected, setSelected] = useState(1);

  return (
    <div className="w-full flex flex-col">
      <div
        className="bg-[#2A2A39] p-8  border border-[#2de0fb33] relative"
        style={{
          boxShadow: `inset 0 0 20px 0 ${CYAN}80`,
        }}
      >
        <img src={logo} alt="Aneuro Logo" className="w-24 h-20 mx-auto" />
        <div className="text-white text-lg font-medium mb-4">
          <span className="mr-2">1.</span>
          {question.text}
        </div>
        <div className="space-y-7 mb-6">
          {question.options.map((opt, idx) => (
            <div
              key={idx}
              className={` border px-4 py-2 cursor-pointer transition-all duration-150 text-white ${
                selected === idx
                  ? "border-[#2de0fb] bg-[#2A2A39]"
                  : "border-[#393945] bg-[#2A2A39] hover:border-[#2de0fb]"
              }`}
              onClick={() => setSelected(idx)}
            >
              <span className="font-semibold mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </div>
          ))}
        </div>
        <div className="flex justify-start gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg font-bold transition-all duration-150 ${
                selected === idx
                  ? "bg-[#2de0fb] text-[#23232b] border-[#2de0fb]"
                  : "bg-transparent text-white border-[#393945] hover:border-[#2de0fb]"
              }`}
              onClick={() => setSelected(idx)}
            >
              {String.fromCharCode(65 + idx)}
            </button>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 flex rounded mb-8 overflow-hidden">
          <div className="h-2 bg-white" style={{ width: "25%" }} />
          <div className="h-2 bg-[#12DCF0] flex-1" />
        </div>
        <div className="flex gap-4">
          <button className="flex-1 border border-[#393945] text-white py-2  font-semibold transition hover:border-[#2de0fb]">
            Back
          </button>
          <button className="flex-1 bg-[#2de0fb] text-[#23232b] py-2 font-semibold transition hover:bg-[#23b6c6]">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
