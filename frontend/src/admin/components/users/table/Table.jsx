import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../../store/Slice/UserSlice";

export default function Table() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.usersLoading);
  const error = useSelector((state) => state.user.usersError);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const CircularProgress = ({ percentage }) => {
    const size = 20;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(percentage, 100));
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-light" style={{ lineHeight: 1 }}>
          {progress}%
        </span>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D1FADF"
            strokeWidth={strokeWidth}
            fill="none"
          />
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
            style={{ transition: "stroke-dashoffset 0.4s" }}
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

  // Show all users instead of just paid users
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <div className="w-full bg-[#2A2A39] mt-10 overflow-hidden p-6 relative">
      <div
        className="pointer-events-none absolute right-0 bottom-0 w-60 h-40 z-0"
        style={{
          background: "radial-gradient(ellipse at right bottom, #12DCF0 0%, transparent 80%)",
          opacity: 0.25,
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2A2A39]">
            <tr>
              <th className="text-left py-4 text-slate-300 font-medium text-sm">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  User Name
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm">
                User ID
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm">
                Email Address
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm whitespace-nowrap">
                Subscription Tier
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm">
                Signup Date
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm whitespace-nowrap">
                Account Status
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm whitespace-nowrap">
                Quiz Engagement
              </th>
              <th className="text-left py-4 text-slate-300 font-medium text-sm">
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

            {loading ? (
              <tr>
                <td colSpan="8" className="text-center text-white py-8">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center text-red-400 py-8">
                  {error}
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-white py-8">
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden">
                        <img
                          src={user.profileImage}
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
                          {user.name?.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>
                      <span className="text-white font-medium truncate max-w-[120px]">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* ✅ Shortened ID */}
                  <td className="py-4 text-slate-300">
                    {user._id ? `${user._id.slice(0, 6)}...${user._id.slice(-4)}` : "N/A"}
                  </td>

                  <td className="py-4 text-slate-300">{user.email}</td>
                  <td className="py-4 text-slate-300">
                    {user.subscription?.plan || "N/A"}
                  </td>
                  <td className="py-4 text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        user.accountStatus === "active"
                          ? "bg-[#D4F7D4] text-[#0B3C0C]"
                          : "bg-[#F01212] text-[#FFFFFF]"
                      }`}
                    >
                      {user.accountStatus || "N/A"}
                    </span>
                  </td>
                  <td className="py-4">
                    <CircularProgress percentage={0} />
                  </td>
                  <td className="py-4">
                    <button
                      className="bg-[#B6FFD6] text-green-900 font-semibold rounded-full px-5 py-1 text-sm focus:outline-none transition-all hover:brightness-95 cursor-pointer"
                      onClick={() => navigate("/admin/user/details", { state: { user } })}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
