import React from "react";
import Header from "../../components/analytics/PromptsDetails/Header";
import PromptDetailsCards from "../../components/analytics/PromptsDetails/PromptDetailsCards";
import PromptPreview from "../../components/analytics/PromptsDetails/PromptPreview";

const PromptStatsDetails = () => {
  return (
    <>
      <Header />
      <PromptDetailsCards />
      <PromptPreview />
    </>
  );
};

export default PromptStatsDetails;
