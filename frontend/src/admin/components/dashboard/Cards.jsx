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
  fetchTotalRevenue,
  selectTotalRevenueDollars,
  fetchStripeBalance,
  selectStripeBalance,
} from "../../../store/Slice/DashboardSliceAdmin";

const Cards = () => {
  const dispatch = useDispatch();

  const newSubs = useSelector(selectNewSubscribersPerWeek);
  const delinquent = useSelector(selectDelinquentSubscribers);
  const avgTime = useSelector(selectAvgQuizCompletionTime);
  const totalRevenueDollars = useSelector(selectTotalRevenueDollars);
  const stripeBalance = useSelector(selectStripeBalance);
  const loading = useSelector(selectAdminDashboardLoading);

  useEffect(() => {
    dispatch(fetchNewSubscribersPerWeek());
    dispatch(fetchDelinquentSubscribers());
    dispatch(fetchAvgQuizCompletionTime());
    dispatch(fetchTotalRevenue());
    dispatch(fetchStripeBalance());
  }, [dispatch]);

  const newSubscribersCount = loading.newSubscribers
    ? null
    : (newSubs && newSubs[0]?.count) || 0;

  const delinquentCount = loading.delinquent ? null : (delinquent?.length || 0);

  const avgCompletionDisplay = loading.avgTime ? null : (avgTime || "0 min 0 sec");

  const toCompactTime = (s) => {
    if (!s) return "0m 0s";
    const m = s.match(/(\d+)\s*min\s*(\d+)\s*sec/);
    if (m) return `${m[1]}m ${m[2]}s`;
    return s;
  };

  const revenueDisplay = loading.revenue
    ? "Loading..."
    : (totalRevenueDollars ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

  const availableBalanceDisplay = loading.balance
    ? "Loading..."
    : (stripeBalance?.available?.formatted || revenueDisplay);

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
      stat: "↑ 20.9%",
      week: loading.newSubscribers ? "" : `+${newSubscribersCount} this week`,
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
      stat: "↑ 20.9%",
      week: "+18.4K this week",
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
      value: loading.avgTime ? "Loading..." : toCompactTime(avgCompletionDisplay),
      stat: "↑ 20.9%",
      week: "+18.4K this week",
      bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
      text: "text-white",
    },
    {
      icon: (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFFFF47' }}>
          <img 
            src="/dashoboardIcons/Group (2).png" 
            alt="Heading Here" 
            width="15" 
            height="15"
          />
        </div>
      ),
      title: "Heading Here",
      value: availableBalanceDisplay,
      stat: "↑ 20.9%",
      week: "+18.4K this week",
      bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
      text: "text-white",
    },
  ];

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
