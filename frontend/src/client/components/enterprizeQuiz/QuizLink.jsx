import React, { useState, useEffect } from "react";
import axiosInstance from "../../../store/axiosInstance";

const CYAN = "#2de0fb";

const QuizLink = () => {
  const [copied, setCopied] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const [userId, setUserId] = useState("");

  // ✅ Get userId from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser?.id || parsedUser?._id || "");
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  // ✅ Fetch tokenized URL from API
  useEffect(() => {
    const fetchLink = async () => {
      if (!userId) return;

      try {
        const res = await axiosInstance.get(`/redirectlink/${userId}`);
        // we only need tokenizedUrl here
        setQuizLink(res.data?.tokenizedUrl || "");
      } catch (err) {
        console.error("Error fetching quiz link:", err);
        setQuizLink("");
      }
    };

    fetchLink();
  }, [userId]);

  // ✅ Copy to clipboard
  const handleCopy = () => {
    if (!quizLink) return;
    navigator.clipboard.writeText(quizLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="bg-[#2A2A39] p-6 w-full border border-[#2de0fb33] shadow-lg relative mt-3"
      style={{ boxShadow: `inset 0 0 20px 0 ${CYAN}80` }}
    >
      <h2 className="text-white text-lg font-medium mb-4">
        Quiz Link Generator
      </h2>

      <div className="flex items-center border border-[#393945] px-4 py-3 rounded-lg">
        <input
          type="text"
          value={quizLink || "Fetching link..."}
          disabled
          className="bg-transparent text-gray-400 flex-1 outline-none border-none select-all cursor-default text-sm"
        />

        <button
          className="ml-3 p-1 transition cursor-pointer flex items-center"
          title={copied ? "Copied!" : "Copy link"}
          onClick={handleCopy}
          disabled={!quizLink}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="7"
              y="7"
              width="10"
              height="10"
              rx="2"
              stroke={copied ? CYAN : "#12DCF0"}
              strokeWidth="2"
            />
            <rect
              x="3"
              y="3"
              width="10"
              height="10"
              rx="2"
              stroke={copied ? CYAN : "#12DCF0"}
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
          {copied && (
            <span className="ml-2 text-xs text-[#12DCF0] font-semibold">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizLink;
