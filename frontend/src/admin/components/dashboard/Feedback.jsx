import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentFeedback, selectRecentFeedback, selectAdminDashboardLoading } from "../../../store/Slice/DashboardSliceAdmin";

const Feedback = () => {
  const dispatch = useDispatch();
  const feedback = useSelector(selectRecentFeedback);
  const loading = useSelector(selectAdminDashboardLoading);

  useEffect(() => {
    dispatch(fetchRecentFeedback(3));
  }, [dispatch]);

  return (
    <div className="bg-[#32303A]  lg:p-8 mt-10 p-3">
      <h2 className="text-white text-2xl font-medium mb-8">Recent Feedback</h2>
      {loading.feedback && (
        <div className="text-gray-400">Loading...</div>
      )}
      {!loading.feedback && feedback.length === 0 && (
        <div className="text-gray-400">No feedback yet</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 ">
        {!loading.feedback && feedback.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="w-full max-w-full relative shadow-lg overflow-hidden "
          >
            {/* Blurred circle at bottom right */}
            <div
              className="absolute right-[-30px] bottom-[-30px] w-[118px] h-[102px] opacity-50 z-0"
              style={{
                background: "#12DCF0",
                filter: "blur(100px)",
                borderRadius: "50%",
              }}
            />
            <div className="bg-[#1DE6FB] flex items-center gap-4 p-4 relative z-10 ">
              <img
                src={item.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0D8ABC&color=fff`}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-black font-semibold text-lg leading-tight ">
                  {item.name}
                </div>
                <div className="text-xs text-[#2B9EB3]">
                  User since {new Date(item.createdAt).getFullYear()}
                </div>
              </div>
            </div>
            <div className="p-4 min-h-[120px] flex flex-col justify-between relative z-10">
              <div className="text-[#BFC3C9] text-sm mb-4">{item.message}</div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < 5 ? 'text-[#FFB800]' : 'text-gray-500'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
