import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";
import { 
  createFunnelTemplateWithFile, 
  clearError, 
  clearSuccess 
} from "../../../../store/Slice/FunnelSequenceSlice";

export default function FunnelTemplateCard() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.funnelTemplate);
  const fileInputRef = useRef(null);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTiers, setSelectedTiers] = useState([]); // ["basic", "premium", "enterprise"]

  const isAllowedFile = (file) => {
    const name = file?.name?.toLowerCase() || "";
    return name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.txt');
  };

  // Handle file selection from input
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isAllowedFile(file)) {
        toast.error("Only .pdf, .doc, .txt files are allowed");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle drag and drop
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
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!isAllowedFile(file)) {
        toast.error("Only .pdf, .doc, .txt files are allowed");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleTierSelect = (e) => {
    const tier = e.target.id === "premium" ? "premium" : e.target.id === "vip" ? "enterprise" : "basic";
    console.log(`[${new Date().toISOString()}] Tier selection:`, { id: e.target.id, mappedTier: tier, checked: e.target.checked });
    setSelectedTiers((prev) =>
      e.target.checked
        ? [...new Set([...prev, tier])]
        : prev.filter((t) => t !== tier)
    );
  };

  // Handle upload submission
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (selectedTiers.length === 0) {
      toast.error("Please select at least one tier");
      return;
    }

    try {
      const formData = new FormData();
      
      // Add single file
      formData.append('file', selectedFile);

     
      const selectedTier = selectedTiers[0];
      console.log(`[${new Date().toISOString()}] Uploading with tier:`, selectedTier, 'All selected tiers:', selectedTiers);
      
      // Ensure we never send "vip" - map it to "enterprise" if somehow it exists
      const finalTier = selectedTier === "vip" ? "enterprise" : selectedTier;
      console.log(`[${new Date().toISOString()}] Final tier being sent:`, finalTier);
      
      formData.append('tier', finalTier);
      
      // Debug: Log all FormData entries
      console.log(`[${new Date().toISOString()}] FormData contents:`);
      for (let [key, value] of formData.entries()) {
        console.log(`[${new Date().toISOString()}] ${key}:`, value);
      }

      // Add metadata
      formData.append('name', `Funnel Template ${Date.now()}`);

      await dispatch(createFunnelTemplateWithFile(formData)).unwrap();
      
      // Reset form on success
      setSelectedFile(null);
      setSelectedTiers([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Clear messages when component unmounts or when they change
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  return (
    <div className="bg-[#232B39] p-6 w-full mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded flex items-center justify-center mt-1 border border-[#22C55E]">
          <span className="text-[#22C55E] text-xl">🔗</span>
        </div>
        <div>
          <h2 className="text-white font-medium text-base">Funnel Templates</h2>
          <p className="text-gray-400 text-xs mt-1">
            Marketing funnel templates &<br />
            workflows
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-500 bg-[#11182780] rounded-lg p-12 text-center mt-19 ${
          isDragOver ? "ring-2 ring-cyan-400" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <Upload className="w-8 h-8  mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-3">Drag & drop a file here</p>
          <label className="inline-block">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.txt"
              onChange={handleFileUpload}
            />
            <span className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition">
              Choose File
            </span>
          </label>
        </div>
        <p className="text-gray-500 text-xs">Accept: pdf, doc, txt</p>
        {/* Show selected file name (truncated within card width) */}
        {selectedFile && (
          <div className="text-gray-300 text-xs mt-2 flex items-center gap-1">
            <span>Selected:</span>
            <span className="truncate flex-1" title={selectedFile.name}>{selectedFile.name}</span>
          </div>
        )}
        {/* Show loading */}
        {loading && <div className="text-blue-400 text-xs mt-2">Uploading...</div>}
      </div>

      {/* Tier Access Control */}
      <div className="  p-2 ">
        <h3 className="text-white text-sm font-medium mt-5">
          Tier Access Control
        </h3>
        <div className="space-y-3 mt-3">
          {/* Basic Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              id="basic"
              checked={selectedTiers.includes("basic")}
              onChange={handleTierSelect}
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
              id="premium"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              checked={selectedTiers.includes("premium")}
              onChange={handleTierSelect}
            />
            <img
              src={KingIcon}
              alt="Premium"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
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
              id="vip"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
              checked={selectedTiers.includes("enterprise")}
              onChange={handleTierSelect}
            />
            <img
              src={DiamondIcon}
              alt="VIP"
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Enterprise</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  45 users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Enterprise access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="mt-3 w-full bg-cyan-400 text-black font-medium py-3  hover:bg-cyan-300 transition-colors text-sm"
        disabled={loading}
      >
        Upload Funnel Templates
      </button>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
