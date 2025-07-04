import React, { useState, useEffect } from "react";
import Login from "../login/Login";
import Welcome from "../../components/quiz/Welcome";
import Question1 from "../../components/quiz/question1";
import Question2 from "../../components/quiz/Question2";
import Tankyou from "../../components/quiz/Tankyou";

const Quiz = () => {
  const [step, setStep] = useState("welcome");

  useEffect(() => {
    if (step === "welcome") {
      const timer = setTimeout(() => setStep("q1"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleClose = () => setStep("login");

  return (
    <>
      <Login />
      {step === "welcome" && <Welcome onClose={handleClose} />}
      {step === "q1" && (
        <Question1
          onNext={() => setStep("q2")}
          onBack={() => setStep("welcome")}
          onClose={handleClose}
        />
      )}
      {step === "q2" && (
        <Question2
          onSubmit={() => setStep("thankyou")}
          onBack={() => setStep("q1")}
          onClose={handleClose}
        />
      )}
      {step === "thankyou" && <Tankyou onClose={handleClose} />}
    </>
  );
};

export default Quiz;
