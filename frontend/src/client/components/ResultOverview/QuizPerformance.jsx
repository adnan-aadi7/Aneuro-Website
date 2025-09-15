"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../store/axiosInstance";

const QuizPerformance = () => {
  const [stats, setStats] = useState({
    completedQuizzes: 0,
    totalQuizzes: 0,
    completionRate: "0%",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id || parsedUser?._id; 

        if (!userId) return;

        const res = await axiosInstance.get(
          `/user-analytics/user/${userId}/audience-stats`
        );

        if (res.data?.success) {
          setStats({
            completedQuizzes: res.data.stats.completedQuizzes,
            totalQuizzes: res.data.stats.totalQuizzes,
            completionRate: res.data.stats.completionRate,
          });
        }
      } catch (error) {
        console.error("Error fetching quiz stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-[#2A2A39] w-full p-4 md:p-8 flex flex-col text-white font-inter mb-8">
      <div className="text-2xl md:text-3xl font-medium mb-6 md:mb-8">
        Quiz Performance
      </div>
      <div className="flex flex-col md:flex-row gap-8 md:gap-20">
        {/* Submissions */}
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold mb-2 opacity-80">
            Submissions
          </span>
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {stats.completedQuizzes}
          </span>
        </div>
        {/* Views */}
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold mb-2 opacity-80">Views</span>
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {stats.totalQuizzes}
          </span>
        </div>
        {/* If you want Conversion % back, just uncomment */}
        {/* <div className="flex flex-col items-start">
          <span className="text-base font-semibold mb-2 opacity-80">
            Conversion %
          </span>
          <span className="text-3xl md:text-4xl font-bold leading-none">
            {stats.completionRate}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default QuizPerformance;
