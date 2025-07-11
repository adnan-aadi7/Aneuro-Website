import React, { useState } from "react";
import { Minus } from "lucide-react";
import GroupImg from "../../../assets/subscription/Group.png";

const CYAN = "#12DCF0";

const features = [
  {
    name: "Quiz Link Access",
    starter: { text: "Basic access", available: true },
    growth: { text: "Custom embed link", available: true },
    enterprise: { text: "White-labeled quiz links", available: true },
  },
  {
    name: "Audience Brain Type",
    starter: { text: "Overview only", available: true },
    growth: { text: "Segmentation view", available: true },
    enterprise: { text: "Advanced exportable data", available: true },
  },
  {
    name: "CRM Integration",
    starter: { text: "Not available", available: false },
    growth: { text: "Not available", available: false },
    enterprise: { text: "Full integration", available: true },
  },
  {
    name: "Prompt Packs",
    starter: { text: "5 basic prompts", available: true },
    growth: { text: "15 basic prompts", available: true },
    enterprise: { text: "Access to Unlimited Prompts", available: true },
  },
  {
    name: "Team Seats",
    starter: { text: "Not available", available: false },
    growth: { text: "Not available", available: false },
    enterprise: { text: "Multi-user access", available: true },
  },
  {
    name: "Funnel Templates",
    starter: { text: "2 funnels", available: true },
    growth: { text: "5 funnels", available: true },
    enterprise: { text: "All templates unlocked", available: true },
  },
];

const plans = [
  { name: "Basic", price: "50" },
  { name: "Starter", price: "97" },
  { name: "Growth", price: "297" },
  { name: "Enterprise", price: "1,999" },
];

const CheckMark = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-3 flex-shrink-0"
    style={{ minWidth: 24, minHeight: 24 }}
  >
    <circle cx="16" cy="16" r="16" fill="#12DCF0" />
    <path
      d="M10 16.5L14 20.5L22 12.5"
      stroke="#111"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SubscriptionPlan = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className=" flex flex-col items-center justify-center py-8 px-2">
      {/* Popup */}
      {showPopup && <SelectPlanPopup onClose={() => setShowPopup(false)} />}
      {/* Main content hidden when popup is open */}
      {!showPopup && (
        <>
          <div className=" flex justify-center w-full">
            {/* Sidebar - overlapping using flex, not absolute */}
            <div
              className="hidden md:flex flex-col items-start bg-[#2A2A39] p-8 rounded-lg w-[280px] h-[400px] z-10 mt-40"
              style={{
                minWidth: 270,
                border: `2px solid ${CYAN}`,
                marginRight: "-200px", // float sidebar further left
                boxShadow: `inset 0 0 40px 0 ${CYAN}40`,
              }}
            >
              <div className="flex flex-col gap-6 w-full">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="text-white text-lg font-medium py-1 px-2 w-full text-left"
                  >
                    {feature.name}
                  </div>
                ))}
              </div>
            </div>
            {/* Main Table - with left margin for sidebar overlap */}
            <div
              className="relative w-full max-w-full mx-auto bg-[#2A2A39]  shadow-2xl overflow-hidden px-2 sm:px-4 md:px-12"
              style={{
                marginLeft: "0",
                marginRight: "0",
              }}
            >
              {/* Plan headers */}
              <div className="grid grid-cols-3 md:grid-cols-4">
                {/* Basic plan: only icon, wider column, hidden on small screens */}
                <div className="hidden md:flex flex-col items-start py-4 w-64">
                  <img
                    src={GroupImg}
                    alt="Basic Plan"
                    className="w-32 h-32 object-contain my-2"
                  />
                </div>
                {/* Other plans */}
                {plans.slice(1).map((plan) => (
                  <div
                    key={plan.name}
                    className="flex flex-col items-center py-4 md:py-8"
                  >
                    <h3 className="text-white text-lg md:text-2xl font-bold mb-1 md:mb-2 tracking-wide text-center">
                      {plan.name}
                    </h3>
                    <div
                      className="w-10 h-1 md:w-16 rounded-full mb-2 md:mb-4"
                      style={{ background: CYAN }}
                    />
                    <div className="flex items-end justify-center mb-0">
                      <span className="text-3xl md:text-5xl font-bold text-white leading-none">
                        {plan.price}
                      </span>
                      <span className="text-base md:text-xl font-bold ml-1 mb-1 text-gray-200">
                        $
                      </span>
                      <span className="text-gray-400 text-xs md:text-base ml-2">
                        per month
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Feature rows */}
              <div className="divide-y divide-gray-700">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="grid grid-cols-3 md:grid-cols-4 min-h-[40px] md:min-h-[48px] items-center"
                  >
                    {/* Basic column: empty, hidden on small screens */}
                    <div className="hidden md:block" />
                    {/* Other plans */}
                    {[feature.starter, feature.growth, feature.enterprise].map(
                      (col, colIdx) => (
                        <div
                          key={colIdx}
                          className="flex items-center py-1 md:py-2 px-2 md:px-6"
                        >
                          {col.available ? (
                            <CheckMark />
                          ) : (
                            <Minus
                              className="w-5 h-5 mr-2 md:mr-3 flex-shrink-0"
                              style={{ color: CYAN }}
                            />
                          )}
                          <span
                            className={`text-xs md:text-base ${
                              col.available ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {col.text}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
              {/* Buttons */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6 mt-4 md:mt-6 px-2 md:px-4 pb-4 md:pb-6">
                {/* Basic column: no button, hidden on small screens */}
                <div className="hidden md:block" />
                {/* Other plans */}
                {plans.slice(1).map((plan) => (
                  <button
                    key={plan.name}
                    className="w-full text-black font-semibold py-2 md:py-3 px-2 md:px-6 rounded transition-colors duration-200 cursor-pointer text-xs md:text-base"
                    style={{ background: CYAN }}
                    onClick={() => setShowPopup(true)}
                  >
                    Get Started
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionPlan;
