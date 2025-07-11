import React, { useState } from "react";
import SuspendPopup from "./SuspendPopup";
import ReActivatedPupup from "./ReActivatedPupup";

export default function GeneralDetails() {
  const [showSuspend, setShowSuspend] = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);
  const CircularProgress = ({ percentage }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-6 h-6">
        <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="#374151"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const formFields = [
    {
      label: "User ID",
      value: "#45674",
      type: "text",
    },
    {
      label: "Email account",
      value: "yourname@gmail.com",
      type: "email",
    },
    {
      label: "Subscription Tier",
      value: "Starter",
      type: "text",
    },
    {
      label: "Signup Date",
      value: "06/11/2025",
      type: "text",
    },
    {
      label: "Quiz Engagement",
      value: "50%",
      type: "progress",
      percentage: 50,
    },
  ];

  return (
    <div className="w-full sm:max-w-lg bg-[#2A2A39] p-3 sm:p-6 space-y-6">
      {/* Form Fields */}
      {formFields.map((field, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white text-sm font-medium">
              {field.label}
            </label>
            <div className="flex items-center gap-2">
              {field.type === "progress" ? (
                <>
                  <span className="text-slate-300 text-sm">{field.value}</span>
                  <CircularProgress percentage={field.percentage} />
                </>
              ) : (
                <span className="text-slate-300 text-sm">{field.value}</span>
              )}
            </div>
          </div>
          <hr className="border-slate-600" />
        </div>
      ))}

      {/* Suspend Account Button */}
      <div className="pt-4 flex flex-row gap-3">
        <button
          className="px-2 sm:px-4 py-2 bg-transparent border border-slate-600 text-slate-300  hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
          onClick={() => setShowSuspend(true)}
        >
          Suspend Account
        </button>
        <button
          className="px-3 sm:px-4 py-2 bg-transparent border border-slate-600 text-slate-300  hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
          onClick={() => setShowReactivate(true)}
        >
          Activate Account
        </button>
      </div>
      <SuspendPopup open={showSuspend} onClose={() => setShowSuspend(false)} />
      <ReActivatedPupup
        open={showReactivate}
        onClose={() => setShowReactivate(false)}
      />
    </div>
  );
}
