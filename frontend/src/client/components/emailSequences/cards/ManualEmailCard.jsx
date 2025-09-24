import React, { useState } from "react";
import axiosInstance from "../../../../store/axiosInstance";
import Popup from "../../popup";

export default function ManualEmailCard({ sequenceId, emailId, title, preview, body }) {
  const [expanded, setExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleViewFull = async () => {
    try {
      // ✅ Always track an open
      await axiosInstance.get(`/email-sequences/${emailId}/open`);

      // ✅ Track a unique click only first time when expanding
      if (!expanded) {
        await axiosInstance.post(`/email-sequences/${emailId}/click`);
      }

      setExpanded(!expanded);
    } catch (error) {
      console.error("Error tracking email open/click:", error);
    }
  };

  const renderBody = () => {
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
        </div>
        <button
          onClick={handleViewFull}
          className="border border-[#12DCF080] text-[#B0B0B0] px-4 py-2 z-10 cursor-pointer text-xs font-medium transition-colors hover:bg-[#292933]">
          {expanded ? "Hide Email" : "View Full Email"}
        </button>
      </div>

      <div className="bg-transparent rounded-lg p-4 text-sm space-y-4">
        {renderBody()}
      </div>

      {/* Rate button */}
      <div className="flex items-end justify-end">
        <button
          onClick={() => setShowPopup(true)}
          className="text-cyan-400 underline text-sm font-semibold hover:text-cyan-300 cursor-pointer">
          Rate This Tool
        </button>
      </div>

      {/* Popup */}
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        sequenceId={sequenceId}
        emailId={emailId}
      />
    </div>
  );
}
