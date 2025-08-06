import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStripeProducts, upgradeSubscription } from "../../../../store/Slice/PaymentSlice";

export default function UpgradePlanPopup({ open, onClose, onUpgrade }) {
  const [plan, setPlan] = useState(null);
  const dispatch = useDispatch();
  const { status, error, products, productsLoading } = useSelector((state) => state.payment);
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    dispatch(fetchStripeProducts());
  }, [dispatch]);

  // Filter out the "Basic" plan and get the actual plans from Stripe
  const displayPlans = products.filter(
    (product) => product.plan !== "basic" && product.plan !== "Basic"
  );

  React.useEffect(() => {
    if (displayPlans.length > 0 && !plan) {
      setPlan(displayPlans[0].plan);
    }
  }, [displayPlans, plan]);

  if (!open) return null;
  if (productsLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="text-white text-xl">Loading plans...</div>
      </div>
    );
  }

  const handleUpgrade = () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }
    console.log("Upgrading to plan:", plan); // Debug log
    dispatch(upgradeSubscription({ userId, newPlan: plan }))
      .unwrap()
      .then(() => {
        if (onUpgrade) onUpgrade(plan);
      })
      .catch((error) => {
        console.error("Upgrade error:", error);
        // error handled by Redux, but can show here if needed
      });
  };

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
        {/* Plans */}
        <div className="flex flex-col gap-4 w-full mb-6">
          {displayPlans.map((p) => (
            <label
              key={p.id}
              className={`flex items-center justify-between border rounded-lg px-6 py-4 cursor-pointer transition-colors ${
                plan === p.plan
                  ? "border-cyan-400 bg-[#232432]"
                  : "border-slate-600 bg-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === p.plan}
                  onChange={() => setPlan(p.plan)}
                  className="form-radio accent-cyan-400 w-5 h-5"
                />
                <div>
                  <div className="text-white text-lg font-semibold">{p.name}</div>
                  <div className="text-slate-400 text-xs">{p.description || p.desc}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-bold">{p.price}$</div>
                <div className="text-slate-400 text-xs">per {p.interval}</div>
              </div>
            </label>
          ))}
        </div>
        {/* Error Message */}
        {error && status === "failed" && (
          <div className="text-red-400 text-sm mb-2 w-full text-center">{error}</div>
        )}
        {/* Upgrade Button */}
        <button
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold hover:bg-cyan-300 transition-colors"
          onClick={handleUpgrade}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Upgrading..." : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}
