"use client";
import React, { useState } from "react";
import axiosInstance from "../../../../store/axiosInstance";

export default function ManualEmailCard({ emailId, title, preview, body }) {
  const [expanded, setExpanded] = useState(false);

  const handleViewFull = async () => {
    try {
      if (!expanded) {
        // count click only when expanding (not collapsing)
        await axiosInstance.post(`/email-sequences/${emailId}/click`);
      }
      setExpanded(!expanded);
    } catch (error) {
      console.error("Error tracking email click:", error);
    }
  };

  const renderBody = () => {
    // normalize body into a single string
    const content = Array.isArray(body) ? body.join("\n\n") : body;

    return (
      <p
        className={`leading-6 text-[#B0B0B0] whitespace-pre-wrap transition-all duration-300 ${
          expanded ? "max-h-none" : "max-h-12 overflow-hidden"
        }`}
      >
        {content}
      </p>
    );
  };

  return (
    <div className="bg-[#23232A] p-6 mb-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-semibold mb-2">
            {title ?? "Email"}{" "}
            <span role="img" aria-label="lock" className="inline align-middle">
              🔐
            </span>
          </h3>
        {/*  {preview ? (
            <p className="text-[#12DCF0] text-sm">{preview}</p>
          ) : null} */}
        </div>
        <button
          onClick={handleViewFull}
          className="border border-[#12DCF080] text-[#B0B0B0] px-4 py-2 z-10 cursor-pointer text-xs font-medium transition-colors hover:bg-[#292933]"
        >
          {expanded ? "Hide Email" : "View Full Email"}
        </button>
      </div>

      <div className="bg-transparent rounded-lg p-4 text-sm space-y-4">
        {renderBody()}
       {/* <div className="text-sm text-[#B0B0B0]">
          <p>Best regards,</p>
          <p>The Aneuro Team</p>
        </div> */}
      </div>
    </div>
  );
}
