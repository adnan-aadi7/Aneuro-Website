import React from "react";
import { Copy } from "lucide-react";

/**
 * props:
 *  - packs: array of packs from Redux
 *  - brainType: "Architect" | "Challenger" | "Synthesizer" | "Reflector" | "Catalyst"
 *  - onCopy: (packId, content) => void
 */
export default function PromptResults({ packs = [], brainType, onCopy }) {
  const items = [];
  for (const p of packs) {
    const typed = (p.prompts || []).filter((pr) => pr.type === brainType);
    if (typed.length) {
      items.push({
        packId: p._id,
        packName: p.name,
        status: p.status,
        tier: p.tier,
        category: p.category,
        usageCount: p.usageCount || 0,
        fileUrl: p.fileUrl || null,
        prompts: typed,
      });
    }
  }

  if (!items.length) {
    return (
      <div className="mt-6 text-sm text-gray-400">
        No prompts found for <span className="text-white font-medium">{brainType}</span> in the selected category.
      </div>
    );
  }

  const isFileLike = (content) => {
    if (!content) return false;
    const lower = String(content).toLowerCase();
    return lower.startsWith("http") || lower.endsWith(".pdf") || lower.endsWith(".docx") || lower.endsWith(".txt");
  };

  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <div key={item.packId} className="bg-[#23232F] p-5 rounded border border-[#3a3a48]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white font-medium">{item.packName}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#111] text-gray-300 border border-[#333]">{item.tier}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#111] text-gray-300 border border-[#333]">{item.status}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#111] text-gray-300 border border-[#333]">{item.category}</span>
              <span className="text-xs text-gray-400">uses: {item.usageCount}</span>
            </div>
          </div>

          {item.fileUrl && (
            <div className="mb-3">
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline break-all">
                Open attached file
              </a>
            </div>
          )}

          <div className="space-y-3">
            {item.prompts.map((pr) => {
              const fileLike = isFileLike(pr.content);
              return (
                <div key={pr._id} className="bg-[#1d1d27] border border-[#333] rounded p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-300 break-words">
                      {!fileLike ? (
                        <pre className="whitespace-pre-wrap font-sans text-gray-200">{pr.content}</pre>
                      ) : (
                        <a href={pr.content} target="_blank" rel="noreferrer" className="text-cyan-400 underline break-all">
                          Open prompt file
                        </a>
                      )}
                    </div>

                    {!fileLike && (
                      <button
                        onClick={() => onCopy?.(item.packId, pr.content)}
                        className="ml-2 shrink-0 border border-[#12DCF080] text-[#12DCF0] bg-transparent px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2 hover:bg-[#23232F]"
                        title="Copy prompt"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
