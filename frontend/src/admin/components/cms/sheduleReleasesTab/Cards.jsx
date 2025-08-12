import React, { useEffect } from "react";
import { Clock, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllScheduled, selectScheduleStats, selectScheduleLoading } from "../../../../store/Slice/ScheduleSlice";

const Cards = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectScheduleStats);
  const loading = useSelector(selectScheduleLoading);

  // Fetch schedule stats on component mount
  useEffect(() => {
    dispatch(fetchAllScheduled());
  }, [dispatch]);
  console.log("stats", stats);

  const formatNextReleaseDate = (nextRelease) => {
    if (!nextRelease || !nextRelease.releaseDateTime) return "No upcoming releases";
    
    const date = new Date(nextRelease.releaseDateTime);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNextReleaseContent = (nextRelease) => {
    if (!nextRelease || !nextRelease.content) return "No upcoming releases";
    
    // Truncate long content names
    const content = nextRelease.content;
    if (content.length > 25) {
      return `${content.substring(0, 25)}...`;
    }
    return content;
  };

  if (loading) {
    return (
      <div className="text-white py-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              <div className="mb-2">
                <div className="h-8 bg-gray-600 rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-600 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-white py-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Releases */}
        <div className="p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">
              Pending Releases
            </h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-white">
              {stats?.totalPending || 0}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Scheduled for release</p>
        </div>

        {/* This Week */}
        <div className="p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">This Week</h3>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-white">
              {stats?.thisWeekReleases || 0}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Releases this week</p>
        </div>

        {/* Next Release */}
        <div className="p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">Next Release</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-white">
              {formatNextReleaseDate(stats?.nextRelease)}
            </span>
          </div>
          <p className="text-gray-400 text-sm" title={stats?.nextRelease?.content || ""}>
            {formatNextReleaseContent(stats?.nextRelease)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
