import React, { useState } from "react";
import GeneralDetails from "../generalDetails/GeneralDetails";
import SubscriptionTierExact from "../subscriptionTier/SubscriptionTierExact";
import BillingHistoryTable from "../subscriptionTier/BillingHistoryTable";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("General Details");

  const tabs = ["General Details", "Subscription Tier", "Quiz Engagement"];

  return (
    <div className="w-full bg-[#2A2A39]p-6 mt-10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-600">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=56&h=56&fit=crop&crop=face"
              alt="Devon Lane"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="w-full h-full bg-[#2A2A39] rounded-full flex items-center justify-center text-white text-lg font-medium"
              style={{ display: "none" }}
            >
              DL
            </div>
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold">Devon Lane</h1>
            <p className="text-slate-400 text-sm">yourname@gmail.com</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 ">
          <button className="px-4 py-2 bg-transparent border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium">
            Delete Account
          </button>
          <button className="px-4 py-2 bg-transparent border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium">
            Reset Password
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-20 border-b border-slate-700 mt-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {activeTab === "General Details" && (
        <div className="mt-8 flex justify-start">
          <GeneralDetails />
        </div>
      )}
      {activeTab === "Subscription Tier" && (
        <div className="mt-8 flex flex-col gap-8">
          <SubscriptionTierExact />
          <BillingHistoryTable />
        </div>
      )}
    </div>
  );
}
