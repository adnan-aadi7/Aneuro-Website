import React, { useState } from "react";

export default function UpgradePlanPopup({ open, onClose, onUpgrade }) {
  const [plan, setPlan] = useState("Growth");

  if (!open) return null;

  const plans = [
    {
      name: "Starter",
      desc: "Individuals and for tiny teams",
      price: 10,
    },
    {
      name: "Growth",
      desc: "Expanding teams",
      price: 50,
    },
    {
      name: "Enterprise",
      desc: "For huge organizations",
      price: 90,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-[#232432] shadow-lg w-[450px] max-w-lg p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Title */}
        <div className="text-white text-2xl font-bold mb-2 text-center">
          UPGRADE PLAN
        </div>
        {/* Subtitle */}
        <div className="text-slate-400 text-sm text-center mb-6">
          Select the plan that suits your business
        </div>
        {/* Toggle */}

        {/* Plans */}
        <div className="flex flex-col gap-4 w-full mb-6">
          {plans.map((p) => (
            <label
              key={p.name}
              className={`flex items-center justify-between border rounded-lg px-6 py-4 cursor-pointer transition-colors ${
                plan === p.name
                  ? "border-cyan-400 bg-[#232432]"
                  : "border-slate-600 bg-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === p.name}
                  onChange={() => setPlan(p.name)}
                  className="form-radio accent-cyan-400 w-5 h-5"
                />
                <div>
                  <div className="text-white text-lg font-semibold">
                    {p.name}
                  </div>
                  <div className="text-slate-400 text-xs">{p.desc}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-bold">{p.price}$</div>
                <div className="text-slate-400 text-xs">per month</div>
              </div>
            </label>
          ))}
        </div>
        {/* Upgrade Button */}
        <button
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold hover:bg-cyan-300 transition-colors"
          onClick={() => onUpgrade(plan)}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
