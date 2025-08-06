
import React from "react";
import UserInfo from "../../components/dashboard/UserInfo";
import Tabs from "../../components/users/details/tabs/Tabs";
import { useLocation } from "react-router-dom";


const Details = () => {
  const location = useLocation();
  const user = location.state?.user;
  return (
    <>
      <UserInfo />
      <div className="bg-[#2A2A39] lg:p-5 mt-10 ">
        <Tabs user={user} />
      </div>
    </>
  );
};

export default Details;
