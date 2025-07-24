import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const userData = [
  {
    id: 1,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Active",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Active",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Active",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Suspend",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Active",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Active",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Suspend",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: 8,
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.com",
    subscription: "Free",
    signupDate: "06/11/2025",
    status: "Active",
    engagement: 50,
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

export default function Table() {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  // CircularProgress styled to match the provided image
  const CircularProgress = ({ percentage }) => {
    // SVG circle settings
    const size = 20; // px
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(percentage, 100));
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex items-center gap-2">
        <span
          className="text-white text-sm font-light"
          style={{ lineHeight: 1 }}
        >
          {progress}%
        </span>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className=""
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D1FADF"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#19E05A"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.4s",
            }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      </div>
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full bg-[#2A2A39] mt-10 overflow-hidden p-6 relative">
      {/* Gradient at right bottom */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 w-60 h-40 z-0"
        style={{
          background:
            "radial-gradient(ellipse at right bottom, #12DCF0 0%, transparent 80%)",
          opacity: 0.25,
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2A2A39]">
            <tr>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  User Name
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </th>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm">
                User ID
              </th>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm">
                Email Address
              </th>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm whitespace-nowrap">
                Subscription Tier
              </th>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm">
                Signup Date
              </th>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm">
                Status
              </th>
              <th className="text-left py-4 px-2 text-slate-300 font-medium text-sm whitespace-nowrap">
                Quiz Engagement
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            <tr>
              <td colSpan="8" className="p-0">
                <div className="w-full h-[2px] bg-[#39394a]" />
              </td>
            </tr>
            {userData.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-full h-full bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ display: "none" }}
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <span className="text-white font-medium truncate max-w-[120px]">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-slate-300">{user.userId}</td>
                <td className="py-4 px-2 text-slate-300">{user.email}</td>
                <td className="py-4 px-2 text-slate-300">
                  {user.subscription}
                </td>
                <td className="py-4 px-2 text-slate-300">{user.signupDate}</td>
                <td className="py-4 px-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-[#D4F7D4] text-[#0B3C0C]"
                        : "bg-[#F01212] text-[#FFFFFF]"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <CircularProgress percentage={user.engagement} />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex  ">
                    <button
                      className="bg-[#B6FFD6] text-green-900 font-semibold rounded-full px-5 py-1 text-sm focus:outline-none transition-all hover:brightness-95 cursor-pointer"
                      onClick={() => navigate("/admin/user/details")}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="mt-12 flex justify-center items-center gap-2 text-sm">
        <button className="px-2 py-1 text-white/70">Previous</button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-md ${
              page === 1
                ? "bg-[#00D1FF] text-black font-semibold"
                : "bg-[#1B1D29] text-white/70"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="px-2 py-1 text-white/70">Next</button>
      </div>
    </div>
  );
}
