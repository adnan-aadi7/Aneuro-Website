import React from "react";
import { Zap, Users, BarChart, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromptStats = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-7 h-7 text-white" />
          <h2 className="text-white text-2xl font-semibold">
            Prompt Packs Analytics
          </h2>
        </div>
        <button
          className="bg-cyan-400 text-black font-medium px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm"
          onClick={() => navigate("/admin/analytics/prompts-details")}
        >
          View Details
        </button>
      </div>
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Total Packs */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Zap className="w-5 h-5 text-white" />
            Total Packs
          </div>
          <div className="text-white text-3xl font-bold mb-1">45</div>
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
            +18% this month
          </div>
        </div>
        {/* Total Usage */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Users className="w-5 h-5 text-white" />
            Total Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">89,234</div>
          <div className="text-xs text-cyan-400 font-medium">
            Downloads: 156,789
          </div>
        </div>
        {/* Avg Rating */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <BarChart className="w-5 h-5 text-white" />
            Avg Rating
          </div>
          <div className="text-white text-3xl font-bold mb-1">4.7/5.0</div>
          <div className="text-xs text-cyan-400 font-medium">
            Based on user feedback
          </div>
        </div>
        {/* Active/Scheduled */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            Active/Scheduled
          </div>
          <div className="flex gap-3 mt-4">
            <span className="bg-cyan-900 text-cyan-200 px-4 py-1 rounded-full text-xs font-medium border border-cyan-400 text-nowrap">
              32 Active
            </span>
            <span className="bg-transparent text-cyan-200 px-2 py-1 rounded-full text-xs font-medium border border-cyan-400 text-nowrap">
              5 Scheduled
            </span>
          </div>
        </div>
        {/* Total Usage (again, for symmetry) */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            Total Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">12,453</div>
          <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
            <Star className="w-4 h-4 text-cyan-400" /> 4.7 (User Rating)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptStats;
