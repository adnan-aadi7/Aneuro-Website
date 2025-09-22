import React, { useState, useEffect } from "react";
import HeaderQuizDetails from "../../components/analyticsOverview/details/HeaderQuizDetails";
import Cards from "../../components/analyticsOverview/details/Cards";
import DetailsChart from "../../components/analyticsOverview/details/DetailsChart";
import RestrictionPopup from "../../components/ResultOverview/RestrictionPopup";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAudienceQuizReport } from "../../../store/Slice/AudienceQuizSlice";

const QuizDetials = () => {
  const { userId, audienceId } = useParams();
  const [showRestriction, setShowRestriction] = useState(false);
  const dispatch = useDispatch();
  const { report: reportState } = useSelector((s) => s.audienceQuiz);
  const loading = reportState.loading;
  const error = reportState.error;
  const reportData = reportState.data;

  useEffect(() => {
    const subscriptionStr = localStorage.getItem("subscription");
    let plan = null;
    if (subscriptionStr) {
      try {
        const subscription = JSON.parse(subscriptionStr);
        plan = subscription?.plan;
      } catch {
        plan = null;
      }
    }
    if (plan === "starter") {
      setShowRestriction(true);
    }
  }, []);

  useEffect(() => {
    if (!userId || !audienceId) return;
    dispatch(fetchAudienceQuizReport({ user_id: userId, audience_id: audienceId }));
  }, [dispatch, userId, audienceId]);

  console.log("reportData", reportData);

  return (
    <div className="bg-[#2A2A39] lg:p-8 p-2 w-full min-h-screen">
      {showRestriction && (
        <RestrictionPopup onClose={() => setShowRestriction(false)} />
      )}
      <HeaderQuizDetails />
      {loading && <div className="text-white mb-4">Loading...</div>}
      {error && <div className="text-red-400 mb-4">{String(error)}</div>}
      {(() => {
        const session = Array.isArray(reportData?.sessions) ? reportData.sessions[0] : null;
        const rep = reportData?.report;
        const avatar = session?.profilePicture || session?.profile_picture || session?.avatar || session?.photoUrl || session?.photo_url || null;
        const brainPercent = (() => {
          const bt = session?.brain_type;
          if (!bt) return 0;
          if (rep?.brain_types && typeof rep.brain_types[bt] === 'number') {
            return rep.brain_types[bt];
          }
          // fallback: compute from score_breakdown
          const sb = session?.score_breakdown;
          if (sb) {
            const total = Object.values(sb).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
            if (total > 0) return Math.round(((sb[bt] || 0) / total) * 100);
          }
          return 0;
        })();
        return (
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
        );
      })()}
    </div>
  );
};

export default QuizDetials;
