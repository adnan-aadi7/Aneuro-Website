import React, { useEffect } from "react";
import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecentActivities,
  selectActivities,
  selectActivitiesLoading
} from "../../../../store/Slice/ActivitySlice";

const RecentActivity = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectActivities);
  const loading = useSelector(selectActivitiesLoading);

  // Fetch activities on component mount
  useEffect(() => {
    dispatch(fetchRecentActivities());
  }, [dispatch]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Unknown time';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'New') {
      return "bg-cyan-400 text-black px-3 py-1 rounded text-xs font-medium ml-4";
    } else if (status === 'Scheduled') {
      return "bg-slate-600 border border-slate-500 text-white px-3 py-1 rounded text-xs font-medium ml-4";
    } else {
      return "bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium ml-4";
    }
  };

  // Ensure activities is an array
  const safeActivities = Array.isArray(activities) ? activities : [];

  return (
    <div className="bg-[#161D27] text-white p-4 w-full mt-10">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
        <h2 className="text-white font-normal">Recent Activity</h2>
      </div>

      {/* Activity Items */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-2"></div>
            <span className="text-gray-400">Loading activities...</span>
          </div>
        ) : safeActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No recent activities found
          </div>
        ) : (
          safeActivities.slice(0, 5).map((activity, index) => (
            <div
              key={activity._id || index}
              className={`flex items-start justify-between p-4 rounded ${
                index < safeActivities.length - 1 ? 'border-b border-slate-700 pb-4' : ''
              }`}
              style={{ backgroundColor: "#1C2431" }}
            >
              <div className="flex-1">
                <p className="text-white text-sm mb-1">
                  {activity.action || `${activity.type} "${activity.name}" ${activity.status === 'Scheduled' ? 'scheduled' : 'uploaded'}`}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatTimeAgo(activity.date)}
                </p>
              </div>
              <div className={getStatusBadge(activity.status)}>
                {activity.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
