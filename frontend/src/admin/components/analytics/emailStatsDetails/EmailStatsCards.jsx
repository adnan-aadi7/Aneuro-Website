import React, { useEffect, useState } from "react";
import { Mail, Users, BarChart, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchEmailSequenceById } from "../../../../store/Slice/EmailSequenceSLice";
import axios from "../../../../store/axiosInstance";

const EmailStatsCards = ({ sequenceId }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentSequence, loading, error } = useSelector((state) => state.emailSequence);
  
  // State for category view
  const [categoryStats, setCategoryStats] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isCategoryView, setIsCategoryView] = useState(false);

  useEffect(() => {
    // Check if we're viewing from category (grouped view)
    const categoryData = location.state;
    if (categoryData?.category && categoryData?.sequenceIds) {
      setIsCategoryView(true);
      fetchCategoryStats(categoryData.sequenceIds);
    } else {
      setIsCategoryView(false);
      if (sequenceId) {
        dispatch(fetchEmailSequenceById(sequenceId));
      }
    }
  }, [dispatch, sequenceId, location.state]);

  const fetchCategoryStats = async (sequenceIds) => {
    setCategoryLoading(true);
    try {
      let totalEmails = 0;
      let totalUsage = 0;
      let totalDownloads = 0;
      const tiers = new Set();
      const statuses = new Set();
      
      // Fetch each sequence and collect stats
      for (const id of sequenceIds) {
        try {
          const response = await axios.get(`/email-sequences/${id}`);
          if (response.data?.success && response.data?.data) {
            const seq = response.data.data;
            
            // Count emails
            if (seq.type === 'file') {
              totalEmails += 1; // File-based sequences count as 1 email
            } else if (seq.emails && Array.isArray(seq.emails)) {
              totalEmails += seq.emails.length;
            }
            
            // Count usage
            if (seq.usage?.count) {
              totalUsage += seq.usage.count;
            }
            
            // Count downloads
            if (seq.downloads) {
              totalDownloads += seq.downloads;
            }
            
            // Collect tiers and statuses
            if (seq.tier) tiers.add(seq.tier);
            if (seq.status) statuses.add(seq.status);
          }
        } catch (error) {
          console.error(`Error fetching sequence ${id}:`, error);
        }
      }
      
      setCategoryStats({
        totalEmails,
        totalUsage,
        totalDownloads,
        tiers: Array.from(tiers),
        statuses: Array.from(statuses)
      });
    } catch (error) {
      console.error('Error fetching category stats:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  if (!sequenceId && !isCategoryView) {
    return (
      <div className="text-gray-400 text-center py-8">
        No sequence selected. Please select an email sequence to view details.
      </div>
    );
  }

  if (loading || categoryLoading) {
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

  // Extract data based on view type
  let emailCount, tier, status, usageCount, downloadsCount;

  if (isCategoryView && categoryStats) {
    // Category view - aggregated stats
    emailCount = categoryStats.totalEmails;
    tier = categoryStats.tiers.length > 0 ? `${categoryStats.tiers[0]}${categoryStats.tiers.length > 1 ? ` +${categoryStats.tiers.length - 1}` : ''}` : '-';
    status = categoryStats.statuses.length > 0 ? `${categoryStats.statuses[0]}${categoryStats.statuses.length > 1 ? ` +${categoryStats.statuses.length - 1}` : ''}` : '-';
    usageCount = categoryStats.totalUsage;
    downloadsCount = categoryStats.totalDownloads;
  } else {
    // Single sequence view
    const emailSequence = currentSequence || {};
    emailCount = Array.isArray(emailSequence.emails) ? emailSequence.emails.length : 0;
    tier = emailSequence.tier || '-';
    status = emailSequence.status || '-';
    // usage can be an object { count } or a number or undefined
    usageCount = typeof emailSequence.usage === 'number'
      ? emailSequence.usage
      : (emailSequence.usage?.count ?? 0);
    downloadsCount = typeof emailSequence.downloads === 'number' ? emailSequence.downloads : 0;
  }

  return (
    <div className="flex flex-wrap gap-6">
      {/* Emails */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Mail className="w-5 h-5 text-white" />
          {isCategoryView ? 'Total Emails' : 'Emails'}
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
          {isCategoryView ? 'Category Total' : '+12% this month'}
        </div>
      </div>
      {/* Usage */}
      {/* Usage */}
<div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
  <div className="flex items-center gap-2 text-white text-sm mb-2">
    <Users className="w-5 h-5 text-white" />
    {isCategoryView ? 'Total Usage' : 'Usage'}
  </div>

  <div className="text-white text-2xl font-bold mb-1">
  {currentSequence?.usageStats?.totalUsageBasedOnClicks ?? 0}
</div>


 

  
</div>

    {/* Tier */}
<div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
  <div className="flex items-center gap-2 text-white text-sm mb-2">
    <BarChart className="w-5 h-5 text-white" />
    {isCategoryView ? "Tiers" : "Tier"}
  </div>

  {/* Handle array vs single tier */}
  <div className="flex flex-wrap gap-2 mb-1 text-white text-2xl font-bold">
    {Array.isArray(tier) ? (
      tier.map((t, i) => (
        <span key={i}>{t}</span>
      ))
    ) : (
      <span>{tier}</span>
    )}
  </div>

  {isCategoryView && categoryStats?.tiers.length > 1 && (
    <div className="text-2xl text-white">
      {categoryStats.tiers.length} different tiers
    </div>
  )}
</div>

      {/* Status */}
      <div className="bg-[#2A2A39] border border-[#3A3A4A] rounded p-6 min-w-[180px] flex-1">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Calendar className="w-5 h-5 text-white" />
          {isCategoryView ? 'Statuses' : 'Status'}
        </div>
        <div className="text-white text-2xl font-bold mb-1">{status}</div>
        {isCategoryView && categoryStats?.statuses.length > 1 && (
          <div className="text-xs text-gray-400">
            {categoryStats.statuses.length} different statuses
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailStatsCards;
