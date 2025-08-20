import React, { useEffect, useState } from "react";
import AnalyticalPrompt from "./AnalyticalPrompt";
import CreativePrompt from "./CreativePrompt";
import EmpatheticPrompt from "./EmpatheticPrompt";
import StrategicPrompt from "./StrategicPrompt";
import PracticalPrompt from "./PracticalPrompt";
import axios from "../../../store/axiosInstance"; // adjust path if your axiosInstance lives elsewhere

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Architect");
  const [categories, setCategories] = useState([]);

  const tabs = ["Architect", "Challenger", "Synthesizer", "Reflector", "Catalyst"];

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/categories/prompts");
        setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (e) {
        // swallow silently per your request (no extra UI)
        setCategories([]);
        console.log(e);
      }
    })();
  }, []);

  const renderTabContent = () => {
    const common = { categories }; // pass categories only; keep everything else identical
    switch (activeTab) {
      case "Architect":
        return <AnalyticalPrompt {...common} />;
      case "Challenger":
        return <CreativePrompt {...common} />;
      case "Synthesizer":
        return <EmpatheticPrompt {...common} />;
      case "Reflector":
        return <StrategicPrompt {...common} />;
      case "Catalyst":
        return <PracticalPrompt {...common} />;
      default:
        return null;
    }
  };

  return (
    <div className="text-white w-full ">
      {/* Header */}
      <div className=" px-2 pt-4 pb-2">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Prompt Packs</h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Select a brain type to view ready-to-use content prompts.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-2  mt-10">
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

      {/* Content Area */}
      <div className="px-2 ">{renderTabContent()}</div>
    </div>
  );
}
