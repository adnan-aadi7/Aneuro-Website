import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/analytics/PromptsDetails/Header";
import PromptDetailsCards from "../../components/analytics/PromptsDetails/PromptDetailsCards";
import PromptPreview from "../../components/analytics/PromptsDetails/PromptPreview";

const PromptStatsDetails = () => {
  const { packId } = useParams();
  return (
    <>
      <Header packId={packId} />
      <PromptDetailsCards packId={packId} />
      <PromptPreview />
    </>
  );
};

export default PromptStatsDetails;
