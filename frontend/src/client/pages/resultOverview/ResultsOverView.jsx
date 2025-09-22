import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/analyticsOverview/individualQuizSubmissions/Header";
import Table from "../../components/analyticsOverview/individualQuizSubmissions/Table";
import IncompleteTable from "../../components/analyticsOverview/IncompleteQuiz/Table";
import axios from "../../../store/axiosInstance";

// Helper to pull logged-in user info from localStorage
function getUserInfo() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    return u || {};
  } catch {
    return {};
  }
}

export default function ResultsOverView() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    isCompleted: null,
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const user = useMemo(getUserInfo, []); 

useEffect(() => {
  const fetchData = async () => {
    if (!user?.id) {
      setError("User ID not found. Please log in.");
      setRows([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let res;
      const params = {
    userId: user.id,          
    userType: user.userType,  
  };

  if (typeof filters.isCompleted === "boolean") {
    params.is_completed = filters.isCompleted;
  }

  if (user.userType === "admin") {
    res = await axios.get("/quiz/user/subscribers-quizzes", { params });
  } else if (user.userType === "user") {
    params.user_id = user.id;
    res = await axios.get("/quiz/sessions", { params });
      } else {
        setError("Invalid user type.");
        setRows([]);
        setLoading(false);
        return;
      }

      setRows(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to fetch quiz data"
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [user, filters.isCompleted]);

  const updateFilters = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <Header filters={filters} onChangeFilters={updateFilters} />
      {filters.isCompleted === false ? (
        <IncompleteTable
          rows={rows}
          loading={loading}
          error={error}
          filters={filters}
        />
      ) : (
        <Table
          rows={rows}
          loading={loading}
          error={error}
          filters={filters}
        />
      )}
    </>
  );
}
