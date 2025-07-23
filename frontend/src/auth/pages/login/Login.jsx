import React from "react";
import LoginForm from "../../components/login/LoginFrom";
import RightSection from "../../components/login/RightSection";

const Login = () => {
  return (
    <div className="flex w-full">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="w-0 md:w-1/2 h-full rounded-tr-3xl rounded-br-3xl overflow-hidden hidden md:block">
        <RightSection />
      </div>
    </div>
  );
};

export default Login;
