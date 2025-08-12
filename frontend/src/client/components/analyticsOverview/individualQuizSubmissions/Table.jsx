import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RestrictionPopup from "../../ResultOverview/RestrictionPopup";
import { useSelector } from "react-redux";

const Table = () => {
  const navigate = useNavigate();
  const [showRestriction, setShowRestriction] = useState(false);

  const { sessions, loading, error } = useSelector((state) => state.quiz);
  console.log("📌 Redux quiz sessions:", sessions);

  const handlePreviewClick = (userId) => {
    navigate(`/quiz-details/${userId}`);
  };

  // Helper function to format date
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return <p className="text-white mt-5">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-400 mt-5">Error: {error}</p>;
  }

  return (
    <div className="overflow-x-auto bg-[#232432] mt-10">
      {showRestriction && (
        <RestrictionPopup onClose={() => setShowRestriction(false)} />
      )}
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-300 text-sm border-b border-gray-600">
            <th className="py-4 px-4 font-medium">Name</th>
            <th className="py-4 px-4 font-medium">User ID</th>
            <th className="py-4 px-4 font-medium">Email Address</th>
            <th className="py-4 px-4 font-medium">Submission Date</th>
            <th className="py-4 px-4 font-medium">Brain Type</th>
            <th className="py-4 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions?.data?.length > 0 ? (
            sessions.data.map((user, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-400 last:border-b-0 hover:bg-[#26263a] transition-colors"
              >
                <td className="py-3 px-4 flex items-center gap-3 min-w-[180px]">
                  <img
                    src={"https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-500"
                  />
                  <span className="text-white font-medium">{user.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-300 min-w-[100px]">
                  {user.user_id}
                </td>
                <td className="py-3 px-4 text-gray-300 min-w-[180px]">
                  {user.email}
                </td>
                <td className="py-3 px-4 text-gray-300 min-w-[150px]">
                  {formatDate(user.updatedAt)}
                </td>
                <td className="py-3 px-4 text-gray-300 min-w-[120px]">
                  {user.brain_type}
                </td>
                <td className="py-3 px-4 min-w-[100px]">
                  <button
                    className="bg-green-200 text-green-900 font-semibold px-6 py-1 rounded-full text-sm shadow-sm hover:bg-green-300 transition-colors"
                    onClick={() => handlePreviewClick(user.user_id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-400 py-6">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
