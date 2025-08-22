import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestrictionPopup from "../../ResultOverview/RestrictionPopup";
import axios from "../../../../store/axiosInstance"; // <-- adjust path if needed

export default function Table({ rows, loading, error, filters }) {
  const navigate = useNavigate();
  const [showRestriction, setShowRestriction] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // client-side filters: search + date range (server already filtered by isCompleted)
  const filteredRows = useMemo(() => {
    const needle = (filters.search || "").trim().toLowerCase();
    const from = filters.dateFrom ? new Date(filters.dateFrom + "T00:00:00") : null;
    const to = filters.dateTo ? new Date(filters.dateTo + "T23:59:59") : null;

    return (rows || []).filter((r) => {
      if (typeof filters.isCompleted === "boolean") {
        const isCompleted = Boolean(r?.is_completed);
        if (isCompleted !== filters.isCompleted) return false;
      }
      if (needle) {
        const hay = `${r?.name || ""} ${r?.email || ""} ${r?.brain_type || ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (from || to) {
        const d = new Date(r?.updatedAt || r?.createdAt || r?.timestamp || 0);
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      return true;
    });
  }, [rows, filters]);

  const handlePreviewClick = (userId) => {
    navigate(`/quiz-details/${userId}`);
  };

  const sendReminder = async (row) => {
    try {
      setSendingId(row._id);
      const payload = {
        user_id: row.user_id,
        quizId: row._id, // session id
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
  if (error) return <p className="text-red-400 mt-5">Error: {String(error)}</p>;

  return (
    <div className="overflow-x-auto bg-[#232432] mt-6 rounded-lg">
      {showRestriction && <RestrictionPopup onClose={() => setShowRestriction(false)} />}

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
          {filteredRows.length > 0 ? (
            filteredRows.map((user, idx) => {
              const isCompleted = Boolean(user?.is_completed);
              return (
                <tr
                  key={user._id || idx}
                  className="border-b border-gray-500 last:border-b-0 hover:bg-[#2b2b3d] transition-colors text-sm"
                >
                  <td className="py-2 px-3 flex items-center gap-2 min-w-[160px]">
                    {/* Themed SVG avatar */}
                    <div className="w-7 h-7 rounded-full border border-gray-500 bg-[#2A2A39] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-cyan-300"
                      >
                        <path
                          d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.5 19.5a7.5 7.5 0 0 1 15 0"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <span className="text-white truncate max-w-[200px]">
                      {user.name || "-"}
                    </span>
                  </td>

                  <td className="py-2 px-3 text-gray-300 min-w-[180px] truncate">
                    {user.email || "-"}
                  </td>

                  <td className="py-2 px-3 text-gray-300 min-w-[90px]">
                    {formatDate(user.updatedAt || user.createdAt || user.timestamp)}
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
}
