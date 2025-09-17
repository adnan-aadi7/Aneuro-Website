import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Sparkles, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPromptPackById,
  selectCurrentPromptPack,
  selectPromptPackLoading,
} from "../../../../store/Slice/PromptPacksSlice";
import { removePromptFromPack } from "../../../../store/Slice/PromptPacksSlice";


const PromptPreview = () => {
  const dispatch = useDispatch();
  const { packId } = useParams();
  const pack = useSelector(selectCurrentPromptPack);
  const loading = useSelector(selectPromptPackLoading);
  const navigate = useNavigate();
  
  const [confirmState, setConfirmState] = useState({ open: false, promptId: null });

  const openConfirm = (promptId) => setConfirmState({ open: true, promptId });
  const closeConfirm = () => setConfirmState({ open: false, promptId: null });

  const confirmDelete = async () => {
    if (!confirmState.promptId) return;
    try {
      await dispatch(removePromptFromPack({ id: packId, promptId: confirmState.promptId })).unwrap?.();
      toast.success('Prompt deleted');
      // Refresh current pack details
      dispatch(fetchPromptPackById(packId));
    } catch {
      // best-effort; errors are handled via slice/toasts elsewhere if any
    } finally {
      closeConfirm();
    }
  };

  useEffect(() => {
    if (packId) {
      dispatch(fetchPromptPackById(packId));
    }
  }, [dispatch, packId]);

  const documentUrl = pack?.fileUrl || null;
  const prompts = Array.isArray(pack?.prompts) ? pack.prompts : [];
  const firstPromptId = Array.isArray(pack?.prompts) && pack.prompts.length > 0 ? pack.prompts[0]?._id : null;

  const getTitleByPack = () => {
    return "Uploaded Document";
  };

  return (
    <div className="w-full bg-[#303041] mx-auto p-6 mt-5">
      <Toaster position="top-right" />
      <div className="text-lg text-white mb-3">Prompt Preview</div>

      {/* File-based pack: show only the link button, no inline preview */}
      {!loading && documentUrl ? (
        <div className="bg-[#232334] border border-[#353545] rounded mb-6 pb-6 relative">
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <button
              className={`text-gray-400 hover:text-white transition-colors cursor-pointer ${!firstPromptId ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Edit Prompt"
              disabled={!firstPromptId}
              onClick={() => firstPromptId && navigate(`/admin/mannual-prompt/${packId}/${firstPromptId}`, { state: { prompt: prompts[0] } })}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className={`text-gray-400 hover:text-white transition-colors cursor-pointer ${!firstPromptId ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Delete Prompt"
              disabled={!firstPromptId}
              onClick={() => firstPromptId && openConfirm(firstPromptId)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
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
              className={`bg-[#232334] border border-[#353545] rounded mb-6 pb-10 relative`}
            >
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Edit Prompt"
                  onClick={() =>
                    navigate(`/admin/mannual-prompt/${packId}/${item._id}`, {
                      state: { prompt: item }
                    })
                  }
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Delete Prompt"
                  onClick={() => openConfirm(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <div className="text-base text-white font-semibold">
                    {`Prompt ${idx + 1}${item?.type ? `: ${item.type}` : ""}`}
                  </div>
                  <div className="text-sm text-cyan-400 leading-tight mt-1">
                    {item?.content ? "Preview below" : ""}
                  </div>
                </div>
                <button className=" mt-5 border border-cyan-400 text-white text-xs px-5 py-1 rounded hover:bg-cyan-900 transition ml-4">
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

      {confirmState.open && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937] p-6 w-full max-w-md mx-4">
            <div className="text-white text-lg font-semibold mb-4">Delete Prompt</div>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this prompt? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-500" onClick={closeConfirm}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-500" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPreview;
