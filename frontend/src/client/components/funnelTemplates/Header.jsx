import React from "react";

export default function Header({ activeTab, setActiveTab }) {
  const tabs = ["Architect", "Challenger", "Synthesizer", "Reflector", "Catalyst"];

  return (
    <div className="text-white w-full ">
      <div className="py-4 px-2">
        <h1 className="text-white text-4xl font-semibold mb-1">Cognitive Wireframes</h1>
        <p className="text-slate-400 text-base mt-3">
         Turn clicks into purchases with science backed frameworks that explain how to structure ad driven landing pages using cognitive motivators.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex overflow-x-auto border border-[#444] rounded bg-transparent p-1 gap-1 sm:gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${
                  activeTab === tab
                    ? "bg-cyan-400 text-black"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
