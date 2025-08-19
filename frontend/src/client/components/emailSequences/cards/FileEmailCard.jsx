import React from "react";

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

export default function FileEmailCard({ title, preview, fileUrl }) {
  const { name, ext } = getFileMeta(fileUrl);
  const canDownload = DOWNLOADABLE.has(ext);

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

      {/* Simple file row: name + actions */}
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
          {/* View (always) */}
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-[#12DCF080] text-[#B0B0B0] px-3 py-2 text-xs font-medium hover:bg-[#292933]"
          >
            View
          </a>

          {/* Download only for txt/word */}
          {canDownload && (
            <a
              href={fileUrl}
              download={name}  // will work if CORS/headers allow
              className="border border-[#12DCF080] text-[#B0B0B0] px-3 py-2 text-xs font-medium hover:bg-[#292933]"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
