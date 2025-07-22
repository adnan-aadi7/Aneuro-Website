import React from "react";

// Make sure to import the image
import Looper3 from "../../../assets/resultOverView/Looper-3.png";
import VectorIcon from "../../../assets/resultOverView/vector.png";
import { BsCloudCheck } from "react-icons/bs";
import { TbGitBranch } from "react-icons/tb";

const cards = [
  {
    type: "highlight",
    icon: (
      <img src={VectorIcon} alt="icon" className="w-9 h-9 object-contain" />
    ),
    title: "Welcome_10off",
    subtitle: "This week's highest performing campaign based on completions.",
    value: 84,
    valueLabel: "Completion",
    week: "↑ Week 1",
    bg: "bg-[#12DCF0]",
    text: "text-[#232432]",
    pattern: true,
    bgImage: true,
  },
  {
    icon: <TbGitBranch size={32} className="text-white" />,
    title: "Recently Added Tools",
    subtitle: "New tools has been uploaded by Aneuro Admin",
    value: "02",
    valueLabel: "tools",
    week: "↑ Week 1",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M8.5 15.5l7-7"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="2"
            y="12"
            width="8"
            height="8"
            rx="4"
            stroke="#fff"
            strokeWidth="2"
          />
          <rect
            x="14"
            y="4"
            width="8"
            height="8"
            rx="4"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>
      </div>
    ),
    title: "Quick Access Link",
    subtitle: (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#B0B3C7] break-all">
          https://aneuro.com/quiz/your-link
        </span>
        <button className="p-1 hover:bg-white/10 rounded" title="Copy Link">
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              stroke="#12DCF0"
              strokeWidth="2"
            />
            <rect
              x="3"
              y="3"
              width="13"
              height="13"
              rx="2"
              stroke="#12DCF0"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button className="p-1 hover:bg-white/10 rounded" title="Edit Link">
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M16.862 3.487a2.5 2.5 0 1 1 3.535 3.535l-12.02 12.02a2 2 0 0 1-.708.464l-4.243 1.415 1.415-4.243a2 2 0 0 1 .464-.708l12.02-12.02z"
              stroke="#12DCF0"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    ),
    value: 78,
    valueLabel: "Copied",
    week: "↑ Week 1",
    actions: false, // actions handled in subtitle now
    custom: true, // flag for custom rendering if needed
  },
  {
    icon: <BsCloudCheck size={32} className="text-white" />,
    title: "Reflective Thinkers",
    subtitle: "Want to follow up with them while engagement is high?",
    value: null,
    valueLabel: null,
    week: "↑ Week 1",
    button: "Reflective Sequence",
  },
];

const Cards = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mt-7">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between p-5 min-w-[280px] w-full max-w-sm h-[200px] relative transition-all duration-200 hover:brightness-110 hover:-translate-y-1 hover:scale-105 hover:shadow-lg cursor-pointer ${
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
