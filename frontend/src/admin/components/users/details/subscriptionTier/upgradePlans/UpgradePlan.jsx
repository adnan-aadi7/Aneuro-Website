import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStripeProducts } from "../../../../../../store/Slice/PaymentSlice";

export default function UpgradePlan({ open, onClose, onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [toggle, setToggle] = useState(true); // true = Growth, false = Current
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const dispatch = useDispatch();
  const { products, productsLoading } = useSelector((state) => state.payment);

  useEffect(() => {
    if (open) {
      dispatch(fetchStripeProducts());
    }
  }, [open, dispatch]);

  // Set default selected plan when products load
  useEffect(() => {
    if (products.length > 0 && !selectedPlan) {
      const displayPlans = products.filter(
        (product) => product.plan !== "basic" && product.plan !== "Basic"
      );
      if (displayPlans.length > 0) {
        setSelectedPlan(displayPlans[0].plan);
      }
    }
  }, [products, selectedPlan]);

  const handleUpgradeClick = async () => {
    if (!selectedPlan) return;
    setUpgradeLoading(true);
    try {
      await onUpgrade(selectedPlan); // This should be awaited and modal should not close until done
    } catch (error) {
      // Optionally show error in modal
      console.error("Upgrade error:", error);
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (!open) return null;

  // Filter out the "Basic" plan and get the actual plans from Stripe
  const displayPlans = products.filter(
    (product) => product.plan !== "basic" && product.plan !== "Basic"
  );

  // Use dynamic plans from Stripe, fallback to hardcoded if loading
  const plans = productsLoading ? [
    {
      name: "Starter",
      desc: "Individuals and for tiny teams",
      price: 10,
      plan: "starter"
    },
    {
      name: "Growth",
      desc: "Expanding teams",
      price: 50,
      plan: "growth"
    },
    {
      name: "Enterprise",
      desc: "For huge organizations",
      price: 90,
      plan: "enterprise"
    },
  ] : displayPlans.map(product => ({
    name: product.name,
    desc: product.description || "Plan description",
    price: product.price,
    plan: product.plan
  }));

  const handlePlanSelect = (planValue) => {
    setSelectedPlan(planValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-[#232432] shadow-lg w-[450px] max-w-lg p-10 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
          disabled={upgradeLoading}
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
        <div className="flex items-center gap-2 mb-6 self-end">
          <span
            className={`text-sm font-medium ${
              !toggle ? "text-white" : "text-slate-400"
            }`}
          >
            Current
          </span>
          <button
            className={`w-12 h-6 flex items-center rounded-full p-1 ${
              toggle ? "bg-cyan-400" : "bg-slate-600"
            }`}
            onClick={() => setToggle(!toggle)}
            style={{ transition: "background 0.2s" }}
            disabled={upgradeLoading}
          >
            <span
              className={`h-4 w-4 bg-white rounded-full shadow-md transform ${
                toggle ? "translate-x-6" : "translate-x-0"
              }`}
              style={{ transition: "transform 0.2s" }}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              toggle ? "text-white" : "text-slate-400"
            }`}
          >
            Growth
          </span>
        </div>
        {/* Plans */}
        <div className="flex flex-col gap-4 w-full mb-6">
          {plans.map((p) => (
            <label
              key={p.plan}
              className={`flex items-center justify-between border rounded-lg px-6 py-4 cursor-pointer transition-colors ${
                selectedPlan === p.plan
                  ? "border-cyan-400 bg-[#232432]"
                  : "border-slate-600 bg-transparent"
              } ${upgradeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlan === p.plan}
                  onChange={() => handlePlanSelect(p.plan)}
                  className="form-radio accent-cyan-400 w-5 h-5"
                  disabled={upgradeLoading}
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
          className="w-full py-3 bg-cyan-400 text-[#232432] font-semibold hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={handleUpgradeClick}
          disabled={upgradeLoading || !selectedPlan}
        >
          {upgradeLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#232432]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Upgrading...
            </>
          ) : (
            "Upgrade Now"
          )}
        </button>
      </div>
    </div>
  );
}
