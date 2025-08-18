import React, { useEffect } from "react";
import { Mail, Users, BarChart, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmailSequenceById } from "../../../../store/Slice/EmailSequenceSLice";

const EmailStatsCards = ({ sequenceId }) => {
  const dispatch = useDispatch();
  const { currentSequence, loading, error } = useSelector((state) => state.emailSequence);

  useEffect(() => {
    if (sequenceId) {
      dispatch(fetchEmailSequenceById(sequenceId));
    }
  }, [dispatch, sequenceId]);
  console.log("currentSequence", currentSequence);

  if (!sequenceId) {
    return (
      <div className="text-gray-400 text-center py-8">
        No sequence selected. Please select an email sequence to view details.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
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

  // Extract data from the email sequence
  const emailSequence = currentSequence || {};
  const emailCount = Array.isArray(emailSequence.emails) ? emailSequence.emails.length : 0;
  const tier = emailSequence.tier || '-';
  const status = emailSequence.status || '-';
  // usage can be an object { count } or a number or undefined
  const usageCount = typeof emailSequence.usage === 'number'
    ? emailSequence.usage
    : (emailSequence.usage?.count ?? 0);
  const downloadsCount = typeof emailSequence.downloads === 'number' ? emailSequence.downloads : 0;

  return (
    <div className="flex flex-wrap gap-6">
      {/* Emails */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Mail className="w-5 h-5 text-white" />
          Emails
        </div>
        <div className="text-white text-2xl font-bold mb-1">{emailCount}</div>
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
        <div className="text-white text-2xl font-bold mb-1">{usageCount.toLocaleString()}</div>
        <div className="text-xs text-cyan-400 font-medium">
          Downloads: {downloadsCount.toLocaleString()}
        </div>
      </div>
      {/* Tier */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <BarChart className="w-5 h-5 text-white" />
          Tier
        </div>
        <div className="text-white text-2xl font-bold mb-1">{tier}</div>
      </div>
      {/* Status */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Calendar className="w-5 h-5 text-white" />
          Status
        </div>
        <div className="text-white text-2xl font-bold mb-1">{status}</div>
      </div>
    </div>
  );
};

export default EmailStatsCards;
