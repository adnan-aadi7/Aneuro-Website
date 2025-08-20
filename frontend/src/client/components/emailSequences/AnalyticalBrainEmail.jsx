import React from "react";
import ManualEmailCard from "./cards/ManualEmailCard";
import FileEmailCard from "./cards/FileEmailCard";
import CategoryFilter from "./CategoryFilter";

/** Renders a list of sequences plus the Category dropdown inside */
export default function AnalyticalBrainEmail({
  sequences,
  loading,
  category,               // <-- new
  onCategoryChange,
  activeTab,              // <-- new
}) {
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

        {!loading &&
          sequences?.map((seq) => {
            if (seq.type === "manual") {
              return seq.emails?.map((em, idx) => (
                <ManualEmailCard
                  key={`${seq._id}-${em._id || idx}`}
                  title={`Email ${idx + 1}: ${seq.name}`}
                  preview={em?.preview ?? "—"}
                  body={em?.content ?? ""}
                />
              ));
            }

            if (seq.type === "file") {
              return (
                <FileEmailCard
                  key={seq._id}
                  title={`${seq.name} (File)`}
                  preview={seq?.emails?.[0]?.content?.slice(0, 120)}
                  fileUrl={seq.fileUrl}
                />
              );
            }

            return (
              <div key={seq._id} className="bg-[#23232A] p-6 mb-6">
                <h3 className="text-base font-semibold mb-2">{seq.name}</h3>
                <p className="text-sm text-[#B0B0B0]">Unsupported email type: <i>{seq.type}</i></p>
              </div>
            );
          })}

        <div className="text-center mt-8">
          <button className="bg-[#23232A] border border-[#12DCF080] text-[#B0B0B0] px-6 py-3 text-xs font-medium transition-colors hover:bg-[#292933]">
            View All Emails
          </button>
        </div>
      </div>
    </div>
  );
}
