import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../store/axiosInstance";
const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/reviews");
        // take only 3 reviews
        setFeedback(res.data?.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="bg-[#32303A] lg:p-8 mt-10 p-3">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-2xl font-medium">Recent Feedback</h2>
        <button
          onClick={() => navigate("/admin/reviews")} // ✅ navigate to all reviews
          className="text-cyan-400 hover:underline text-sm cursor-pointer"
        >
          View All
        </button>
      </div>

      {loading && <div className="text-gray-400">Loading...</div>}
      {!loading && feedback.length === 0 && (
        <div className="text-gray-400">No feedback yet</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
        {!loading &&
          feedback.map((item, idx) => (
            <div
              key={idx}
              className="w-full max-w-full relative shadow-lg overflow-hidden"
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
              <div className="bg-[#1DE6FB] flex items-center gap-4 p-4 relative z-10">
                <img
                  src={
                    item.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.name
                    )}&background=0D8ABC&color=fff`
                  }
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-black font-semibold text-lg leading-tight">
                    {item.userName || item.name}
                  </div>
                  <div className="text-xs text-[#2B9EB3]">
                    {item.memberSince}
                  </div>
                </div>
              </div>
              <div className="p-4 min-h-[120px] flex flex-col justify-between relative z-10">
                <div className="text-[#BFC3C9] text-sm mb-4">
                  {item.review}
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < item.rating ? "text-[#FFB800]" : "text-gray-500"
                      }`}
                    >
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
