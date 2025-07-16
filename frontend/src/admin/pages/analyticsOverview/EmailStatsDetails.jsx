import React from "react";
import Header from "../../components/analytics/emailStatsDetails/Header";
import EmailStatsCards from "../../components/analytics/emailStatsDetails/EmailStatsCards";
import EmailPreview from "../../components/analytics/emailStatsDetails/EmailPreview";

const EmailStatsDetails = () => {
  return (
    <>
      <Header />
      <EmailStatsCards />
      <EmailPreview />
    </>
  );
};

export default EmailStatsDetails;
