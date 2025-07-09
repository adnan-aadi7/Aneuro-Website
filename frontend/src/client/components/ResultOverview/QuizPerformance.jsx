import React from "react";

const QuizPerformance = () => {
  return (
    <div className="bg-[#2A2A39] w-full p-4 md:p-8 flex flex-col text-white font-inter mb-8">
      <div className="text-2xl md:text-3xl font-medium mb-6 md:mb-8">
        Quiz Performance
      </div>
      <div className="flex flex-col md:flex-row gap-8 md:gap-20">
        {/* Submissions */}
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold mb-2 opacity-80">
            Submissions
          </span>
          <span className="text-3xl md:text-4xl font-bold leading-none">
            132
          </span>
        </div>
        {/* Views */}
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold mb-2 opacity-80">Views</span>
          <span className="text-3xl md:text-4xl font-bold leading-none">
            250
          </span>
        </div>
        {/* Conversion % */}
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold mb-2 opacity-80">
            Conversion %
          </span>
          <span className="text-3xl md:text-4xl font-bold leading-none">
            60%
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizPerformance;
