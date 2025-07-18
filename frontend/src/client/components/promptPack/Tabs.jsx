import React, { useState } from "react";
import AnalyticalPrompt from "./AnalyticalPrompt";
import CreativePrompt from "./CreativePrompt";
import EmpatheticPrompt from "./EmpatheticPrompt";
import StrategicPrompt from "./StrategicPrompt";
import PracticalPrompt from "./PracticalPrompt";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Analytical");

  const tabs = [
    "Analytical",
    "Creative",
    "Empathetic",
    "Strategic",
    "Practical",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Analytical":
        return <AnalyticalPrompt />;
      case "Creative":
        return <CreativePrompt />;
      case "Empathetic":
        return <EmpatheticPrompt />;
      case "Strategic":
        return <StrategicPrompt />;
      case "Practical":
        return <PracticalPrompt />;
      default:
        return null;
    }
  };

  return (
    <div className="text-white w-full">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-4 pb-2">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
          Prompt Packs
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Select a brain type to view ready-to-use content prompts.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-2 sm:px-8">
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

      {/* Content Area - show the correct component for the active tab */}
      <div className="px-2 sm:px-8">{renderTabContent()}</div>
    </div>
  );
}
