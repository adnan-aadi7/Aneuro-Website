import React from "react";
import UserInfo from "../../components/dashboard/UserInfo";
import Cards from "../../components/dashboard/Cards";
import Chart from "../../components/dashboard/Chart";
import Inbox from "../../components/dashboard/Inbox";

const AdminDashboard = () => {
  return (
    <>
      <UserInfo />
      <Cards />
      <Chart />
      <Inbox />
    </>
  );
};

export default AdminDashboard;
