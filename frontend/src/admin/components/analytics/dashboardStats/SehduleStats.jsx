import React from "react";
import { Calendar } from "lucide-react";

const SehduleStats = () => {
  return (
    <div className="lg:p-6 p-2 mt-2">
      {/* Header Row */}
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h2 className="text-white text-lg sm:text-2xl font-semibold truncate">
            Scheduled Releases Summary
          </h2>
        </div>
        <button className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap">
          View Details
        </button>
      </div>
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Upcoming */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            Upcoming
          </div>
          <div className="text-white text-3xl font-bold mb-1">8</div>
          <div className="text-xs text-cyan-400 font-medium">Next 30 days</div>
        </div>
        {/* This Week */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            This Week
          </div>
          <div className="text-white text-3xl font-bold mb-1">3</div>
          <div className="text-xs text-cyan-400 font-medium">Due this week</div>
        </div>
        {/* This Month */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            This Month
          </div>
          <div className="text-white text-3xl font-bold mb-1">12</div>
          <div className="text-xs text-cyan-400 font-medium">
            Due this month
          </div>
        </div>
        {/* Overdue */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-orange-400 text-sm mb-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Overdue
          </div>
          <div className="text-orange-400 text-3xl font-bold mb-1">1</div>
          <div className="text-xs text-cyan-400 font-medium">
            Needs attention
          </div>
        </div>
      </div>
    </div>
  );
};

export default SehduleStats;
