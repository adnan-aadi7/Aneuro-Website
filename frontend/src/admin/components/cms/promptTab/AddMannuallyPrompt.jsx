import React, { act, useState } from "react";
import { Mail, Users, Calendar } from "lucide-react";
import Promptype from "./Promptype";

const tabs = [
  "Architect",
  "Challenger",
  "Synthesizer",
  "Reflector",
  "Catalyst",
];

const AddMannuallyPrompt = () => {
  const [activeTab, setActiveTab] = useState("Architect");

  return (
    <div className=" min-h-screen ">
      {/* Title and subtitle */}
      <h2 className="text-white text-2xl font-semibold mb-1">Prompt Packs</h2>
      <p className="text-gray-300 mb-8 text-base">
        Brain-type optimized content prompts for your marketing
      </p>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Total Prompts */}
        <div className="bg-[#2A2A39]  p-6 min-w-[220px] flex-1 border border-[#3A3A4A]">
          <div className="text-gray-200 text-sm flex items-center gap-2 mb-2">
            <Mail className="w-6 h-6 text-white" />
            Total Prompts
          </div>
          <div className="text-white text-3xl font-bold mb-1">24</div>
          <div className="text-xs text-green-400 font-medium flex items-center gap-1">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 17l6-6 4 4 6-6" />
            </svg>
            +12% this month
          </div>
        </div>
        {/* Monthly Usage */}
        <div className="bg-[#2A2A39]  p-6 min-w-[220px] flex-1 border border-[#3A3A4A]">
          <div className="text-gray-200 text-sm flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-white" />
            Monthly Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">89,234</div>
          <div className="text-xs text-cyan-400 font-medium">
            Downloads: 156,789
          </div>
        </div>
        {/* Status */}
        <div className="bg-[#2A2A39]  p-6 min-w-[220px] flex-1 border border-[#3A3A4A]">
          <div className="text-gray-200 text-sm flex items-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-white" />
            Status
          </div>
          <div className="text-white text-2xl font-bold mb-1">Active</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border border-[#3A3A4A] p-1  overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-2 text-sm font-medium transition-all cursor-pointer
              ${
                activeTab === tab
                  ? "bg-cyan-400 text-black"
                  : "text-gray-300 bg-transparent"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Analytical" && <Promptype type={activeTab} />}
      {activeTab === "Practical" && <Promptype type={activeTab} />}
    </div>
  );
};
export default AddMannuallyPrompt;
