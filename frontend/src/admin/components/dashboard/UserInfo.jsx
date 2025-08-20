import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/Slice/UserSlice";


const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const UserInfo = () => {
  const user = useSelector(selectUser);
  const greeting = getGreeting();
  const displayName = user?.name || user?.email?.split("@")[0] || "there";

  return (
    <div className="  ">
      <h1 className="text-white text-2xl md:text-4xl font-semibold mb-2">
        {greeting}, {displayName}
      </h1> 
      <p className="text-gray-400 text-lg md:text-xl">
        Let's make the day productive
      </p>
    </div>
  );
};

export default UserInfo;
