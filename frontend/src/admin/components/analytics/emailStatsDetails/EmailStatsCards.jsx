import React from "react";
import { Mail, Users, BarChart, Calendar } from "lucide-react";

const EmailStatsCards = () => {
  return (
    <div className="flex flex-wrap gap-6">
      {/* Emails */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Mail className="w-5 h-5 text-white" />
          Emails
        </div>
        <div className="text-white text-2xl font-bold mb-1">24</div>
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
      {/* Usage */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Users className="w-5 h-5 text-white" />
          Usage
        </div>
        <div className="text-white text-2xl font-bold mb-1">89,234</div>
        <div className="text-xs text-cyan-400 font-medium">
          Downloads: 156,789
        </div>
      </div>
      {/* Tier */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <BarChart className="w-5 h-5 text-white" />
          Tier
        </div>
        <div className="text-white text-2xl font-bold mb-1">Premium</div>
      </div>
      {/* Status */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Calendar className="w-5 h-5 text-white" />
          Status
        </div>
        <div className="text-white text-2xl font-bold mb-1">Active</div>
      </div>
    </div>
  );
};

export default EmailStatsCards;
