import React, { useState } from "react";

/** Renders a single manual email block with your dark UI styling */
export default function ManualEmailCard({ title, preview, body }) {
  const [showTip, setShowTip] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="bg-[#23232A] p-6 mb-6 relative"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
    >
      {showTip && (
        <div
          className="pointer-events-none bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap"
          style={{ position: "absolute", left: pos.x + 10, top: pos.y + 10 }}
        >
          Full manual email preview (subject, preview, content).
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-semibold mb-2">
            {title ?? "Email"}{" "}
            <span role="img" aria-label="lock" className="inline align-middle">
              🔐
            </span>
          </h3>
          {preview ? (
            <p className="text-[#12DCF0] text-sm">{preview}</p>
          ) : null}
        </div>
        <button className="border border-[#12DCF080] text-[#B0B0B0] px-4 py-2 text-xs font-medium transition-colors hover:bg-[#292933]">
          View Full Email
        </button>
      </div>

      <div className="bg-transparent rounded-lg p-4 text-sm text-[#B0B0B0] space-y-4">
        {Array.isArray(body)
          ? body.map((p, i) => (
              <p key={i} className="leading-6 whitespace-pre-wrap">
                {p}
              </p>
            ))
          : <p className="leading-6 whitespace-pre-wrap">{body}</p>}
        <div className="text-sm text-[#B0B0B0]">
          <p>Best regards,</p>
          <p>The Aneuro Team</p>
        </div>
      </div>
    </div>
  );
}
