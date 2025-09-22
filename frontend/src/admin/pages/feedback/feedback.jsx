import React, { useEffect, useState } from "react";
import axiosInstance from "../../../store/axiosInstance";

const Feedback = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/reviews");
        setReviews(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!loading && reviews.length === 0) {
    return <div className="text-gray-400">No feedback yet</div>;
  }

  return (
    <div className="bg-[#32303A] p-6 lg:p-10 mt-10">
      <h2 className="text-white text-2xl font-medium mb-8">All Feedback</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {reviews.map((item) => (
          <div
            key={item._id}
            className="w-full max-w-full relative shadow-lg overflow-hidden "
          >
            {/* Background blur effect */}
            <div
              className="absolute right-[-30px] bottom-[-30px] w-[118px] h-[102px] opacity-50 z-0"
              style={{
                background: "#12DCF0",
                filter: "blur(100px)",
                borderRadius: "50%",
              }}
            />

            {/* Header with user info */}
            <div className="bg-[#1DE6FB] flex items-center gap-4 p-4 relative z-10">
              <img
                src={
                  item.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.userName || "User"
                  )}&background=0D8ABC&color=fff`
                }
                alt={item.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-black font-semibold text-lg leading-tight">
                  {item.userName}
                </div>
                <div className="text-xs text-[#2B9EB3]">{item.memberSince}</div>
              </div>
            </div>

            {/* Review content */}
            <div className="p-4 min-h-[120px] flex flex-col justify-between relative z-10">
              <div className="text-[#BFC3C9] text-sm mb-4">{item.review}</div>

              {/* Rating */}
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
