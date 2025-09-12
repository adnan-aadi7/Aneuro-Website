import React from "react";
import Header from "../../components/analytics/funnelDetails/Header";
import Filters from "../../components/analytics/funnelDetails/Filters";
import { useParams } from "react-router-dom";

const FunnelStatsDetails = () => {
  const { templateId } = useParams();
  return (
    <>
      <Header />
      <Filters templateId={templateId} />
    </>
  );
};

export default FunnelStatsDetails;
