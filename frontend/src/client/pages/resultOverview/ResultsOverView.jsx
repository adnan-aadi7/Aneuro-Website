import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/analyticsOverview/individualQuizSubmissions/Header";
import Table from "../../components/analyticsOverview/individualQuizSubmissions/Table";
import axios from "../../../store/axiosInstance"; // <-- adjust path if needed

// Helper to pull the logged-in user id from localStorage
function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u?.id) return u.id;        // our normalized id (preferred)
    if (u?._id) return u._id;      // sometimes only _id exists
  } catch {}
  const legacy = localStorage.getItem("userId");
  return legacy || null;
}

export default function ResultsOverView() {
  const [rows, setRows] = useState([]);          // server data array
  const [loading, setLoading] = useState(false); // boolean
  const [error, setError] = useState(null);      // string|null

  // Frontend filters (no redux): isCompleted triggers server refetch
  const [filters, setFilters] = useState({
    isCompleted: null, // null -> ALL, true -> completed, false -> incomplete
    search: "",
    dateFrom: "",      // YYYY-MM-DD
    dateTo: "",        // YYYY-MM-DD
  });

  const uid = useMemo(getUserId, []); // resolve once

  // Fetch from API whenever completion filter changes (or on mount)
  useEffect(() => {
    const fetchSessions = async () => {
      if (!uid) {
        setError("User ID not found. Please log in.");
        setRows([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const params = { user_id: uid };
        if (typeof filters.isCompleted === "boolean") {
          params.is_completed = filters.isCompleted; // omit when ALL
        }
        const res = await axios.get("/quiz/sessions", { params });
        setRows(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load sessions"
        );
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [uid, filters.isCompleted]);

  // update filters helper
  const updateFilters = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <Header
        filters={filters}
        onChangeFilters={updateFilters}
      />
      <Table
        rows={rows}
        loading={loading}
        error={error}
        filters={filters}
      />
    </>
  );
}
