import React, { useState } from "react";

const CYAN = "#2de0fb";

const questions = [
  {
    text: "When You're Faced With A Big Decision, What Helps You Feel Most Confident?",
    options: [
      "Weighing pros and cons logically",
      "Acting on gut instinct",
      "Talking it through with someone",
      "Researching options thoroughly first",
    ],
  },
  {
    text: "How do you prefer to start your day?",
    options: [
      "With a plan and checklist",
      "Spontaneously, see what happens",
      "Talking to someone",
      "Reading or learning something new",
    ],
  },
  {
    text: "What motivates you the most at work?",
    options: [
      "Achieving goals",
      "Solving problems creatively",
      "Collaborating with others",
      "Learning new skills",
    ],
  },
  // Add more questions as needed
];

const Quiz = ({
  logo,
  primaryColor,
  secondaryColor,
  textColor,
  borderColor,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleOptionSelect = (idx) => {
    setSelected(idx);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelected(null);
    } else {
      // Optionally handle quiz completion here
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelected(null);
    }
  };

  const question = questions[currentQuestion];

  console.log("Current Question Index:", currentQuestion);

  return (
    <div className="w-full flex flex-col">
      <div
        className="bg-[#2A2A39] p-8  border border-[#2de0fb33] relative"
        style={{
          boxShadow: `inset 0 0 20px 0 ${CYAN}80`,
        }}
      >
        <img src={logo} alt="Aneuro Logo" className="w-24 h-20 mx-auto" />
        <div className="text-lg font-medium mb-4" style={{ color: textColor }}>
          <span className="mr-2">{currentQuestion + 1}.</span>
          {question.text}
        </div>
        <div className="space-y-7 mb-6">
          {question.options.map((opt, idx) => (
            <div
              key={idx}
              className={`border px-4 py-2 cursor-pointer transition-all duration-150 bg-[#2A2A39]`}
              style={{
                color: textColor,
                borderColor: borderColor,
                borderWidth: 1,
                borderStyle: "solid",
              }}
              onClick={() => handleOptionSelect(idx)}
            >
              <span className="font-semibold mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </div>
          ))}
        </div>
        <div className="flex justify-start gap-4 mb-6">
          {question.options.map((_, idx) => (
            <button
              key={idx}
              className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg font-bold transition-all duration-150 ${
                selected === idx
                  ? "bg-[#2de0fb] text-[#23232b] border-[#2de0fb]"
                  : "bg-transparent text-white border-[#393945] hover:border-[#2de0fb]"
              }`}
              onClick={() => handleOptionSelect(idx)}
            >
              {String.fromCharCode(65 + idx)}
            </button>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 flex rounded mb-8 overflow-hidden">
          <div
            className="h-2 bg-white"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
          <div className="h-2 bg-[#12DCF0] flex-1" />
        </div>
        <div className="flex gap-4">
          <button
            className="flex-1 text-white py-2 font-semibold transition hover:opacity-90"
            style={{ backgroundColor: secondaryColor }}
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            Back
          </button>
          <button
            className="flex-1 text-[#23232b] py-2 font-semibold transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
            onClick={handleContinue}
          >
            {currentQuestion < questions.length - 1 ? "Continue" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
