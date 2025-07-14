import React from "react";
import BillingOverview from "../../components/subscription/BillingOverView/BillingOverview";
import BillingHistory from "../../components/subscription/BillingOverView/BillingHistory";

const BillingView = () => {
  return (
    <>
      <BillingOverview />
      <BillingHistory />
    </>
  );
};

export default BillingView;
