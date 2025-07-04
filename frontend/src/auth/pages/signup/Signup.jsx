import React from "react";
import Form from "../../components/signup/Form";
import RightSection from "../../components/signup/RightSection";

const Signup = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:grid-cols-2 mx-auto w-full md:w-7xl gap-6 md:gap-32">
        <Form />
        <div className="rounded-tr-3xl rounded-br-3xl overflow-hidden hidden md:block">
          <RightSection />
        </div>
      </div>
    </>
  );
};

export default Signup;
