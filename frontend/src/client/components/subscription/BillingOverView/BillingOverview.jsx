import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSubscription, fetchStripeProducts } from "../../../../store/Slice/PaymentSlice";
import UpgradePlanPopup from "./UpdradePlanPopup";

const BillingOverview = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const dispatch = useDispatch();
  const { userSubscription, userSubscriptionLoading, products } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchUserSubscription());
    dispatch(fetchStripeProducts());
  }, [dispatch]);

  // Get current plan details from Stripe products
  const getCurrentPlanDetails = () => {
    if (!userSubscription?.plan || !products.length) return null;
    
    const planProduct = products.find(
      product => (product.metadata?.plan || product.name.toLowerCase()) === userSubscription.plan
    );
    
    return planProduct ? {
      name: planProduct.name,
      price: planProduct.price,
      description: planProduct.description || `Our popular plan for ${userSubscription.plan} users`
    } : null;
  };

  const currentPlan = getCurrentPlanDetails();

  return (
    <div className=" text-white ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Billing Overview</h1>
          <p className="text-gray-300 text-lg">
            Easily manage your subscription plan, view billing history,
            <br />
            and upgrade your account with a few clicks
          </p>
        </div>

        {/* Show UpgradePlanPopup */}
        <UpgradePlanPopup
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            setShowUpgradeModal(false);
            // Refresh subscription data after upgrade
            dispatch(fetchUserSubscription());
          }}
        />

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Plan Card */}
          <div className="bg-[#2A2A39]  p-6 relative overflow-hidden">
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
                    {userSubscriptionLoading ? "Loading..." : (currentPlan?.name || "No Plan")}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userSubscription?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userSubscription?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  {currentPlan?.description || "No active subscription"}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-white text-4xl font-bold">
                  {userSubscriptionLoading ? "..." : (currentPlan?.price ? `$${currentPlan.price}` : "N/A")}
                </div>
                <div className="text-slate-400 text-sm">per month</div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="mb-6">
              <div className="text-white text-sm font-medium mb-2">
                Subscription Status
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    userSubscription?.status === 'active' ? 'bg-teal-400' : 'bg-red-400'
                  }`}
                  style={{ width: userSubscription?.status === 'active' ? "100%" : "0%" }}
                ></div>
              </div>
            </div>

            {/* Upgrade Button - only show if user has active subscription */}
            {userSubscription?.status === 'active' && (
              <button
                className="bg-transparent border border-slate-600 text-slate-300 py-2 px-4  hover:bg-slate-600 hover:text-white transition-colors text-sm font-medium"
                onClick={() => setShowUpgradeModal(true)}
              >
                Upgrade plan
              </button>
            )}
          </div>

          {/* Payment Method Card */}
          <div className="bg-[#2A2A39]  p-6 relative overflow-hidden flex flex-col">
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
              <button className="bg-[#12DCF0] text-[#232432] px-6 md:px-13 py-2  text-base md:text-lg font-semibold hover:bg-cyan-300 transition-colors shadow-none">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingOverview;
