import React from "react";

export default function SubscriptionTierExact() {
  return (
    <div className="w-full bg-[#2A2A39] ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-medium mb-2">
          Subscription Tier
        </h1>
        <p className="text-slate-400 text-sm">
          Download your previous plan receipts and useage details
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-2 gap-6">
        {/* Starter Plan Card */}
        <div className="bg-[#16161C] rounded-lg p-6 relative overflow-hidden">
          {/* Cyan blurred glow bottom right */}
          <div
            className="absolute right-0 bottom-0 w-40 h-40"
            style={{ pointerEvents: "none" }}
          >
            <div className="w-full h-full rounded-full bg-[#12DCF0] opacity-30 blur-[80px]" />
          </div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-white text-xl font-medium">Starter Plan</h2>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Our popular plan for small teams
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="text-white text-4xl font-bold">10$</div>
              <div className="text-slate-400 text-sm">per month</div>
            </div>
          </div>

          {/* Usage Section */}
          <div className="mb-6">
            <div className="text-white text-sm font-medium mb-2">
              10 of 20 users
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div
                className="bg-teal-400 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          {/* Upgrade Button */}
          <button className="bg-transparent border border-slate-600 text-slate-300 py-2 px-4 rounded-md hover:bg-slate-600 hover:text-white transition-colors text-sm font-medium">
            Upgrade plan
          </button>
        </div>

        {/* Payment Method Card */}
        <div className="bg-[#16161C] rounded-lg p-6 relative overflow-hidden flex flex-col">
          {/* Cyan blurred glow bottom right */}
          <div
            className="absolute right-0 bottom-0 w-40 h-40"
            style={{ pointerEvents: "none" }}
          >
            <div className="w-full h-full rounded-full bg-[#12DCF0] opacity-30 blur-[80px]" />
          </div>
          <div className="mb-6">
            <h2 className="text-white text-xl font-medium mb-2">
              Payment Method
            </h2>
            <p className="text-slate-400 text-sm">
              Change how you pay for your plan
            </p>
          </div>
          <div className="flex items-center justify-between w-full mt-2">
            {/* Left: VISA info */}
            <div className="flex items-center gap-4">
              <div className="bg-[#232886] rounded w-[70px] h-[40px] flex items-center justify-center">
                <span
                  className="text-white text-2xl font-bold tracking-widest"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  VISA
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-white text-lg font-medium leading-tight">
                  Visa ending in 1234
                </span>
                <span className="text-slate-400 text-sm leading-tight">
                  Expiry 20/2025
                </span>
              </div>
            </div>
            {/* Right: Edit button */}
            <button className="bg-[#12DCF0] text-[#232432] px-13 py-2 rounded text-lg font-semibold hover:bg-cyan-300 transition-colors shadow-none">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
