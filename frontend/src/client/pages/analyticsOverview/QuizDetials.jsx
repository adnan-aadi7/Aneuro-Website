import React from "react";
import HeaderQuizDetails from "../../components/analyticsOverview/details/HeaderQuizDetails";
import Cards from "../../components/analyticsOverview/details/Cards";
import DetailsChart from "../../components/analyticsOverview/details/DetailsChart";

const QuizDetials = () => {
  return (
    <div className="bg-[#2A2A39] p-8 w-full min-h-screen">
      <HeaderQuizDetails />
      <Cards />
      <DetailsChart />
    </div>
  );
};

export default QuizDetials;
