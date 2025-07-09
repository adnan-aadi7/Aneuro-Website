import React from "react";

const cardInnerShadow = {
  boxShadow: "",
};

const SuggestTools = () => {
  return (
    <div className="w-full max-w-full mx-auto mt-10">
      <div className="text-white text-lg font-semibold mb-4">Suggest Tools</div>
      <div className="grid grid-cols-2 gap-7">
        {/* First row */}
        <div className="col-span-1">
          <div
            className="flex items-center justify-between h-20 px-6 rounded-md cursor-pointer relative bg-[#2A2A39] bg-gradient-to-r from-[#2A2A39] to-[#19343B]"
            style={cardInnerShadow}
          >
            <span className="text-white text-base font-semibold">
              Email Sequences
            </span>
            <span className="ml-4">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="col-span-1">
          <div
            className="flex items-center justify-between h-20 px-6 rounded-md cursor-pointer relative bg-[#2A2A39] bg-gradient-to-r from-[#2A2A39] to-[#19343B]"
            style={cardInnerShadow}
          >
            <span className="text-white text-base font-semibold">
              Prompt Packs
            </span>
            <span className="ml-4">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        {/* Second row */}
        <div className="col-span-1">
          <div
            className="flex items-center justify-between h-20 px-6 rounded-md cursor-pointer relative bg-[#2A2A39] bg-gradient-to-r from-[#2A2A39] to-[#19343B]"
            style={cardInnerShadow}
          >
            <span className="text-white text-base font-semibold">
              Funnel Toolkit
            </span>
            <span className="ml-4">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        {/* Empty cell for 2x2 grid look */}
        <div className="col-span-1"></div>
      </div>
    </div>
  );
};

export default SuggestTools;
