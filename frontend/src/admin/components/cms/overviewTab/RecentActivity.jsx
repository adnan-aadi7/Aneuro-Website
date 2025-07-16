import React from "react";
import { Calendar } from "lucide-react";

const RecentActivity = () => {
  return (
    <div className="bg-[#161D27] text-white p-4 w-full mt-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
        <h2 className="text-white font-normal">Recent Activity</h2>
      </div>

      {/* Activity Items */}
      <div className="space-y-6">
        {/* First Activity Item */}
        <div
          className="flex items-start justify-between border-b border-slate-700 pb-4 p-4 rounded"
          style={{ backgroundColor: "#1C2431" }}
        >
          <div className="flex-1">
            <p className="text-white text-sm mb-1">
              Email Sequence "Sales Mastery" uploaded
            </p>
            <p className="text-gray-400 text-xs">2 hours ago</p>
          </div>
          <div className="bg-cyan-400 text-black px-3 py-1 rounded text-xs font-medium ml-4">
            New
          </div>
        </div>

        {/* Second Activity Item */}
        <div
          className="flex items-start justify-between p-4 rounded"
          style={{ backgroundColor: "#1C2431" }}
        >
          <div className="flex-1">
            <p className="text-white text-sm mb-1">
              Prompt Pack "Content Creation" scheduled
            </p>
            <p className="text-gray-400 text-xs">1 day ago</p>
          </div>
          <div className="bg-slate-600 border border-slate-500 text-white px-3 py-1 rounded text-xs font-medium ml-4">
            Scheduled
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
