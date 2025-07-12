import React, { useState } from "react";

export default function Header() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="text-white w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 w-full">
        {/* Left side - Title and description */}
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            Choose Plan
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm">
            You can select plan according to your needs
          </p>
        </div>

        {/* Right side - Toggle switch */}
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
          <span
            className={`text-xs sm:text-sm ${
              !isYearly ? "text-white" : "text-gray-400"
            }`}
          >
            Yearly
          </span>

          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
              isYearly ? "bg-cyan-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <span
            className={`text-xs sm:text-sm ${
              isYearly ? "text-white" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
        </div>
      </div>
    </div>
  );
}
