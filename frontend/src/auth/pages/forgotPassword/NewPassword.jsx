import React from "react";
import LoginForm from "../../components/login/LoginFrom";
import RightSection from "../../components/login/RightSection";
import Email from "../../components/forgotPassword/Email";
import SendInstruction from "../../components/forgotPassword/SendInstruction";
import Password from "../../components/forgotPassword/Password";

const NewPassword = () => {
  return (
    <div className="flex w-full">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Password />
      </div>
      <div className="w-0 md:w-1/2 h-full rounded-tr-3xl rounded-br-3xl overflow-hidden hidden md:block">
        <RightSection />
      </div>
    </div>
  );
};

export default NewPassword;
