import React, { useState, useEffect } from "react";
import HeaderQuizDetails from "../../components/analyticsOverview/details/HeaderQuizDetails";
import Cards from "../../components/analyticsOverview/details/Cards";
import DetailsChart from "../../components/analyticsOverview/details/DetailsChart";
import RestrictionPopup from "../../components/ResultOverview/RestrictionPopup";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAudienceQuizReport } from "../../../store/Slice/AudienceQuizSlice";
import axiosInstance from "../../../store/axiosInstance";

const QuizDetials = () => {
  const { userId, audienceId } = useParams();
  const [showRestriction, setShowRestriction] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [errorAdmin, setErrorAdmin] = useState(null);

  const dispatch = useDispatch();
  const { report: reportState } = useSelector((s) => s.audienceQuiz);
  const loadingRedux = reportState.loading;
  const errorRedux = reportState.error;
  const reportRedux = reportState.data;

  // ✅ Determine user type from localStorage
  const storedUserStr = localStorage.getItem("user");
  let userType = "user";
  if (storedUserStr) {
    try {
      const storedUser = JSON.parse(storedUserStr);
      if (storedUser?.userType) userType = storedUser.userType.toLowerCase();
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  }

  useEffect(() => {
    const subscriptionStr = localStorage.getItem("subscription");
    if (subscriptionStr) {
      try {
        const subscription = JSON.parse(subscriptionStr);
        if (subscription?.plan === "starter") setShowRestriction(true);
      } catch {}
    }
  }, []);

  // ✅ Admin: direct API call
  useEffect(() => {
    if (!userId || userType !== "admin") return;

    const fetchAdminQuiz = async () => {
      setLoadingAdmin(true);
      try {
        const res = await axiosInstance.get(`/quiz/${userId}/quiz-detail`);
        setReportData(res.data);
        setErrorAdmin(null);
      } catch (err) {
        console.error(err);
        setErrorAdmin(err.response?.data?.message || "Failed to fetch quiz data");
        setReportData(null);
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdminQuiz();
  }, [userId, userType]);

  // ✅ Non-admin: use existing Redux logic
  useEffect(() => {
    if (!userId || !audienceId || userType === "admin") return;
    dispatch(fetchAudienceQuizReport({ user_id: userId, audience_id: audienceId }));
  }, [dispatch, userId, audienceId, userType]);

  // Use admin data if available, else fallback to Redux
  const data = userType === "admin" ? reportData : reportRedux;
  const loading = userType === "admin" ? loadingAdmin : loadingRedux;
  const error = userType === "admin" ? errorAdmin : errorRedux;

  const session = Array.isArray(data?.sessions) ? data.sessions[0] : null;
  const rep = data?.report;
  const avatar =
    session?.profilePicture ||
    session?.profile_picture ||
    session?.avatar ||
    session?.photoUrl ||
    session?.photo_url ||
    null;

  const brainPercent = (() => {
    const bt = session?.brain_type;
    if (!bt) return 0;
    if (rep?.brain_types && typeof rep.brain_types[bt] === "number") return rep.brain_types[bt];
    const sb = session?.score_breakdown;
    if (sb) {
      const total = Object.values(sb).reduce((a, b) => a + (typeof b === "number" ? b : 0), 0);
      if (total > 0) return Math.round(((sb[bt] || 0) / total) * 100);
    }
    return 0;
  })();

  return (
    <div className="bg-[#2A2A39] lg:p-8 p-2 w-full min-h-screen">
      {showRestriction && <RestrictionPopup onClose={() => setShowRestriction(false)} />}
      <HeaderQuizDetails />
      {loading && <div className="text-white mb-4">Loading...</div>}
      {error && <div className="text-red-400 mb-4">{String(error)}</div>}
      {session && rep && (
        <>
          <Cards
            name={session?.name}
            userId={session?.user_id ? `#${session.user_id}` : undefined}
            email={session?.email}
            date={session?.submittedAt || session?.updatedAt}
            brainType={session?.brain_type}
            brainPercent={brainPercent}
            avatar={avatar}
            report={rep}
          />
          <DetailsChart chartData={rep?.brain_types} />
        </>
      )}
    </div>
  );
};

export default QuizDetials;
