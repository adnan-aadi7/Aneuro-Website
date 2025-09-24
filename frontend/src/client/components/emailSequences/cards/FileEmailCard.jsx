import React, { useState } from "react";
import Popup from "../../popup";
import axiosInstance from "../../../../store/axiosInstance";

function getFileMeta(url = "") {
  try {
    const u = new URL(url);
    const name = decodeURIComponent(u.pathname.split("/").pop() || "file");
    const ext = name.split(".").pop()?.toLowerCase() || "";
    return { name, ext };
  } catch {
    // not a full URL – fallback
    const name = decodeURIComponent(url.split("/").pop() || "file");
    const ext = name.split(".").pop()?.toLowerCase() || "";
    return { name, ext };
  }
}

const DOWNLOADABLE = new Set(["txt", "doc", "docx"]);

export default function FileEmailCard({ sequenceId, emailId, title, preview, fileUrl }) {
  const { name, ext } = getFileMeta(fileUrl);
  const canDownload = DOWNLOADABLE.has(ext);
  const [showPopup, setShowPopup] = useState(false);
  const [viewed, setViewed] = useState(false); // track if already clicked

  const handleViewClick = async () => {
    try {
      // ✅ Always count an open
      await axiosInstance.get(`/email-sequences/${emailId}/open`);

      // ✅ Track a unique click only first time
      if (!viewed) {
        await axiosInstance.post(`/email-sequences/${emailId}/click`);
        setViewed(true);
      }
    } catch (error) {
      console.error("Error tracking file email open/click:", error);
    }
  };

  return (
    <div className="bg-[#23232A] p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {title ?? "Email (File)"}
          </h3>
          {preview ? (
            <p className="text-[#12DCF0] text-sm">{preview}</p>
          ) : null}
        </div>
      </div>

      {/* File row: name + actions */}
      <div className="flex items-center justify-between bg-[#1c1c22] rounded-lg p-3">
        <div className="text-sm text-[#B0B0B0] truncate">
          <span className="mr-2 inline-block px-2 py-0.5 rounded bg-[#2b2b35] text-xs uppercase tracking-wide">
            {ext || "file"}
          </span>
          <span title={name} className="align-middle truncate max-w-[55vw] inline-block">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View (always available, with tracking) */}
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleViewClick}
            className="border border-[#12DCF080] text-[#B0B0B0] px-3 py-2 text-xs font-medium hover:bg-[#292933]"
          >
            View
          </a>

          {/* Download only for txt/word */}
          {canDownload && (
            <a
              href={fileUrl}
              download={name}
              className="border border-[#12DCF080] text-[#B0B0B0] px-3 py-2 text-xs font-medium hover:bg-[#292933]"
            >
              Download
            </a>
          )}
        </div>
      </div>

      {/* Rate tool */}
      <div className="flex items-end justify-end mt-4">
        <button
          onClick={() => setShowPopup(true)}
          className="text-cyan-400 underline text-sm font-semibold hover:text-cyan-300 cursor-pointer"
        >
          Rate This Tool
        </button>
      </div>

      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        sequenceId={sequenceId}
        emailId={emailId}
      />
    </div>
  );
}
