import React, { useState } from "react";
import Payment from "./Payment";

const CYAN = "#12DCF0";

const plans = [
  {
    name: "Starter",
    price: "97",
    description: "Individuals and for tiny teams",
  },
  {
    name: "Growth",
    price: "297",
    description: "Expanding teams",
  },
  {
    name: "Enterprise",
    price: "1,999",
    description: "For huge organizations",
  },
];

const SelectPlanPopup = ({ onClose }) => {
  const [selected, setSelected] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  if (showPayment) {
    return <Payment onClose={() => setShowPayment(false)} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="relative bg-black rounded-lg p-6 w-full max-w-md mx-auto"
        style={{ boxShadow: `0 0 80px 10px ${CYAN}40` }}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-white text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Heading */}
        <h2 className="text-white text-2xl font-bold text-center mb-2 tracking-wide">
          SELECT YOUR PLAN
        </h2>
        <p className="text-gray-300 text-center text-sm mb-4">
          You'll complete payment and then create your account to get started.
        </p>
        {/* Plan options */}
        <div className="flex flex-col gap-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`flex items-center rounded border px-6 py-5 cursor-pointer transition-all ${
                selected === idx ? "border-cyan-400" : "border-gray-600"
              }`}
              style={
                selected === idx
                  ? { borderColor: CYAN, boxShadow: `0 0 0 1.5px ${CYAN}` }
                  : {}
              }
              onClick={() => setSelected(idx)}
            >
              {/* Custom radio */}
              <span className="mr-5 flex items-center justify-center">
                <span
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    selected === idx ? "border-cyan-400" : "border-gray-500"
                  }`}
                  style={selected === idx ? { borderColor: CYAN } : {}}
                >
                  {selected === idx && (
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ background: CYAN }}
                    />
                  )}
                </span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-bold">
                    {plan.name}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {plan.description}
                </div>
              </div>
              <div className="flex flex-col items-end ml-6">
                <span className="text-white text-3xl font-bold leading-none">
                  {plan.price}$
                </span>
                <span className="text-gray-400 text-xs mt-1">per month</span>
              </div>
            </div>
          ))}
        </div>
        {/* Continue button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-3 px-10 rounded transition-colors duration-200"
            style={{ background: CYAN }}
            onClick={() => setShowPayment(true)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlanPopup;
