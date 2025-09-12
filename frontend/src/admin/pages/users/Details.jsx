
import React from "react";
import UserInfo from "../../components/dashboard/UserInfo";
import Tabs from "../../components/users/details/tabs/Tabs";
import { useLocation, useParams } from "react-router-dom";


const Details = () => {
  const location = useLocation();
  const { userId } = useParams();
  const user = location.state?.user;
  return (
    <>
      <UserInfo />
      <div className="bg-[#2A2A39] lg:p-5 mt-10 ">
        <Tabs user={user} userId={userId} />
      </div>
    </>
  );
};

export default Details;
