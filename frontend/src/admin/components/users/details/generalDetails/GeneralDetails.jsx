import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SuspendPopup from "./SuspendPopup";
import ReActivatedPupup from "./ReActivatedPupup";

export default function GeneralDetails({ user: userProp }) {
  const location = useLocation();
  // Prefer prop, fallback to location.state.user
  const user = userProp || location.state?.user || {};
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
            // cy="12"
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
      value: user?._id || "N/A",
    },
    {
      label: "Email account",
      value: user?.email || "N/A",
    },
    {
      label: "Subscription Tier",
      value: user.subscription?.plan || "N/A",
    },
    {
      label: "Signup Date",
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    },
    {
      label: "Quiz Engagement",
      value: `${user?.quizProgress || 0}%`,
      type: "progress",
      percentage: user?.quizProgress || 0,
    },
  ];

  return (
    <div className="w-full sm:max-w-lg bg-[#2A2A39] p-3 sm:p-6 space-y-6">
      {formFields.map((field, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white text-sm font-medium">{field.label}</label>
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

      {/* Buttons */}
      <div className="pt-4 flex flex-row gap-3">
        <button
          onClick={() => setShowSuspend(true)}
          className="px-2 sm:px-4 py-2 bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
        >
          Suspend Account
        </button>
        <button
          onClick={() => setShowReactivate(true)}
          className="px-3 sm:px-4 py-2 bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
        >
          Activate Account
        </button>
      </div>

      <SuspendPopup open={showSuspend} onClose={() => setShowSuspend(false)} />
      <ReActivatedPupup open={showReactivate} onClose={() => setShowReactivate(false)} />
    </div>
  );
}
