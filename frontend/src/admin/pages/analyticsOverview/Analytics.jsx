import React from "react";
import Header from "../../components/analytics/dashboardStats/Header";
import EmailSequencesStats from "../../components/analytics/dashboardStats/EmailSequencesStats";
import PromptStats from "../../components/analytics/dashboardStats/PromptStats";
import FunnelStats from "../../components/analytics/dashboardStats/FunnelStats";
import SehduleStats from "../../components/analytics/dashboardStats/SehduleStats";

const Analytics = () => {
  return (
    <>
      <Header />
      <EmailSequencesStats />
      <PromptStats />
      <FunnelStats />
      <SehduleStats />
    </>
  );
};

export default Analytics;
