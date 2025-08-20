import React, { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchPromptPackById,
  selectCurrentPromptPack,
  selectPromptPackLoading,
} from "../../../../store/Slice/PromptPacksSlice";

// const prompts = [
//   {
//     id: 1,
//     title: "Blog Post Creator",
//     subtitle:
//       "Create engaging blog posts that convert readers into customers...",
//     expanded: true,
//     prompt: "Lead with bold ideas — not what’s safe, but what’s next”.",
//   },
//   {
//     id: 2,
//     title: "Social Media Caption Generator",
//     subtitle:
//       "Generate compelling social media captions that drive engagement...",
//     expanded: false,
//     prompt: null,
//   },
// ];

const PromptPreview = () => {
  const dispatch = useDispatch();
  const { packId } = useParams();
  const pack = useSelector(selectCurrentPromptPack);
  const loading = useSelector(selectPromptPackLoading);

  useEffect(() => {
    if (packId) {
      dispatch(fetchPromptPackById(packId));
    }
  }, [dispatch, packId]);

  const documentUrl = pack?.fileUrl || null;
  const prompts = Array.isArray(pack?.prompts) ? pack.prompts : [];

  const getTitleByPack = () => {
    return "Uploaded Document";
  };

  return (
    <div className="w-full bg-[#303041] mx-auto p-6 mt-5">
      <div className="text-lg text-white mb-3">Prompt Preview</div>

      {/* File-based pack: show only the link button, no inline preview */}
      {!loading && documentUrl ? (
        <div className="bg-[#232334] border border-[#353545] rounded mb-6 pb-6">
          <div className="px-6 pt-6 pb-2">
            <div className="text-base text-white font-semibold">{getTitleByPack()}</div>
          </div>
          <div className="px-6">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm px-3 py-2  border border-cyan-400 text-white hover:bg-cyan-900 transition"
            >
              View Uploaded Document
            </a>
          </div>
        </div>
      ) : (
        // Manual prompts list
        <>
          {prompts.map((item, idx) => (
            <div
              key={idx}
              className={`bg-[#232334] border border-[#353545] rounded mb-6 pb-10`}
            >
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <div className="text-base text-white font-semibold">
                    {`Prompt ${idx + 1}${item?.type ? `: ${item.type}` : ""}`}
                  </div>
                  <div className="text-sm text-cyan-400 leading-tight mt-1">
                    {item?.content ? "Preview below" : ""}
                  </div>
                </div>
                <button className="border border-cyan-400 text-white text-xs px-5 py-1 rounded hover:bg-cyan-900 transition ml-4">
                  View Full Prompt
                </button>
              </div>
              {item?.content && (
                <div className="px-10 mt-8 flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-7 h-7 text-cyan-400" />
                    <span className="text-white font-bold text-xl">Prompt</span>
                  </div>
                  <div
                    className="bg-gradient-to-br from-cyan-700/40 to-transparent rounded-lg px-8 py-6 mt-2 shadow-lg border border-cyan-900/30 text-white text-lg font-medium max-w-xl w-full"
                    style={{ boxShadow: "0 2px 5px 0 #00bcd41a" }}
                  >
                    {item.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          {prompts.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="border border-cyan-400 text-white text-xs px-8 py-2 rounded hover:bg-cyan-900 transition">
                {`View All ${prompts.length} Prompts`}
              </button>
            </div>
          )}
          {prompts.length === 0 && (
            <div className="bg-[#232334] border border-[#353545] rounded p-6 text-white/70 text-sm">
              No prompts found in this pack.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PromptPreview;
