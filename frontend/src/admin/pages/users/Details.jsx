import React from "react";
import UserInfo from "../../components/dashboard/UserInfo";
import Tabs from "../../components/users/details/tabs/Tabs";

const Details = () => {
  return (
    <>
      <UserInfo />
      <div className="bg-[#2A2A39] lg:p-5 mt-10 ">
        <Tabs />
      </div>
    </>
  );
};

export default Details;
