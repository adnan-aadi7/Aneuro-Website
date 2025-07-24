import React from "react";
import Looper3 from "../../../assets/resultOverView/Looper-3.png";

const cards = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#12DCF0" fillOpacity="0.2" />
        <path
          d="M16 8v8l5 3"
          stroke="#232432"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="7" stroke="#232432" strokeWidth="2" />
      </svg>
    ),
    title: "New Subscribers",
    value: "+124",
    stat: "↑ 20.9%",
    week: "+18.4K this week",
    bg: "bg-cyan-400",
    text: "text-[#232432]",
    highlight: true,
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="#fff"
          strokeWidth="2"
          fill="#fff"
          fillOpacity="0.08"
        />
        <path
          d="M10 18c0-2 4-2 4 0m4 0c0-2 4-2 4 0"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="14" r="2" fill="#fff" fillOpacity="0.5" />
        <circle cx="20" cy="14" r="2" fill="#fff" fillOpacity="0.5" />
      </svg>
    ),
    title: "Delinquent Subscriber",
    value: "25",
    stat: "↑ 20.9%",
    week: "+18.4K this week",
    bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
    text: "text-white",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect
          x="8"
          y="8"
          width="16"
          height="16"
          rx="4"
          fill="#fff"
          fillOpacity="0.08"
        />
        <path
          d="M12 16h8M16 12v8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Average Quiz Completion Time",
    value: "2m 14s",
    stat: "↑ 20.9%",
    week: "+18.4K this week",
    bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
    text: "text-white",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect
          x="8"
          y="8"
          width="16"
          height="16"
          rx="4"
          fill="#fff"
          fillOpacity="0.08"
        />
        <path
          d="M16 12v8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Heading Here",
    value: "$825,491.73",
    stat: "↑ 20.9%",
    week: "+18.4K this week",
    bg: "bg-gradient-to-br from-[#232432] to-[#19343B]",
    text: "text-white",
  },
];

const Cards = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full mt-7">
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
          <div className="z-10 text-3xl font-bold mb-2 px-8">{card.value}</div>
          <div className="z-10 flex items-end justify-between w-full mt-auto">
            <span
              className={`text-xs font-medium ${
                i === 0 ? "text-black" : "text-green-400"
              }`}
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
