import React, { useEffect, useState } from "react";
import ArchitectPrompt from "./ArchitectPrompt";
import ChallengerPrompt from "./ChallengerPrompt";
import SynthesizerPrompt from "./SynthesizerPrompt";
import ReflectorPrompt from "./ReflectorPrompt";
import CatalystPrompt from "./CatalystPrompt";
import axios from "../../../store/axiosInstance"; // adjust path if your axiosInstance lives elsewhere

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("Architect");
  const [groupedPrompts, setGroupedPrompts] = useState({});
  const [categories, setCategories] = useState([]);

  const tabs = ["Architect", "Challenger", "Synthesizer", "Reflector", "Catalyst"];

  useEffect(() => {
  (async () => {
    try {
      // Read subscription object from localStorage
      const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
      const tier = subscription?.plan || "starter"; // fallback if not found

      // Using the grouped prompts API endpoint
      const res = await axios.get(`/prompt-packs/grouped?tier=${tier}`);
      setGroupedPrompts(res.data?.data || {});
      console.log("Grouped Prompt", res.data?.data);
    } catch (e) {
      // swallow silently per your request (no extra UI)
      setGroupedPrompts({});
      console.log(e);
    }
  })();
}, []);


  useEffect(() => { 
    (async () => {
      try {
        const res = await axios.get("/categories/prompts");
        setCategories(res.data?.data || []);
        console.log("Categories", res.data?.data);
      } catch (e) {
        setCategories([]);
        console.log(e);
      }
    })();
  }, []);
  

  const renderTabContent = () => {
    const common = { groupedPrompts, categories }; // pass grouped prompts data
    switch (activeTab) {
      case "Architect":
        return <ArchitectPrompt {...common} />;
      case "Challenger":
        return <ChallengerPrompt {...common} />;
      case "Synthesizer":
        return <SynthesizerPrompt {...common} />;
      case "Reflector":
        return <ReflectorPrompt {...common} />;
      case "Catalyst":
        return <CatalystPrompt {...common} />;
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
