import React from "react";
import LoginForm from "../../components/login/LoginFrom";
import RightSection from "../../components/login/RightSection";

const Login = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:grid-cols-2 w-full max-w-7xl mx-auto justify-center items-center gap-20">
        <LoginForm />
        <div className="rounded-tr-3xl rounded-br-3xl overflow-hidden hidden lg:block">
          <RightSection />
        </div>
      </div>
    </>
  );
};

export default Login;
