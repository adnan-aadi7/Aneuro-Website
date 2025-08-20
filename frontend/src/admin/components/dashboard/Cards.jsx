import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Looper3 from "../../../assets/resultOverView/Looper-3.png";
import {
  fetchNewSubscribersPerWeek,
  fetchDelinquentSubscribers,
  fetchAvgQuizCompletionTime,
  selectNewSubscribersPerWeek,
  selectDelinquentSubscribers,
  selectAvgQuizCompletionTime,
  selectAdminDashboardLoading,
  // fetchTotalRevenue, // No longer used
  // selectTotalRevenueDollars, // No longer used
  fetchStripeBalance,
  selectStripeBalance,
  // New dynamic analytics imports
  fetchDashboardAnalytics,
  selectDashboardAnalytics,
  selectAdminDashboardError,
} from "../../../store/Slice/DashboardSliceAdmin";

const Cards = () => {
  const dispatch = useDispatch();

  const newSubs = useSelector(selectNewSubscribersPerWeek);
  const delinquent = useSelector(selectDelinquentSubscribers);
  const avgTime = useSelector(selectAvgQuizCompletionTime);
  // const totalRevenueDollars = useSelector(selectTotalRevenueDollars); // No longer used
  const stripeBalance = useSelector(selectStripeBalance);
  const loading = useSelector(selectAdminDashboardLoading);
  
  // New dynamic analytics selectors
  const dashboardAnalytics = useSelector(selectDashboardAnalytics);
  const analyticsError = useSelector(selectAdminDashboardError);

  useEffect(() => {
    // Fetch both old and new analytics
    dispatch(fetchNewSubscribersPerWeek());
    dispatch(fetchDelinquentSubscribers());
    dispatch(fetchAvgQuizCompletionTime());
    // dispatch(fetchTotalRevenue()); // No longer used
    dispatch(fetchStripeBalance());
    
    // Fetch new dynamic analytics
    dispatch(fetchDashboardAnalytics());
  }, [dispatch]);

  // Helper function to format percentage with trend arrow
  const formatPercentage = (percentage, trend) => {
    // Convert to number and check if it's null, undefined, or exactly 0
    const numPercentage = parseFloat(percentage);
    
    if (percentage === null || percentage === undefined || isNaN(numPercentage)) {
      return "↑ 0%"; // Show 0% with up arrow when no change or no data
    }
    
    // If percentage is 0 or negative, show 0%
    if (numPercentage <= 0) {
      return "↑ 0%";
    }
    
    const arrow = trend === 'up' ? '↑' : '↓';
    return `${arrow} ${numPercentage.toFixed(1)}%`;
  };

  // Helper function to get this week value
  const getThisWeekValue = (analytics, fallback) => {
    if (analytics?.thisWeekFormatted) {
      return analytics.thisWeekFormatted;
    }
    return fallback || "+0 this week";
  };

  // Get dynamic analytics data with fallbacks
  const newSubscribersAnalytics = dashboardAnalytics?.newSubscribers;
  const delinquentAnalytics = dashboardAnalytics?.delinquentSubscribers;
  const avgTimeAnalytics = dashboardAnalytics?.avgQuizCompletionTime;
  const revenueAnalytics = dashboardAnalytics?.revenue;



  const newSubscribersCount = loading.newSubscribers
    ? null
    : (newSubs && newSubs[0]?.count) || 0;

  const delinquentCount = loading.delinquent ? null : (delinquent?.length || 0);

  // Removed avgCompletionDisplay as it's no longer used

  const toCompactTime = (s) => {
    if (!s) return "0m 0s";
    const m = s.match(/(\d+)\s*min\s*(\d+)\s*sec/);
    if (m) return `${m[1]}m ${m[2]}s`;
    return s;
  };

  // Removed unused variables as we're now using dynamic analytics data

  const cards = [
    {
      icon: (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF47' }}>
          <img 
            src="/dashoboardIcons/Group.png" 
            alt="New Subscribers" 
            width="25" 
            height="25"
          />
        </div>
      ),
      title: "New Subscribers",
      value: loading.newSubscribers ? "Loading..." : `+${newSubscribersCount}`,
      stat: loading.dashboardAnalytics ? "Loading..." : formatPercentage(
        newSubscribersAnalytics?.percentage, 
        newSubscribersAnalytics?.trend
      ),
      week: loading.dashboardAnalytics ? "Loading..." : getThisWeekValue(
        newSubscribersAnalytics, 
        `+${newSubscribersCount} this week`
      ),
      bg: "bg-cyan-400",
      text: "text-[#232432]",
      highlight: true,
    },
    {
      icon: (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF47' }}>
          <img 
            src="/dashoboardIcons/Group (1).png" 
            alt="Delinquent Subscriber" 
            width="25" 
            height="25"
          />
        </div>
      ),
      title: "Delinquent Subscriber",
      value: loading.delinquent ? "Loading..." : String(delinquentCount),
      stat: loading.dashboardAnalytics ? "Loading..." : formatPercentage(
        delinquentAnalytics?.percentage, 
        delinquentAnalytics?.trend
      ),
      week: loading.dashboardAnalytics ? "Loading..." : getThisWeekValue(
        delinquentAnalytics, 
        `+${delinquentCount} this week`
      ),
      bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
      text: "text-white",
    },
    {
      icon: (
        <div className="w-12 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF47' }}>
          <img 
            src="/dashoboardIcons/Group (2).png" 
            alt="Average Quiz Completion Time" 
            width="15" 
            height="15"
          />
        </div>
      ),
      title: "Average Quiz Completion Time",
      value: loading.avgTime ? "Loading..." : toCompactTime(avgTime || "0 min 0 sec"),
      stat: loading.dashboardAnalytics ? "Loading..." : formatPercentage(
        avgTimeAnalytics?.percentage, 
        avgTimeAnalytics?.trend
      ),
      week: loading.dashboardAnalytics ? "Loading..." : getThisWeekValue(
        avgTimeAnalytics, 
        `+${toCompactTime(avgTimeAnalytics?.formatted || "0m 0s")} this week`
      ),
      bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
      text: "text-white",
    },
    {
      icon: (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF47' }}>
          <img 
            src="/dashoboardIcons/Group (2).png" 
            alt="Revenue" 
            width="15" 
            height="15"
          />
        </div>
      ),
      title: "Heading Here",
      value: loading.balance ? "Loading..." : (stripeBalance?.available?.formatted || "$0.00"),
      stat: loading.dashboardAnalytics ? "Loading..." : formatPercentage(
        revenueAnalytics?.percentage, 
        revenueAnalytics?.trend
      ),
      week: loading.dashboardAnalytics ? "Loading..." : getThisWeekValue(
        revenueAnalytics, 
        `+${revenueAnalytics?.formatted || "$0.00"} this week`
      ),
      bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
      text: "text-white",
    },
  ];

  // Show error message if analytics failed to load
  if (analyticsError?.dashboardAnalytics) {
    console.error('Dashboard analytics error:', analyticsError.dashboardAnalytics);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full mt-7 ">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`relative flex flex-col justify-between p-4 sm:p-6 min-w-0 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] max-w-full sm:max-w-xs h-[170px]  transition-all duration-200 hover:brightness-110 hover:-translate-y-1 hover:scale-105 hover:shadow-lg cursor-pointer ${card.bg} ${card.text}`}
        >
          {/* Pattern for highlight card */}
          {card.highlight && (
            <>
              {/* Background image */}
              <img
                src={Looper3}
                alt="bg pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none"
                style={{ mixBlendMode: "multiply" }}
              />
            </>
          )}
          <div className="z-10 flex items-center gap-2 mb-2">
            {card.icon}
            <span className="text-base font-medium">{card.title}</span>
          </div>
          <div className="z-10 text-2xl font-bold mb-2 ">{card.value}</div>
          <div className="z-10 flex items-end justify-between w-full mt-auto">
            <span
              className={`text-xs font-medium ${i === 0 ? "text-black" : "text-green-400"}`}
            >
              {card.stat}
            </span>
            <span className="text-xs ml-2 opacity-80">{card.week}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
