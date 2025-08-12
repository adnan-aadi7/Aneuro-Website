import React, { useEffect } from "react";
import { Zap, Users, BarChart, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromptPackStats, selectPromptPackStats, selectPromptPackLoading } from "../../../../store/Slice/PromptPacksSlice";

const PromptStats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stats = useSelector(selectPromptPackStats);
  const loading = useSelector(selectPromptPackLoading);

  // Fetch stats on component mount
  useEffect(() => {
    dispatch(fetchPromptPackStats());
  }, [dispatch]);

  console.log("prompt stats", stats);

  // Loading state
  if (loading) {
    return (
      <div className="lg:p-6 p-2">
        {/* Header Row */}
        <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <h2 className="text-white text-2lx sm:text-3xl font-semibold truncate">
              Prompt Packs Analytics
            </h2>
          </div>
          <button
            className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
            onClick={() => navigate("/admin/analytics/prompts-details")}
          >
            View Details
          </button>
        </div>
        {/* Skeleton Loading */}
        <div className="flex flex-wrap gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
              <div className="h-4 bg-gray-600 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-600 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-600 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="lg:p-6 p-2">
      {/* Header Row */}
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h2 className="text-white text-2lx sm:text-3xl font-semibold truncate">
            Prompt Packs Analytics
          </h2>
        </div>
        <button
          className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
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
          <div className="text-white text-3xl font-bold mb-1">{stats?.overall?.totalPacks || 0}</div>
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
            {stats?.overall?.totalPacks || 0} total packs
          </div>
        </div>
        {/* Total Usage */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Users className="w-5 h-5 text-white" />
            Total Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.overall?.totalUsage || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">
            Avg: {stats?.overall?.avgUsage || 0} per pack
          </div>
        </div>
        {/* Avg Rating */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <BarChart className="w-5 h-5 text-white" />
            Avg Rating
          </div>
          <div className="text-white text-3xl font-bold mb-1">
            {stats?.overall?.avgRating ? `${stats.overall.avgRating.toFixed(1)}/5.0` : '0.0/5.0'}
          </div>
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
              {stats?.status?.active?.totalPacks || 0} Active
            </span>
            <span className="bg-transparent text-cyan-200 px-2 py-1 rounded-full text-[10px] font-medium border border-cyan-400 text-nowrap">
              {stats?.status?.scheduled?.totalPacks || 0} Scheduled
            </span>
          </div>
        </div>
        {/* Max Usage */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Star className="w-5 h-5 text-white" />
            Max Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.overall?.maxUsage || 0}</div>
          <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
            <Star className="w-4 h-4 text-cyan-400" /> 
            Highest usage count
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptStats;
