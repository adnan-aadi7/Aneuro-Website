import React from "react";
import LoginForm from "../../components/login/LoginFrom";
import RightSection from "../../components/login/RightSection";

const Login = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:grid-cols-2 mx-auto w-full md:w-7xl gap-33 ">
        <LoginForm />
        <div className="rounded-tr-3xl rounded-br-3xl overflow-hidden hidden md:block">
          <RightSection />
        </div>
      </div>
    </>
  );
};

export default Login;
