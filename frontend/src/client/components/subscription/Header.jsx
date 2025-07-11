import React, { useState } from "react";

export default function Header() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className=" text-white">
      <div className="flex justify-between items-center">
        {/* Left side - Title and description */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Choose Plan</h1>
          <p className="text-gray-300 text-sm">
            You can select plan according to your needs
          </p>
        </div>

        {/* Right side - Toggle switch */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm ${!isYearly ? "text-white" : "text-gray-400"}`}
          >
            Yearly
          </span>

          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? "bg-cyan-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <span
            className={`text-sm ${isYearly ? "text-white" : "text-gray-400"}`}
          >
            Monthly
          </span>
        </div>
      </div>
    </div>
  );
}
