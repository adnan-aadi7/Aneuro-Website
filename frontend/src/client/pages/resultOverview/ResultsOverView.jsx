import React from "react";
import QuizOverview from "../../components/ResultOverview/QuizOverview";
import Cards from "../../components/ResultOverview/Cards";
import BrainTypesAnalysis from "../../components/ResultOverview/BrainTypesAnalysis";
import QuizPerformance from "../../components/ResultOverview/QuizPerformance";

const ResultsOverView = () => {
  return (
    <>
      <QuizOverview />
      <div className="p-2 md:p-5 bg-[#2A2A39] mt-5">
        <Cards />
        <BrainTypesAnalysis />
        <QuizPerformance />
      </div>
    </>
  );
};

export default ResultsOverView;
