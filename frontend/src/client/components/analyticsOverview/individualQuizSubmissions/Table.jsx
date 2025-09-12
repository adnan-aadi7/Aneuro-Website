import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestrictionPopup from "../../ResultOverview/RestrictionPopup";
import axios from "../../../../store/axiosInstance"; // <-- adjust path if 
// Inline arrow icon to avoid external icon dependency issues


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

  // Build a name/email based avatar URL when no profile picture is provided
  const buildAvatarUrl = (fullName, fallbackEmail) => {
    const seed = encodeURIComponent((fullName || "").trim() || (fallbackEmail || "").split("@")[0] || "user");
    // UI Avatars service - lightweight and fast; adjust colors to match theme
    return `https://ui-avatars.com/api/?name=${seed}&background=2A2A39&color=22d3ee&bold=true&format=png`;
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

  const handlePreviewClick = (userId, audienceId) => {
    navigate(`/quiz-details/${userId}/${audienceId}`);
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
    <div className="relative overflow-x-auto bg-[#232432] mt-6 py-7 px-5">
      {showRestriction && <RestrictionPopup onClose={() => setShowRestriction(false)} />}
      
      {/* Gradient overlay in bottom right corner */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-500/20 to-transparent blur-xl pointer-events-none"></div>
     
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-white border-b border-gray-300 text-sm ">
            <th className="py-3 px-4 font-semibold flex items-center gap-2 ">
              Name
              <svg className="w-7 h-8 mt-2 ml-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"  d="M12 5v8m0 0l-4-4m4 4l4-4" />
              </svg>
            </th>
            <th className="py-3 px-4 font-semibold text-sm">User ID</th>
            <th className="py-3 px-4 font-semibold text-sm">Email Address</th>
            <th className="py-3 px-4 font-semibold text-sm">Submission Date</th>
            <th className="py-3 px-4 font-semibold text-sm">Brain Type</th>
            <th className="py-3 px-4 font-semibold text-center text-sm">Status</th> 
          </tr>
        </thead>

        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((user, idx) => {
              const isCompleted = Boolean(user?.is_completed);
              return (
                <tr
                  key={user._id || idx}
                  className="border-b border-gray-300 last:border-b-0 hover:bg-[#2b2b3d] transition-colors text-sm"
                >
                  <td className="py-3 px-4 flex items-center gap-3 min-w-[160px]">
                    {/* Dynamic profile picture with avatar fallback */}
                    <div className="w-10 h-10 rounded-full border border-gray-300 bg-[#2A2A39] flex items-center justify-center overflow-hidden">
                      {(() => {
                        const avatarSrc =
                          user.profilePicture ||
                          user.profile_picture ||
                          user.avatar ||
                          user.photoUrl ||
                          user.photo_url ||
                          buildAvatarUrl(user.name, user.email);
                        return (
                          <img
                            src={avatarSrc}
                            alt={user.name || "User"}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              // if avatar service fails, fallback to inline icon
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        );
                      })()}
                      <div className="hidden w-full h-full items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-cyan-300"
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
                    </div>

                    <span className="text-white truncate max-w-[200px]">
                      {user.name || "-"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-white min-w-[100px]">
                    {user.user_id ? `#${user.user_id}` : "-"}
                  </td>

                  <td className="py-3 px-4 text-white min-w-[180px] truncate">
                    {user.email || "-"}
                  </td>

                  <td className="py-3 px-4 text-white min-w-[120px]">
                    {formatDate(user.updatedAt || user.createdAt || user.timestamp)}
                  </td>

                  <td className="py-3 px-4 text-white min-w-[100px]">
                    {user.brain_type || "-"}
                  </td>

                  <td className="py-3 px-4 text-center min-w-[110px]">
                    {isCompleted ? (
                      <button
                        className="bg-green-200 text-green-900 px-4 py-1 rounded-full text-xs font-semibold hover:bg-green-300"
                        onClick={() => handlePreviewClick(user.user_id, user._id)}
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
              <td colSpan="6" className="text-center text-white py-6 text-sm">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
