import React, { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
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

  const CircularProgress = ({ percentage }) => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="#374151"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
          {percentage}%
        </div>
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
    <div className="w-full bg-[#2A2A39] mt-10 overflow-hidden p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2A2A39]">
            <tr>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  User Name
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                User ID
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Email Address
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Subscription Tier
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Signup Date
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
                Status
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">
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
                <td className="py-4 px-6">
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
                <td className="py-4 px-6 text-slate-300">{user.userId}</td>
                <td className="py-4 px-6 text-slate-300">{user.email}</td>
                <td className="py-4 px-6 text-slate-300">
                  {user.subscription}
                </td>
                <td className="py-4 px-6 text-slate-300">{user.signupDate}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <CircularProgress percentage={user.engagement} />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center gap-2 py-4 px-6 bg-[#2A2A39]">
        <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors">
          Previous
        </button>
        <button className="px-3 py-1 bg-teal-600 text-white rounded">1</button>
        <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors">
          2
        </button>
        <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors">
          3
        </button>
        <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}
