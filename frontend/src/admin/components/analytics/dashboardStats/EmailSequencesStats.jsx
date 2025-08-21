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
  console.log("stats", stats);

  // Loading state
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
          <button
            className="bg-cyan-400 text-black font-medium px-3 sm:px-6 py-2 rounded hover:bg-cyan-300 transition-all text-sm whitespace-nowrap"
            onClick={() => navigate(`/admin/CMS?tab=${encodeURIComponent('Email Sequences')}`)}
          >
            View Details
          </button>
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
          onClick={() => navigate(`/admin/CMS?tab=${encodeURIComponent('Email Sequences')}`)}
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
          <div className="text-white text-3xl font-bold mb-1">{stats?.totalSequences || 0}</div>
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
            +{stats?.totalSequences || 0} total
          </div>
        </div>
        {/* Total Emails */}
        {/* <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Mail className="w-5 h-5 text-white" />
            Total Emails
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.totalEmails || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">Total email count</div>
        </div> */}
        {/* Total Opens */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Eye className="w-5 h-5 text-white" />
            Total Opens
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.totalOpens || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">
            {stats?.totalOpens > 0 && stats?.totalEmails > 0 
              ? `Avg: ${((stats.totalOpens / stats.totalEmails) * 100).toFixed(1)}%`
              : 'Avg: 0%'
            }
          </div>
        </div>
        {/* Total Clicks */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Activity className="w-5 h-5 text-white" />
            Total Clicks
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.totalClicks || 0}</div>
          <div className="text-xs text-cyan-400 font-medium">
            {stats?.totalOpens > 0 && stats?.totalClicks > 0 
              ? `Avg: ${((stats.totalClicks / stats.totalOpens) * 100).toFixed(1)}%`
              : 'Avg: 0%'
            }
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
              {stats?.totalActive || 0} Active
            </span>
            <span className="bg-transparent text-cyan-200 px-2 py-1 rounded-full text-[10px] font-medium border border-cyan-400 text-nowrap">
              {stats?.totalScheduled || 0} Scheduled
            </span>
          </div>
        </div>
        {/* Total Usage */}
        <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[200px] flex-1">
          <div className="flex items-center gap-2 text-white text-sm mb-2">
            <Calendar className="w-5 h-5 text-white" />
            Total Usage
          </div>
          <div className="text-white text-3xl font-bold mb-1">{stats?.totalUsage || 0}</div>
          <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
            <Star className="w-4 h-4 text-cyan-400" /> 
            {stats?.averageRating ? `${stats.averageRating.toFixed(1)} (User Rating)` : 'No ratings yet'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSequencesStats;
