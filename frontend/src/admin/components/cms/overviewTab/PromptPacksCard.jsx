import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import {
  uploadPromptPack,
  selectPromptPackLoading,
  selectPromptPackError,
  selectPromptPackSuccess,
  clearError as clearPromptPackError,
  clearSuccess as clearPromptPackSuccess,
} from "../../../../store/Slice/PromptPacksSlice";
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";

export default function PromptPacksCard() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTier, setSelectedTier] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectPromptPackLoading);
  const error = useSelector(selectPromptPackError);
  const success = useSelector(selectPromptPackSuccess);

  useEffect(() => {
    if (success) {
      toast.success(success);
      setSelectedFile(null);
      setSelectedTier("");
      dispatch(clearPromptPackSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "Operation failed");
      dispatch(clearPromptPackError());
    }
  }, [error, dispatch]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleManualPromptChange = (e) => {
    if (e.target.checked) {
      navigate("/admin/mannual-prompt");
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile || !selectedTier) {
      toast.error("Please select a file first");
      return;
    }
    dispatch(uploadPromptPack({ file: selectedFile, tier: selectedTier }));
  };

  return (
    <div className="bg-[#232B39] lg:p-6 w-full p-6  mx-auto">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded flex items-center justify-center mt-1 border border-[#FFD600]">
          <span className="text- text-xl">💡</span>
        </div>
        <div>
          <h2 className="text-white  font-medium text-base">Prompt Packs</h2>
          <p className="text-gray-400 text-xs mt-1">
            AI prompts and template
            <br />
            collections
          </p>
        </div>
      </div>

      {/* Manual Prompt Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-white text-sm">Manual Prompt</span>
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
          onChange={handleManualPromptChange}
        />
      </div>

      {/* Upload Area */}
      <div
        className={`mt-8 border-2 border-dashed border-gray-500 bg-[#11182780] rounded-lg p-12 text-center mb-6 ${
          isDragOver ? "ring-2 ring-cyan-400" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <Upload className="w-8 h-8  mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-3">Drag & drop files here</p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition">
              Choose Files
            </span>
          </label>
        </div>
        <p className="text-gray-500 text-xs">Accepts all file formats</p>
        {selectedFile && (
          <div className="text-gray-300 text-xs mt-2 truncate" title={selectedFile.name}>
            Selected: {selectedFile.name}
          </div>
        )}
        {loading && <div className="text-cyan-400 text-xs mt-2">Uploading...</div>}
      </div>

      {/* Tier Access Control */}
      <div className="">
        <h3 className="text-white text-sm font-medium mb-4">
          Tier Access Control
        </h3>
        <div className="space-y-3">
          {/* Basic Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="tier"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              onChange={() => setSelectedTier("basic")}
              checked={selectedTier === "basic"}
            />
            <img
              src={StarIcon}
              alt="Basic"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Basic</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  1250 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Free tier users</div>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="flex items-center gap-3">
            <input
            type="checkbox"
              name="tier"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              onChange={() => setSelectedTier("premium")}
              checked={selectedTier === "premium"}
            />
            <img
              src={KingIcon}
              alt="Premium"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Premium</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  320 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Paid subscribers</div>
            </div>
          </div>

          {/* VIP Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="tier"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              onChange={() => setSelectedTier("enterprise")}
              checked={selectedTier === "enterprise"}
            />
            <img
              src={DiamondIcon}
              alt="VIP"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">VIP</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  45 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Exclusive access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        className="w-full bg-cyan-400 text-[#232432] font-medium py-3 rounded hover:bg-cyan-300 transition-colors text-sm mt-5"
        onClick={handleUploadClick}
        disabled={loading}
      >
        Upload Prompt Packs
      </button>
    </div>
  );
}
