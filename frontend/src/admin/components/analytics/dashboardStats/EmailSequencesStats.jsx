import React, { useEffect } from "react";
import { Mail, Eye, Activity, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmailSequenceStats, selectEmailSequenceStats, selectEmailSequenceLoading } from "../../../../store/Slice/EmailSequenceSLice";

const EmailSequencesStats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stats = useSelector(selectEmailSequenceStats);
  const loading = useSelector(selectEmailSequenceLoading);

  // Fetch stats on component mount
  useEffect(() => {
    dispatch(fetchEmailSequenceStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="lg:p-6 p-2">
        <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            <h2 className="text-white text-lg sm:text-2xl font-semibold truncate">
              Email Sequences Analytics
            </h2>
          </div>
        </div>
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
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          <h2 className="text-white text-lg sm:text-2xl font-semibold truncate">
            Email Sequences Analytics
          </h2>
        </div>
        <button
          className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
          onClick={() => navigate(`/admin/CMS?tab=${encodeURIComponent("Email Sequences")}`)}
        >
          View Details
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6">
        {/* Total Sequences */}
        <StatCard label="Total Sequences" icon={<Mail />} value={stats?.totalSequences || 0} />

        {/* Total Opens */}
        <StatCard
          label="Total Opens"
          icon={<Eye />}
          value={stats?.totalOpens || 0}
          sub={`Avg: ${stats?.avgOpens?.toFixed(1) || 0}%`}
        />

        {/* Total Clicks */}
        <StatCard
          label="Total Clicks"
          icon={<Activity />}
          value={stats?.totalClicks || 0}
          sub={`Avg: ${stats?.avgClicks?.toFixed(1) || 0}%`}
        />

        {/* Active / Scheduled */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex flex-row items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            Active / Scheduled
          </div>
          <div className="flex gap-3 mt-4">
            <span className="flex flex-row gap-1 items-center justify-center bg-cyan-900 text-cyan-200 px-4 py-1 rounded-full text-[10px] font-medium border border-cyan-400">
              <span>{stats?.totalActive || 0}</span> Active
            </span>
            <span className="flex flex-row gap-1 items-center justify-center bg-transparent text-cyan-200 px-2 py-1 rounded-full text-[10px] font-medium border border-cyan-400">
              <span>{stats?.totalScheduled || 0}</span> Scheduled
            </span>
          </div>
        </div>

        {/* Total Usage */}
        <StatCard
          label="Total Usage"
          icon={<Calendar />}
          value={stats?.totalUsage || 0}
          sub={stats?.avgRating ? `${stats.avgRating.toFixed(1)} ★` : "No ratings yet"}
        />
      </div>
    </div>
  );
};

const StatCard = ({ label, icon, value, sub }) => (
  <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
    <div className="flex items-center gap-2 text-white text-sm mb-2">
      {icon}
      {label}
    </div>
    <div className="text-white text-3xl font-bold mb-1">{value}</div>
    {sub && <div className="text-xs text-cyan-400 font-medium">{sub}</div>}
  </div>
);

export default EmailSequencesStats;
