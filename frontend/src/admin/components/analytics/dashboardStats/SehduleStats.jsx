import React, { useEffect } from "react";
import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduledStats, selectScheduleStats, selectScheduleLoading } from "../../../../store/Slice/ScheduleSlice";
import { useNavigate } from "react-router-dom";

const SehduleStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectScheduleStats);
  const loading = useSelector(selectScheduleLoading);
  const navigate = useNavigate();

  // Fetch stats on component mount
  useEffect(() => {
    dispatch(fetchScheduledStats());
  }, [dispatch]);
  console.log("schedule stats cards", stats);



  // Loading state
  if (loading) {
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
          <button className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
          onClick={() => navigate(`/admin/CMS?tab=${encodeURIComponent('Scheduled Releases')}`)}
          >
            View Details
          </button>
        </div>
        {/* Skeleton Loading */}
        <div className="flex flex-wrap gap-6">
          {[1, 2, 3].map((i) => (
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
    <div className="lg:p-6 p-2 mt-2">
      {/* Header Row */}
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h2 className="text-white text-lg sm:text-2xl font-semibold truncate">
            Scheduled Releases Summary
          </h2>
        </div>
        <button className="cursor-pointer bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
        onClick={() => navigate(`/admin/CMS?tab=${encodeURIComponent('Scheduled Releases')}`)}>
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
          <div className="text-white text-3xl font-bold mb-1">{stats?.upcoming || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">Next 30 days</div>
        </div>
        {/* This Week */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            This Week
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.thisWeekReleases || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">Due this week</div>
        </div>
        {/* This Month */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            This Month
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.thisMonthReleases || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">
            Due this month
          </div>
        </div>
        {/* Overdue */}
        {stats?.overdue > 0 && (
          <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
            <div className="flex items-center gap-2 text-orange-400 text-sm mb-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Overdue
            </div>
            <div className="text-orange-400 text-3xl font-bold mb-1">{stats.overdue}</div>
            <div className="text-xs text-cyan-400 font-medium">
              Needs attention
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SehduleStats;
