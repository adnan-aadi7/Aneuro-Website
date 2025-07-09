import React from "react";
import WelcomeDashboard from "../../components/dashboard/UserInfo";
import QuizCompletionChart from "../../components/dashboard/QuizCompletionChart";
import ConversionFunnelInsights from "../../components/dashboard/ConversionFunnelInsights";
import AudienceChart from "../../components/dashboard/AudienceChart";
import EngagedBrainTypeChart from "../../components/dashboard/EngagedBrainTypeChart";
import QuestionnaireLinks from "../../components/dashboard/QuestionnaireLinks";
import SuggestTools from "../../components/dashboard/SuggestTools";

const Dashboard = () => {
  return (
    <>
      <WelcomeDashboard />
      <div className="flex flex-col md:flex-row gap-4 mt-5 w-full">
        <QuizCompletionChart className="w-full md:w-1/2" />
        <ConversionFunnelInsights className="w-full md:w-1/2" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-5 w-full">
        <AudienceChart className="w-full md:w-1/2" />
        <EngagedBrainTypeChart className="w-full md:w-1/2" />
      </div>
      <QuestionnaireLinks />
      <SuggestTools />
    </>
  );
};

export default Dashboard;
