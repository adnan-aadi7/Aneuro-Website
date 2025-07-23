import React from "react";
import Form from "../../components/signup/Form";
import RightSection from "../../components/signup/RightSection";

const Signup = () => {
  return (
    <div className="flex  w-full">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Form />
      </div>
      <div className="w-0 md:w-1/2 h-full rounded-tr-3xl rounded-br-3xl overflow-hidden hidden md:block">
        <RightSection />
      </div>
    </div>
  );
};

export default Signup;
