import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/analytics/emailStatsDetails/Header";
import EmailStatsCards from "../../components/analytics/emailStatsDetails/EmailStatsCards";
import EmailPreview from "../../components/analytics/emailStatsDetails/EmailPreview";

const EmailStatsDetails = () => {
  const { sequenceId } = useParams();

  return (
    <>
      <Header sequenceId={sequenceId} />
      <EmailStatsCards sequenceId={sequenceId} />
      <EmailPreview sequenceId={sequenceId} />
    </>
  );
};

export default EmailStatsDetails;
