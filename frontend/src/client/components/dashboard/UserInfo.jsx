import React from "react";
import { useSelector } from "react-redux";

const UserInfo = () => {
  const user = useSelector((state) => state.user.user); // Access the user object from Redux

  return (
    <div className="rounded-lg">
      <h1 className="text-white text-2xl md:text-4xl font-semibold mb-2">
        Good Morning, {user?.name || 'Guest'}
      </h1>
      <p className="text-gray-400 text-lg md:text-xl">
        Let's make the day productive
      </p>
    </div>
  );
};

export default UserInfo;
