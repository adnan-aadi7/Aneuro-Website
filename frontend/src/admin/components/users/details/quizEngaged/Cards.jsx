import React from "react";
import { useSelector } from "react-redux";
import { selectQuizAnalytics } from "../../../../../store/Slice/QuizSlice";
import Looper3 from "../../../../../assets/resultOverView/Looper-3.png";
import VectorIcon from "../../../../../assets/resultOverView/vector.png";
import { BsCloudCheck } from "react-icons/bs";
import { TbGitBranch } from "react-icons/tb";

const staticCards = [
  {
    type: "highlight",
    icon: (
      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M8 12h8" stroke="#232432" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 8v8" stroke="#232432" strokeWidth="2" strokeLinecap="round" />
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#232432" strokeWidth="2" />
        </svg>
      </div>
    ),
    title: "Total Links Generated",
    value: null,
    valueLabel: "Times",
    week: "↑ Week 1",
    bg: "bg-[#12DCF0]",
    text: "text-[#232432]",
    pattern: true,
    bgImage: true,
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    title: "Total Unique Clicks",
    value: null,
    valueLabel: "Times",
    week: "↑ Week 1",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="#fff" strokeWidth="2" />
        </svg>
      </div>
    ),
    title: "Completed Quizzes",
    value: null,
    valueLabel: "Submitted",
    week: "↑ Week 1",
    actions: false,
    custom: true,
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="5" stroke="#fff" strokeWidth="2" />
          <path d="M20 21c0-4.41-3.59-8-8-8s-8 3.59-8 8" stroke="#fff" strokeWidth="2" />
          <path d="M15 5l1 1 1-1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    title: "Completion Rate",
    value: null,
    valueLabel: null,
    week: "↑ Week 1",
  },
];

const Cards = () => {
  const analytics = useSelector(selectQuizAnalytics);

  const cardValues = {
    totalLinks: analytics?.linksGenerated ?? 0,
    uniqueClicks: analytics?.uniqueClicks ?? 0,
    completedQuizzes: analytics?.completedQuizzes ?? 0,
    completionRate: analytics?.completionRate ?? 0,
  };

  const cards = [
    { ...staticCards[0], value: cardValues.totalLinks },
    { ...staticCards[1], value: cardValues.uniqueClicks },
    { ...staticCards[2], value: cardValues.completedQuizzes },
    { ...staticCards[3], value: cardValues.completionRate },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mt-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between p-5  w-full relative transition-all duration-200 hover:brightness-110 hover:-translate-y-1 hover:scale-105 hover:shadow-lg cursor-pointer ${
            card.bg || "bg-gradient-to-r from-[#232432] to-[#19343B]"
          } ${card.text || "text-white"}`}
        >
          {/* Background image for the first card only */}
          {card.bgImage && (
            <img
              src={Looper3}
              alt="bg pattern"
              className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none"
              style={{ mixBlendMode: "multiply" }}
            />
          )}
          {/* Pattern for highlight card */}
          {card.pattern && (
            <div
              className="absolute inset-0 z-0 opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, #fff 0%, #12DCF0 30%, transparent 70%)",
              }}
            />
          )}
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">{card.icon}</div>
            <div className="text-lg font-semibold mb-1">{card.title}</div>
            {/* Custom subtitle for 3rd card */}
            {card.custom ? (
              <div className="mb-3">{card.subtitle}</div>
            ) : (
              <div className="text-xs mb-3 opacity-80">{card.subtitle}</div>
            )}
          </div>
          <div className="z-10 flex items-end justify-between w-full">
            {card.value !== null && (
              <div>
                <span className="text-5xl font-bold leading-none">
                  {card.value}
                </span>
                <span className="text-sm ml-1 font-medium opacity-80">
                  {card.valueLabel}
                </span>
              </div>
            )}
            {card.button && (
              <button className="bg-[#12DCF0] text-[#232432] font-semibold px-3 py-2 text-sm ">
                {card.button}
              </button>
            )}
            {/* Remove actions for 3rd card, handled in subtitle */}
            {card.actions && !card.custom && (
              <div className="flex gap-2 ml-2">
                <button className="p-1 hover:bg-white/10 rounded">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <rect
                      x="3"
                      y="3"
                      width="10"
                      height="10"
                      rx="2"
                      stroke="#fff"
                      strokeWidth="1.2"
                    />
                  </svg>
                </button>
                <button className="p-1 hover:bg-white/10 rounded">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M5 8h6"
                      stroke="#fff"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
            {card.week && (
              <span
                className={`text-xs font-medium ml-auto self-end ${
                  i === 0 ? "text-black" : "text-green-400"
                }`}
              >
                {card.week}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
