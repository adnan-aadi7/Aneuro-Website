import React, { useState } from "react";
import Header from "../../components/enterprizeQuiz/Header";
import Quiz from "../../components/enterprizeQuiz/Quiz";
import QuizLink from "../../components/enterprizeQuiz/QuizLink";
import UploadLogo from "../../components/enterprizeQuiz/UploadLogo";
import Customizations from "../../components/enterprizeQuiz/Customizations";
import defaultLogo from "../../components/enterprizeQuiz/../../../assets/auth/logo.png";

const EnterPrizeQuiz = () => {
  const [primaryColor, setPrimaryColor] = useState("#2DD1D1");
  const [secondaryColor, setSecondaryColor] = useState("#FF6B35");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [borderColor, setBorderColor] = useState("#2DD1D1");
  const [logo, setLogo] = useState(defaultLogo);
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#2A2A39] p-4 md:p-8">
        {/* Left side: 3 columns */}
        <div className="md:col-span-2">
          <Quiz
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            textColor={textColor}
            borderColor={borderColor}
            logo={logo}
          />
          <QuizLink />
        </div>

        {/* Right side: 2 columns */}
        <div className="md:col-span-2">
          <UploadLogo logo={logo} setLogo={setLogo} />
          <Customizations
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            textColor={textColor}
            setTextColor={setTextColor}
            borderColor={borderColor}
            setBorderColor={setBorderColor}
          />
        </div>
      </div>
    </>
  );
};

export default EnterPrizeQuiz;
