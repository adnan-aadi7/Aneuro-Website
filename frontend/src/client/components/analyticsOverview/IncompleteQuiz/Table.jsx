import React, { useState, useEffect } from "react";
import axios from "../../../../store/axiosInstance";
import { toast } from "react-hot-toast";

const Table = ({ rows = [], loading, error, filters }) => {
  const [sendingId, setSendingId] = useState(null);
  const [localRows, setLocalRows] = useState(rows);

  // ✅ keep rows in sync if parent updates
  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const sendReminder = async (row) => {
    try {
      setSendingId(row._id);
      await axios.post("/quiz/send-incomplete-reminders", {
        user_id: row.user_id,
        quizId: row._id,
        audienceEmails: [row.email],
      });

      // ✅ Update reminders in local state immediately
      setLocalRows((prev) =>
        prev.map((u) =>
          u._id === row._id
            ? {
                ...u,
                reminders: [
                  {
                    createdAt: new Date().toISOString(), // update immediately
                  },
                  ...(u.reminders || []),
                ],
              }
            : u
        )
      );

      toast.success("Reminder sent successfully");
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to send reminder");
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return <p className="text-white mt-5">Loading...</p>;
  if (error) return <p className="text-red-400 mt-5">Error: {String(error)}</p>;

  // 🔎 Apply search + date filters before rendering rows
const filteredRows = (localRows || []).filter((user) => {
  if (filters?.search) {
    const query = filters.search.toLowerCase();
    const matchesSearch =
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      String(user.user_id).toLowerCase().includes(query);
    if (!matchesSearch) return false;
  }

  // ✅ Date filter
  if (filters?.dateFrom || filters?.dateTo) {
    const createdAt = new Date(user.createdAt || user.timestamp || Date.now());
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;

    if (from && createdAt < from) return false;
    if (to) {
      const endOfTo = new Date(to);
      endOfTo.setHours(23, 59, 59, 999);
      if (createdAt > endOfTo) return false;
    }
  }

  return true;
});


  return (
    <div className="relative overflow-x-auto bg-[#232432] mt-6 py-7 px-5">
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-500/20 to-transparent blur-xl pointer-events-none"></div>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-white border-b border-gray-300 text-sm ">
            <th className="py-3 px-4 font-semibold flex items-center gap-2 ">
              Name
              <svg className="w-7 h-8 mt-2 ml-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v8m0 0l-4-4m4 4l4-4" />
              </svg>
            </th>
            <th className="py-3 px-4 font-semibold text-sm">User ID</th>
            <th className="py-3 px-4 font-semibold text-sm">Email Address</th>
            <th className="py-3 px-4 font-semibold text-sm">Start Date</th>
            <th className="py-3 px-4 font-semibold text-sm">Last Question Reached</th>
            <th className="py-3 px-4 font-semibold text-sm">Reminders</th>
            <th className="py-3 px-4 font-semibold text-center text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((user, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-300 last:border-b-0 hover:bg-[#2b2b3d] transition-colors text-sm"
              >
                <td className="py-3 px-4 flex items-center gap-3 min-w-[160px]">
                  <div className="w-10 h-10 rounded-full object-cover border border-gray-300 bg-[#2A2A39] flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        user.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || user.email || "U"
                        )}&background=2A2A39&color=22d3ee&bold=true&format=png`
                      }
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white truncate max-w-[200px]">{user.name || "-"}</span>
                </td>
                <td className="py-3 px-4 text-white min-w-[100px]">
                  {user.user_id ? `#${String(user.user_id).slice(0, 6)}…` : "-"}
                </td>
                <td className="py-3 px-4 text-white min-w-[180px] truncate">{user.email || "-"}</td>
                <td className="py-3 px-4 text-white min-w-[120px]">
                  {new Date(user.createdAt || user.timestamp || Date.now()).toLocaleDateString("en-GB")}
                </td>
                <td className="py-3 px-4 text-white min-w-[100px]">Q{user.questions_completed ?? "-"}</td>
                <td className="py-3 px-4 text-white min-w-[120px]">
                  <span className="block text-white">{(user.reminders?.length || 0) > 0 ? "Yes" : "No"}</span>
                  {user.reminders?.length > 0 && (
                    <span className="block text-xs text-gray-300 mt-1">
                      {`Sent: ${
                        user.reminders[0]?.createdAt
                          ? new Date(user.reminders[0].createdAt).toLocaleDateString("en-GB")
                          : ""
                      }`}
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 text-center min-w-[10px]">
                  <button
                    disabled={sendingId === user._id}
                    onClick={() => sendReminder(user)}
                    className={`${
                      sendingId === user._id
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-green-300"
                    } bg-[#BBF7D0] text-green-900 py-2 rounded-full cursor-pointer text-xs font-semibold px-4 inline-flex items-center justify-center gap-2`}
                  >
                    {sendingId === user._id ? (
                      <>
                        <svg
                          className="animate-spin h-3 w-3 text-green-900"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>{(user.reminders?.length || 0) > 0 ? "Resend" : "Send"}</span>
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-6">
                No matching results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
