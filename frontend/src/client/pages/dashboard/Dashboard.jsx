import React from "react";
import WelcomeDashboard from "../../components/dashboard/UserInfo";
import QuestionnaireLinks from "../../components/dashboard/QuestionnaireLinks";
import SuggestTools from "../../components/dashboard/SuggestTools";
import Cards from "../../components/dashboard/Cards";
import BrainTypesAnalysis from "../../components/dashboard/BrainTypesAnalysis";
import QuizPerformance from "../../components/ResultOverview/QuizPerformance";


const Dashboard = () => {
  return (
    <>
      <WelcomeDashboard />
      <div className="  bg-[#2A2A39] mt-5 p-2 lg:px-5 w-full">
        <Cards />
      </div>
      <div className="p-2  bg-[#2A2A39]">
        <BrainTypesAnalysis />
        <QuizPerformance />
      </div>
      <QuestionnaireLinks />
      <SuggestTools />
    </>
  );
};

export default Dashboard;
