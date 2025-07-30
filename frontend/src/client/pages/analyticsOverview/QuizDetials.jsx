import React, { useState, useEffect } from "react";
import HeaderQuizDetails from "../../components/analyticsOverview/details/HeaderQuizDetails";
import Cards from "../../components/analyticsOverview/details/Cards";
import DetailsChart from "../../components/analyticsOverview/details/DetailsChart";
import RestrictionPopup from "../../components/ResultOverview/RestrictionPopup";

const QuizDetials = () => {
  const [showRestriction, setShowRestriction] = useState(false);

  useEffect(() => {
    const subscriptionStr = localStorage.getItem("subscription");
    let plan = null;
    if (subscriptionStr) {
      try {
        const subscription = JSON.parse(subscriptionStr);
        plan = subscription?.plan;
      } catch {
        plan = null;
      }
    }
    if (plan === "starter") {
      setShowRestriction(true);
    }
  }, []);

  return (
    <div className="bg-[#2A2A39] lg:p-8 p-2 w-full min-h-screen">
      {showRestriction && (
        <RestrictionPopup onClose={() => setShowRestriction(false)} />
      )}
      <HeaderQuizDetails />
      <Cards />
      <DetailsChart />
    </div>
  );
};

export default QuizDetials;
