import React from "react";
import { FiUser, FiActivity, FiTarget } from "react-icons/fi";
import Looper3 from "../../../../assets/resultOverView/Looper-3.png";
import BrainImg from "../../../../assets/quizdetails/brain.png";

function formatDateTime(iso) {
  if (!iso) return { date: "-", time: "-" };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
}

function truncateUserId(idStr) {
  if (!idStr) return "-";
  const str = String(idStr);
  if (str.length <= 8) return str;
  if (str.startsWith("#")) {
    const core = str.slice(1);
    const head = core.slice(0, 6);
    return `#${head}…`;
  }
  return `${str.slice(0, 6)}…`;
}

function buildRandomAvatar(name, email) {
  const seed = encodeURIComponent((name || email || Math.random().toString(36)).toString());
  return `https://i.pravatar.cc/64?u=${seed}`;
}

const Cards = ({ name, userId, email, date, brainType, brainPercent, avatar }) => {
  const dt = formatDateTime(date);
  return (
  <div className="flex flex-col md:flex-row gap-8 w-full mt-6">
    {/* User Info Card */}
    <div
      className="flex-1 min-w-[240px] md:max-w-xs w-full p-7 flex flex-col justify-between h-[220px]"
      style={{
        background: "linear-gradient(135deg, #2A2A39 60%, #12DCF0 300%)",
      }}
    >
      <div className="mb-6 w-full">
        <div className="flex items-center justify-between w-full mb-3">
          <img
            src={avatar || buildRandomAvatar(name, email)}
            alt={name || "User"}
            className="w-12 h-12 rounded-full object-cover border border-gray-400"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || (email ? email.split('@')[0] : 'User'))}&background=2A2A39&color=22d3ee&bold=true&format=png`;
            }}
          />
          <div className="text-gray-200 text-base font-medium">
            {truncateUserId(userId)}
          </div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white leading-tight">
            {name || "-"}
          </div>
          <div className="text-gray-300 text-base">{email || "-"}</div>
        </div>
      </div>
      <div className="flex justify-between text-gray-300 text-base mt-auto">
        <span>{dt.date}</span>
        <span>{dt.time}</span>
      </div>
    </div>
    {/* Dominant Brain Type Card */}
    <div
      className="flex-1 min-w-[240px] md:max-w-xs w-full bg-[#04D396]  p-7 flex flex-col justify-between h-[220px] relative overflow-hidden"
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
            {brainType || "-"}
          </div>
          <div className="text-[#232432] text-base font-medium opacity-80">
            Dominant Brain Type
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[#232432] text-base mt-auto opacity-80">
        <span>{dt.date}</span>
        <span>{dt.time}</span>
      </div>
    </div>
    {/* Brain Percentage Card */}
    <div
      className="flex-1 min-w-[240px] md:max-w-xs w-full p-7 flex flex-col justify-between h-[220px]"
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
            {typeof brainPercent === 'number' ? `${brainPercent}%` : '-'}
          </div>
          <div className="text-gray-300 text-base font-medium">
            {(brainType || '-') + ' Brain Percentage'}
          </div>
        </div>
      </div>
      <div className="flex justify-between text-gray-300 text-base mt-auto">
        <span>{dt.date}</span>
        <span>{dt.time}</span>
      </div>
    </div>
  </div>
  );
};

export default Cards;
