import React, { useMemo, useState } from "react";
import ManualEmailCard from "./cards/ManualEmailCard";
import FileEmailCard from "./cards/FileEmailCard";
import CategoryFilter from "./CategoryFilter";
import Popup from "../popup";
/** Renders a list of sequences plus the Category dropdown inside */
export default function AnalyticalBrainEmail({
  sequences,
  loading,
  category,               // <-- new
  onCategoryChange,
  activeTab,              // <-- new
}) {
  const [showAll, setShowAll] = useState(false);

  const isProbablyUrl = (str = "") => {
    if (typeof str !== "string") return false;
    const s = str.trim();
    return /^https?:\/\//i.test(s);
  };

  const renderedItems = useMemo(() => {
    if (!sequences) return [];
    const items = [];

    sequences.forEach((seq, outerIdx) => {
      // Shape A: Full sequence document (legacy) with type manual/file
      if (seq && typeof seq === 'object' && (seq.type === "manual" || seq.type === "file")) {
        if (seq.type === "manual") {
          (seq.emails || []).forEach((em, idx) => {
            // If manual email content itself is a URL, treat it as a file view
            if (isProbablyUrl(em?.content)) {
              items.push(
                <FileEmailCard
                  key={`${seq._id || outerIdx}-file-${em._id || idx}`}
                  title={`Email ${idx + 1}: ${seq.name}`}
                  preview={""}
                  fileUrl={em.content}
                />
              );
              return;
            }
            items.push(
              <ManualEmailCard
                key={`${seq._id || outerIdx}-${em._id || idx}`}
                title={`Email ${idx + 1}: ${seq.name}`}
                preview={em?.preview ?? em?.content?.slice(0, 120) ?? "—"}
                body={em?.content ?? ""}
              />
            );
          });
          return;
        }

        if (seq.type === "file") {
          items.push(
            <FileEmailCard
              key={seq._id || outerIdx}
              title={`${seq.name} (File)`}
              preview={seq?.emails?.[0]?.content?.slice(0, 120)}
              fileUrl={seq.fileUrl}
            />
          );
          return;
        }
      }

      // Shape B: Grouped endpoint item — this is a single email object enriched with sequenceName
      // Expected fields: { _id, content, type: BrainType, sequenceName, category }
      if (seq && typeof seq === 'object' && (seq.content || seq.sequenceName)) {
        if (isProbablyUrl(seq.content)) {
          items.push(
            <FileEmailCard
              key={seq._id || `${seq.sequenceName || 'email'}-file-${outerIdx}`}
              title={`${seq.sequenceName || 'Email'}${seq.type ? ` — ${seq.type}` : ''}`}
              preview={""}
              fileUrl={seq.content}
                sequenceId={seq.sequenceId}   // ✅ fixed
                    emailId={seq?._id}   // <-- pass emailId here


            />
          );
          return;
        }
        items.push(
  <ManualEmailCard
    key={seq._id || `${seq.sequenceName || 'email'}-${outerIdx}`}
    emailId={seq?._id}   // <-- pass emailId here
    title={`${seq.sequenceName || 'Email'}${seq.type ? ` — ${seq.type}` : ''}`}
    preview={seq.content ? seq.content.slice(0, 120) : "—"}
    body={seq.content || ""}
  sequenceId={seq.sequenceId}   // ✅ fixed

  />
);
        return;
      }

      // Fallback for unknown shapes
      items.push(
        <div key={seq?._id || `unknown-${outerIdx}`} className="bg-[#23232A] p-6 mb-6">
          <h3 className="text-base font-semibold mb-2">{seq?.name || "Unknown Email"}</h3>
          <p className="text-sm text-[#B0B0B0]">Unsupported email shape.</p>
        </div>
      );
    });
    return items;
  }, [sequences]);
  return (
    <div className="bg-[#303041] text-white mt-10">
      <div className="lg:p-6 p-2">
        <h2 className="text-xl font-semibold">
          {activeTab ? `${activeTab} Type Emails` : "Email Templates"}
        </h2>
      </div>
      {/* Category dropdown inside this component */}
      <div className="lg:p-6 p-2">
        <CategoryFilter value={category} onChange={onCategoryChange} />
      </div>

      <div className="lg:p-6 p-2">
        <h2 className="text-xl font-semibold mb-6">Email Templates</h2>

        {loading && <div className="text-white mt-2">Loading…</div>}
        {!loading && (!sequences || sequences.length === 0) && (
          <div className="text-white mt-2">No emails found.</div>
        )}

        {!loading && (showAll ? renderedItems : renderedItems.slice(0, 3))}

        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll((v) => !v)}
            disabled={renderedItems.length <= 3}
            className="bg-[#23232A] border border-[#12DCF080] text-[#B0B0B0] px-6 py-3 text-xs font-medium transition-colors hover:bg-[#292933] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {showAll ? `View Less (${renderedItems.length})` : `View All Emails (${renderedItems.length})`}
          </button>
          
        </div>

        
      </div>
    </div>
  );
}
