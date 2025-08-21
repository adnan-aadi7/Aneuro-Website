// components/analyticsOverview/individualQuizSubmissions/Table.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RestrictionPopup from "../../ResultOverview/RestrictionPopup";
import { useSelector } from "react-redux";
import axios from "../../../../store/axiosInstance";

const Table = () => {
  const navigate = useNavigate();
  const [showRestriction, setShowRestriction] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  const { sessions, loading, error } = useSelector((state) => state.quiz);

  const handlePreviewClick = (userId) => {
    navigate(`/quiz-details/${userId}`);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const sendReminder = async (row) => {
    try {
      setSendingId(row._id);
      const payload = {
        user_id: row.user_id,
        quizId: row._id, // using session _id as quizId based on provided response
        audienceEmails: [row.email],
      };
      await axios.post("/quiz/send-incomplete-reminders", payload);
    } catch (e) {
      console.error(e);
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return <p className="text-white mt-5">Loading...</p>;
  if (error) return <p className="text-red-400 mt-5">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-[#232432] mt-6 rounded-lg">
      {showRestriction && (
        <RestrictionPopup onClose={() => setShowRestriction(false)} />
      )}

      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-gray-300 border-b border-gray-600 text-xs">
            <th className="py-2 px-3 font-medium">Name</th>
            <th className="py-2 px-3 font-medium">Email</th>
            <th className="py-2 px-3 font-medium">Date</th>
            <th className="py-2 px-3 font-medium">Brain</th>
            <th className="py-2 px-3 font-medium text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {sessions?.data?.length > 0 ? (
            sessions.data.map((user, idx) => {
              const isCompleted = Boolean(user?.is_completed);
              return (
                <tr
                  key={idx}
                  className="border-b border-gray-500 last:border-b-0 hover:bg-[#2b2b3d] transition-colors text-sm"
                >
                  <td className="py-2 px-3 flex items-center gap-2 min-w-[140px]">
                    <img
                      src={"https://via.placeholder.com/28"}
                      alt={user.name || "avatar"}
                      className="w-7 h-7 rounded-full border border-gray-500 object-cover"
                    />
                    <span className="text-white truncate max-w-[180px]">
                      {user.name || "-"}
                    </span>
                  </td>

                  <td className="py-2 px-3 text-gray-300 min-w-[160px] truncate">
                    {user.email || "-"}
                  </td>

                  <td className="py-2 px-3 text-gray-300 min-w-[90px]">
                    {formatDate(user.updatedAt || user.createdAt)}
                  </td>

                  <td className="py-2 px-3 text-gray-300 min-w-[90px]">
                    {user.brain_type || "-"}
                  </td>

                  <td className="py-2 px-3 text-center min-w-[110px]">
                    {isCompleted ? (
                      <button
                        className="bg-green-200 text-green-900 px-4 py-1 rounded-full text-xs font-semibold hover:bg-green-300"
                        onClick={() => handlePreviewClick(user.user_id)}
                      >
                        View
                      </button>
                    ) : (
                      <button
                        disabled={sendingId === user._id}
                        onClick={() => sendReminder(user)}
                        className={`${
                          sendingId === user._id
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-cyan-300"
                        } bg-cyan-400 text-[#232432] px-4 py-1 rounded-full text-xs font-semibold`}
                      >
                        Send
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-gray-400 py-4 text-sm">
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
