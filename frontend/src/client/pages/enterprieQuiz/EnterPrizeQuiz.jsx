import React from "react";
import Header from "../../components/enterprizeQuiz/Header";
import Quiz from "../../components/enterprizeQuiz/Quiz";
import QuizLink from "../../components/enterprizeQuiz/QuizLink";
import UploadLogo from "../../components/enterprizeQuiz/UploadLogo";
import Customizations from "../../components/enterprizeQuiz/Customizations";

const EnterPrizeQuiz = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-4 gap-4 bg-[#2A2A39] p-8">
        {/* Left side: 3 columns */}
        <div className="col-span-2">
          <Quiz />
          <QuizLink />
        </div>

        {/* Right side: 2 columns */}
        <div className="col-span-2">
          <UploadLogo />
          <Customizations />
        </div>
      </div>
    </>
  );
};

export default EnterPrizeQuiz;
