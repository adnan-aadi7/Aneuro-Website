import React, { useState } from "react";
import { useSelector } from "react-redux";

const CYAN = "#2de0fb";

const QuizLink = () => {
  const [copied, setCopied] = useState(false);

  // Get userId from Redux
  const userId = useSelector((state) => state.user?.user?.id);

  // Build the dynamic link
  const QUIZ_LINK = userId
    ? `${window.location.origin}/Audience-quiz/${userId}`
    : `${window.location.origin}/Audience-quiz`;

  const handleCopy = () => {
    navigator.clipboard.writeText(QUIZ_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="bg-[#2A2A39] p-6 w-full border border-[#2de0fb33] shadow-lg relative mt-3"
      style={{ boxShadow: `inset 0 0 20px 0 ${CYAN}80` }}
    >
      <h2 className="text-white text-lg font-medium mb-4">
        Quiz Link Generator
      </h2>

      <div className="flex items-center border border-[#393945] px-4 py-3 rounded-lg">
        <input
          type="text"
          value={QUIZ_LINK}
          disabled
          className="bg-transparent text-gray-400 flex-1 outline-none border-none select-all cursor-default text-sm"
        />

        <button
          className="ml-3 p-1 transition cursor-pointer flex items-center"
          title={copied ? "Copied!" : "Copy link"}
          onClick={handleCopy}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="7"
              y="7"
              width="10"
              height="10"
              rx="2"
              stroke={copied ? CYAN : "#12DCF0"}
              strokeWidth="2"
            />
            <rect
              x="3"
              y="3"
              width="10"
              height="10"
              rx="2"
              stroke={copied ? CYAN : "#12DCF0"}
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
          {copied && (
            <span className="ml-2 text-xs text-[#12DCF0] font-semibold">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizLink;
