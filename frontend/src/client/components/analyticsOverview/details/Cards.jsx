import React from "react";
import { FiUser, FiActivity, FiTarget } from "react-icons/fi";
import Looper3 from "../../../../assets/resultOverView/Looper-3.png";
import BrainImg from "../../../../assets/quizdetails/brain.png";

const user = {
  name: "Devon Lane",
  userId: "#45674",
  email: "devon@gmail.com",
  date: "June 17, 2025",
  time: "3:42 PM",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  brainType: "Reflector",
  brainPercent: 40,
};

const Cards = () => (
  <div className="flex flex-col md:flex-row gap-8 w-full mt-6">
    {/* User Info Card */}
    <div
      className="flex-1 min-w-[240px] max-w-xs p-7 flex flex-col justify-between h-[220px]"
      style={{
        background: "linear-gradient(135deg, #2A2A39 60%, #12DCF0 300%)",
      }}
    >
      <div className="mb-6 w-full">
        <div className="flex items-center justify-between w-full mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-400"
          />
          <div className="text-gray-200 text-base font-medium">
            {user.userId}
          </div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white leading-tight">
            {user.name}
          </div>
          <div className="text-gray-300 text-base">{user.email}</div>
        </div>
      </div>
      <div className="flex justify-between text-gray-300 text-base mt-auto">
        <span>{user.date}</span>
        <span>{user.time}</span>
      </div>
    </div>
    {/* Dominant Brain Type Card */}
    <div
      className="flex-1 min-w-[240px] max-w-xs bg-[#04D396]  p-7 flex flex-col justify-between h-[220px] relative overflow-hidden"
      style={{
        backgroundImage: `url(${Looper3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 1,
      }}
    >
      <div className="flex flex-col items-start mb-6">
        <span
          className="flex items-center justify-center w-12 h-12 rounded-full mb-3"
          style={{ background: "#2A2A3947" }}
        >
          <img src={BrainImg} alt="Brain" className="w-8 h-8 object-contain" />
        </span>
        <div className="w-full">
          <div className="text-2xl font-bold text-[#232432]">
            {user.brainType}
          </div>
          <div className="text-[#232432] text-base font-medium opacity-80">
            Dominant Brain Type
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[#232432] text-base mt-auto opacity-80">
        <span>{user.date}</span>
        <span>{user.time}</span>
      </div>
    </div>
    {/* Brain Percentage Card */}
    <div
      className="flex-1 min-w-[240px] max-w-xs p-7 flex flex-col justify-between h-[220px]"
      style={{
        background: "linear-gradient(135deg, #2A2A39 60%, #12DCF0 300%)",
      }}
    >
      <div className="flex flex-col items-start mb-6">
        <span className="bg-[#39394a] rounded-full p-2 mb-3">
          <FiTarget size={28} className="text-[#b2f5ea]" />
        </span>
        <div className="w-full">
          <div className="text-2xl font-bold text-white">
            {user.brainPercent}%
          </div>
          <div className="text-gray-300 text-base font-medium">
            {user.brainType} Brain Percentage
          </div>
        </div>
      </div>
      <div className="flex justify-between text-gray-300 text-base mt-auto">
        <span>{user.date}</span>
        <span>{user.time}</span>
      </div>
    </div>
  </div>
);

export default Cards;
