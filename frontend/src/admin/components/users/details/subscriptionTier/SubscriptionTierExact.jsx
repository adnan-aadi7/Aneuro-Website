import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStripeProducts, upgradeSubscription } from "../../../../../store/Slice/PaymentSlice";
import UpgradePlan from "./upgradePlans/UpgradePlan";
import UpgradeConfirmationPopup from "./upgradePlans/UpgradeConfirmationPopup";

export default function SubscriptionTierExact({ user }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [upgradeError, setUpgradeError] = useState(null);
  const dispatch = useDispatch();
  const { products, productsLoading } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchStripeProducts());
  }, [dispatch]);

  const handleUpgrade = async (plan) => {
    setSelectedPlan(plan);
    setUpgradeError(null);

    try {
      // Call the upgrade API
      await dispatch(upgradeSubscription({ 
        userId: user._id, 
        newPlan: plan 
      })).unwrap();
      
      // Close the modal after successful upgrade
      setShowUpgrade(false);
      
      // Show success popup
      setShowConfirmation(true);
    } catch (err) {
      setUpgradeError(err.message || "Upgrade failed");
      console.error("Upgrade error:", err);
      // Don't close modal on error, let user retry
    }
  };

  // Find the user's current plan from Stripe products
  const getUserPlanPrice = () => {
    if (!products || products.length === 0) {
      return user?.subscription?.price || "10$";
    }

    const userPlan = user?.subscription?.plan;
    if (!userPlan) {
      return "10$";
    }

    // Find matching plan from Stripe products
    const matchingPlan = products.find(product => 
      product.plan.toLowerCase() === userPlan.toLowerCase() ||
      product.name.toLowerCase() === userPlan.toLowerCase()
    );

    return matchingPlan ? `$${matchingPlan.price}` : (user?.subscription?.price ? `$${user.subscription.price}` : "10$");
  };

  const getUserPlanName = () => {
    if (!products || products.length === 0) {
      return user?.subscription?.plan || "Starter Plan";
    }

    const userPlan = user?.subscription?.plan;
    if (!userPlan) {
      return "Starter Plan";
    }

    // Find matching plan from Stripe products
    const matchingPlan = products.find(product => 
      product.plan.toLowerCase() === userPlan.toLowerCase() ||
      product.name.toLowerCase() === userPlan.toLowerCase()
    );

    return matchingPlan ? matchingPlan.name : (user?.subscription?.plan || "Starter Plan");
  };

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

      {/* Error Message */}
      {upgradeError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {upgradeError}
        </div>
      )}

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h2 className="text-white text-xl font-medium">
                  {productsLoading ? "Loading..." : getUserPlanName()}
                </h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user?.subscription?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {user?.subscription?.status ? user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1) : "Inactive"}
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Our popular plan for small teams
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="text-white text-4xl font-bold">
                {productsLoading ? "..." : getUserPlanPrice()}
              </div>
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
          <button
            className="bg-transparent border border-slate-600 text-slate-300 py-2 px-4 rounded-md hover:bg-slate-600 hover:text-white transition-colors text-sm font-medium"
            onClick={() => setShowUpgrade(true)}
          >
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
            <h2 className="text-white text-base md:text-xl font-medium mb-2">
              Payment Method
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Change how you pay for your plan
            </p>
          </div>
          <div className="flex items-center justify-between w-full mt-2">
            {/* Left: VISA info */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-[#232886] rounded w-[60px] md:w-[70px] h-[32px] md:h-[40px] flex items-center justify-center">
                <span
                  className="text-white text-lg md:text-2xl font-bold tracking-widest"
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                >
                  VISA
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-white text-sm md:text-lg font-medium leading-tight">
                  Visa ending in 1234
                </span>
                <span className="text-slate-400 text-xs md:text-sm leading-tight">
                  Expiry 20/2025
                </span>
              </div>
            </div>
            {/* Right: Edit button */}
            <button className="bg-[#12DCF0] text-[#232432] px-6 md:px-13 py-2 rounded text-base md:text-lg font-semibold hover:bg-cyan-300 transition-colors shadow-none">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* UpgradePlan Modal */}
      <UpgradePlan
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={handleUpgrade}
      />

      {/* UpgradeConfirmationPopup Modal */}
      <UpgradeConfirmationPopup
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        plan={selectedPlan}
      />
    </div>
  );
}
