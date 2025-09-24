import React, { useEffect } from "react";
import { Mail, Users, Calendar, MousePointerClick } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromptPackById } from "../../../../store/Slice/PromptPacksSlice";

const PromptDetailsCards = ({ packId }) => {
  const dispatch = useDispatch();
  const { currentPack, loading, error } = useSelector((state) => state.promptPack);

  useEffect(() => {
    if (packId) {
      dispatch(fetchPromptPackById(packId));
    }
  }, [dispatch, packId]);

  if (!packId) {
    return (
      <div className="text-gray-400 text-center py-6">
        No prompt pack selected. Please select a pack to view details.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-6  max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#323242] border border-[#45455a]  p-6 min-w-[220px] flex-1">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  const promptsCount = currentPack?.prompts ? currentPack.prompts.length : 0;
  const totalUsers = currentPack?.usageStats?.totalUsers || 0;
  const totalClicks = currentPack?.usageStats?.totalClicks || 0;
  const downloadsCount = currentPack?.downloads || currentPack?.downloadsCount || 0;
  const status = currentPack?.status || "-";

  return (
    <div className="flex flex-wrap gap-6  max-w-4xl">
      {/* Prompts */}
      <div className="bg-[#323242] border border-[#45455a]  p-6 min-w-[220px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Mail className="w-5 h-5 text-white" />
          Prompts
        </div>
        <div className="text-white text-2xl font-bold mb-1">{promptsCount}</div>
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
      <div className="bg-[#323242] border border-[#45455a]  p-6 min-w-[220px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Users className="w-5 h-5 text-white" />
          Usage
        </div>
        <div className="text-white text-2xl font-bold mb-1">
          {totalUsers.toLocaleString()} 
        </div>
        <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
          <MousePointerClick className="w-4 h-4 text-cyan-400" />
          {totalClicks.toLocaleString()} clicks
        </div>
       
      </div>

      {/* Status */}
      <div className="bg-[#323242] border border-[#45455a]  p-6 min-w-[220px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Calendar className="w-5 h-5 text-white" />
          Status
        </div>
        <div className="text-white text-2xl font-bold mb-1">{status}</div>
      </div>
    </div>
  );
};

export default PromptDetailsCards;
