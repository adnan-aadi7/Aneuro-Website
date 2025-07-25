import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RestrictionPopup from "../../ResultOverview/RestrictionPopup";

const users = [
  {
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.con",
    date: "June 11, 2025",
    brainType: "Reflector",
    status: "View",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  ...Array(10).fill({
    name: "Devon Lane",
    userId: "#45674",
    email: "Devon@gmail.con",
    date: "June 11, 2025",
    brainType: "Creative",
    status: "View",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  }),
];

const Table = () => {
  const navigate = useNavigate();
  const [showRestriction, setShowRestriction] = useState(false);

  const handlePreviewClick = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "starter") {
      setShowRestriction(true);
    } else {
      navigate("/quiz-details");
    }
  };

  return (
    <div className="overflow-x-auto  bg-[#232432] mt-10">
      {showRestriction && (
        <RestrictionPopup onClose={() => setShowRestriction(false)} />
      )}
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-300 text-sm border-b border-gray-600">
            <th className="py-4 px-4 font-medium">
              Name{" "}
              <span className="inline-block align-middle ml-15 text-2xl">
                ↓
              </span>
            </th>
            <th className="py-4 px-4 font-medium">User ID</th>
            <th className="py-4 px-4 font-medium">Email Address</th>
            <th className="py-4 px-4 font-medium">Submission Date</th>
            <th className="py-4 px-4 font-medium">Brain Type</th>
            <th className="py-4 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-400 last:border-b-0 hover:bg-[#26263a] transition-colors"
            >
              <td className="py-3 px-4 flex items-center gap-3 min-w-[180px]">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-500"
                />
                <span className="text-white font-medium">{user.name}</span>
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[100px]">
                {user.userId}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[180px]">
                {user.email}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[150px]">
                {user.date}
              </td>
              <td className="py-3 px-4 text-gray-300 min-w-[120px]">
                {user.brainType}
              </td>
              <td className="py-3 px-4 min-w-[100px]">
                <button
                  className="bg-green-200 text-green-900 font-semibold px-6 py-1 rounded-full text-sm shadow-sm hover:bg-green-300 transition-colors"
                  onClick={handlePreviewClick}
                >
                  {user.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
