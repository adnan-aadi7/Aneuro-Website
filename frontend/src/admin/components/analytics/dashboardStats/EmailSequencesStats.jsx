import React from "react";
import { Mail, Eye, Activity, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmailSequencesStats = () => {
  const navigate = useNavigate();
  return (
    <div className="lg:p-6 p-2">
      {/* Header Row */}
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h2 className="text-white text-lg sm:text-2xl font-semibold truncate">
            Email Sequences Analytics
          </h2>
        </div>
        <button
          className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
          onClick={() => navigate("/admin/analytics/email-details")}
        >
          View Details
        </button>
      </div>
      {/* Stat Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Total Sequences */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Mail className="w-5 h-5 text-white" />
            Total Sequences
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
        {/* Total Opens */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Eye className="w-5 h-5 text-white" />
            Total Opens
          </div>
          <div className="text-white text-3xl font-bold mb-1">45,678</div>
          <div className="text-xs text-cyan-400 font-medium">Avg: 23.5%</div>
        </div>
        {/* Total Clicks */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Activity className="w-5 h-5 text-white" />
            Total Clicks
          </div>
          <div className="text-white text-3xl font-bold mb-1">12,453</div>
          <div className="text-xs text-cyan-400 font-medium">Avg: 8.2%</div>
        </div>
        {/* Active/Scheduled */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            Active/Scheduled
          </div>
          <div className="flex gap-3 mt-4">
            <span className="bg-cyan-900 text-cyan-200 px-4 py-1 rounded-full text-xs font-medium border border-cyan-400 text-nowrap">
              18 Active
            </span>
            <span className="bg-transparent text-cyan-200 px-2 py-1 rounded-full text-xs font-medium border border-cyan-400 text-nowrap">
              3 Scheduled
            </span>
          </div>
        </div>
        {/* Total Usage */}
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

export default EmailSequencesStats;
