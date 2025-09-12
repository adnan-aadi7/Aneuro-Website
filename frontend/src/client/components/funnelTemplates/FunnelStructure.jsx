import React from "react";
import FunnelCategoryFilter from "./FunnelCategoryFilter";

function getFileMeta(url = "") {
  try {
    const u = new URL(url);
    const name = decodeURIComponent(u.pathname.split("/").pop() || "file");
    const ext = name.split(".").pop()?.toLowerCase() || "";
    return { name, ext };
  } catch {
    const name = decodeURIComponent(url.split("/").pop() || "file");
    const ext = name.split(".").pop()?.toLowerCase() || "";
    return { name, ext };
  }
}
const DOWNLOADABLE = new Set(["txt", "doc", "docx"]);

export default function FunnelStructure({
  templates,
  loading,
  activeTab,
  category,
  onCategoryChange,
}) {
  console.log('====================================');
  console.log(templates);
  console.log('====================================');
  return (
    <div className="bg-[#303041] text-white mt-10">
      {/* Top heading like emails */}
      <div className="lg:p-6 p-2">
        <h2 className="text-xl font-semibold">
          {activeTab ? `${activeTab} Funnel Templates` : "Funnel Templates"}
        </h2>
      </div>

      {/* Category dropdown inside */}
      <div className="lg:p-6 p-2">
        <FunnelCategoryFilter value={category} onChange={onCategoryChange} />
      </div>

      <div className="lg:p-6 p-2">
        {loading && <div className="text-white mt-2">Loading…</div>}
        {!loading && (!templates || templates.length === 0) && (
          <div className="text-white mt-2">No templates found.</div>
        )}

        {!loading &&
          templates?.map((tpl) => {
            // Simple card per template (name + optional file row)
            const hasFile = !!tpl.fileUrl;
            const file = hasFile ? getFileMeta(tpl.fileUrl) : null;
            const canDownload = hasFile && DOWNLOADABLE.has(file.ext);

            return (
              <div key={tpl._id} className="bg-[#23232A] p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-semibold mb-1">
                      {tpl.name || "Funnel Template"}
                    </h3>
                    {tpl.description ? (
                      <p className="text-[#12DCF0] text-sm">{tpl.description}</p>
                    ) : null}
                  </div>
                </div>

                {/* If template has file, list row with View / Download (no inline preview) */}
                {hasFile && (
                  <div className="flex items-center justify-between bg-[#1c1c22] rounded-lg p-3">
                    <div className="text-sm text-[#B0B0B0] truncate">
                      <span className="mr-2 inline-block px-2 py-0.5 rounded bg-[#2b2b35] text-xs uppercase tracking-wide">
                        {file.ext || "file"}
                      </span>
                      <span title={file.name} className="align-middle truncate max-w-[55vw] inline-block">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={tpl.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-[#12DCF080] text-[#B0B0B0] px-3 py-2 text-xs font-medium hover:bg-[#292933]"
                      >
                        View
                      </a>
                      {canDownload && (
                        <a
                          href={tpl.fileUrl}
                          download={file.name}
                          className="border border-[#12DCF080] text-[#B0B0B0] px-3 py-2 text-xs font-medium hover:bg-[#292933]"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        <div className="text-center mt-8">
          <button className="bg-[#23232A] border border-[#12DCF080] text-[#B0B0B0] px-6 py-3 text-xs font-medium transition-colors hover:bg-[#292933]">
            View All Templates
          </button>
        </div>
      </div>
    </div>
  );
}
