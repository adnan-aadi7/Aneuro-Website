import React from "react";
import { Filter, Users, BarChart, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FunnelStats = () => {
  const navigate = useNavigate();
  return (
    <div className="lg:p-6 p-2">
      {/* Header Row */}
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Filter className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h2 className="text-white text-lg sm:text-2xl font-semibold truncate">
            Funnel Templates Analytics
          </h2>
        </div>
        <button
          className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
          onClick={() => navigate("/admin/analytics/funnel-details")}
        >
          View Details
        </button>
      </div>
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Total Templates */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Filter className="w-5 h-5 text-white" />
            Total Templates
          </div>
          <div className="text-white text-3xl font-bold mb-1">12</div>
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
            +8% this month
          </div>
        </div>
        {/* Total Usage */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Users className="w-5 h-5 text-white" />
            Total Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">3,456</div>
          <div className="text-xs text-cyan-400 font-medium">Leads: 45,678</div>
        </div>
        {/* Avg Conversion */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <BarChart className="w-5 h-5 text-white" />
            Avg Conversion
          </div>
          <div className="text-white text-3xl font-bold mb-1">12.8%</div>
          <div className="text-xs text-cyan-400 font-medium">
            Conversion rate
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
              9 Active
            </span>
            <span className="bg-transparent text-cyan-200 px-2 py-1 rounded-full text-[10px] font-medium border border-cyan-400 text-nowrap">
              3 Scheduled
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

export default FunnelStats;
