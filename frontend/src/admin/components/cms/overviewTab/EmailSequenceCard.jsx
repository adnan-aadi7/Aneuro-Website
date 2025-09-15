// import { useState } from "react";
import { useState, useEffect } from "react";
import { Upload, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createEmailSequence, fetchEmailCategories, createCategory as createEmailCategory, selectEmailSequenceLoading, selectEmailSequenceError, selectEmailSequenceSuccess, clearError, clearSuccess } from "../../../../store/Slice/EmailSequenceSLice";
import { getAllUsers } from "../../../../store/Slice/UserSlice";
import { Toaster, toast } from "react-hot-toast";
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";

export default function EmailSequenceCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectEmailSequenceLoading);
  const error = useSelector(selectEmailSequenceError);
  const success = useSelector(selectEmailSequenceSuccess);

  // Local state for file, tier, and fields
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTiers, setSelectedTiers] = useState([]); // ["basic", "premium", "enterprise"]
  const [sequenceName, setSequenceName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brainType, setBrainType] = useState("Architect");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submittingAction, setSubmittingAction] = useState(null); // 'active' | 'scheduled' | null

  // Categories from store
  const categories = useSelector((state) => state.emailSequence.categories || []);
  const categoriesLoading = useSelector((state) => state.emailSequence.categoriesLoading);

  // Users data for tier counts
  const users = useSelector((state) => state.user.users || []);
  const usersLoading = useSelector((state) => state.user.usersLoading);

  const isAllowedFile = (file) => {
    const name = file?.name?.toLowerCase() || "";
    return name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.txt');
  };

  // Toast on success/error
  useEffect(() => {
    if (success) {
      toast.success(success);
      setSelectedFile(null);
      setSelectedTiers([]);
      setSequenceName("");
      setSelectedCategory("");
      setSubmittingAction(null);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Operation failed');
      setSubmittingAction(null);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchEmailCategories());
  }, [dispatch]);

  // Load users for tier counts
  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 1000 })); // Get all users for accurate counts
  }, [dispatch]);
  console.log("users tiers counts",users);

  // Calculate tier user counts
  const getTierUserCounts = () => {
    if (usersLoading || !users.length) return { basic: 0, premium: 0, enterprise: 0 };
    
    const counts = { basic: 0, premium: 0, enterprise: 0 };
    
    users.forEach(user => {
      if (user.userType === 'admin') return; // Skip admin users
      
      const plan = user.subscription?.plan?.toLowerCase();
      const hasSubscription = user.subscription && user.subscription.status === 'active';
      
      // Only count users with active subscriptions
      if (hasSubscription) {
        if (plan === 'growth') {
          counts.premium++;
        } else if (plan === 'enterprise') {
          counts.enterprise++;
        } else if (plan === 'starter') {
          counts.basic++;
        }
      }
      // Users without subscription or inactive subscription are NOT counted
    });
    
    return counts;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isAllowedFile(file)) {
        toast.error("Only .pdf, .doc, .docx, .txt files are allowed");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // setIsDragOver(true); // This line was removed as per the edit hint
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // setIsDragOver(false); // This line was removed as per the edit hint
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // setIsDragOver(false); // This line was removed as per the edit hint
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!isAllowedFile(file)) {
        toast.error("Only .pdf, .doc, .docx, .txt files are allowed");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleTierSelect = (e) => {
    const tier = e.target.id === "premium" ? "premium" : e.target.id === "vip" ? "enterprise" : "basic";
    setSelectedTiers((prev) =>
      e.target.checked
        ? [...new Set([...prev, tier])]
        : prev.filter((t) => t !== tier)
    );
  };

  const handleUpload = (desiredStatus = 'active') => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    
    if (selectedTiers.length === 0) {
      toast.error("Please select at least one tier");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!brainType) {
      toast.error("Please select a brain type");
      return;
    }
    
    // Only one tier allowed per upload (based on backend model)
    const tierMap = { basic: 'starter', premium: 'growth', enterprise: 'enterprise' };
    const backendTier = tierMap[selectedTiers[0]] || 'starter';

    const payload = {
      name: sequenceName?.trim() || selectedFile.name,
      tier: backendTier,
      type: "file",
      brainType,
      category: selectedCategory,
      file: selectedFile,
      status: desiredStatus,
    };
    setSubmittingAction(desiredStatus);
    dispatch(createEmailSequence(payload));
  };

  const handleStartAddCategory = () => {
    setShowAddCategory(true);
    setNewCategoryName("");
  };

  const handleSaveCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      await dispatch(createEmailCategory(name)).unwrap?.();
      await dispatch(fetchEmailCategories());
      setSelectedCategory(name);
      setShowAddCategory(false);
      setNewCategoryName("");
      toast.success("Category created");
    } catch (e) {
      toast.error(typeof e === 'string' ? e : 'Failed to create category');
    }
  };

  const handleCancelAddCategory = () => {
    setShowAddCategory(false);
    setNewCategoryName("");
  };

  const handleManualEmailChange = (e) => {
    if (e.target.checked) {
      navigate("/admin/mannual-email");
    }
  };

  return (
    <div className="bg-[#1F2937]  p-6 w-full mx-auto">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-start gap-3 mb-6 ">
        <div className="w-10 h-10  rounded flex items-center justify-center mt-1 border-1 border-[#1E40AF]">
          <Mail className="w-6 h-6" style={{ color: "#12DCF0" }} />
        </div>
        <div>
          <h2 className="text-white font-medium text-base">Email Sequences</h2>
          <p className="text-gray-400 text-sm mt-1">
            Upload email marketing sequences
            <br />& templates
          </p>
        </div>
      </div>

      {/* Manual Email Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-white text-sm">Manual Email</span>
        <input
          type="checkbox"
          id="manual-email-toggle"
          className="w-5 h-5 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500 cursor-pointer"
          onChange={handleManualEmailChange}
        />
      </div>
      <div className="mb-6">
        <label className="block text-white text-base mb-2" htmlFor="sequence-name">
          Name
        </label>
        <input
          id="sequence-name"
          type="text"
          placeholder="Input Field"
          className="w-full px-4 py-3 rounded border border-gray-500  text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          value={sequenceName}
          onChange={(e) => setSequenceName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-white text-base" htmlFor="sequence-category">
            Select Category
          </label>
          <button
            type="button"
            onClick={handleStartAddCategory}
            className="text-xs px-3 py-1 border border-gray-500 text-white hover:bg-gray-700"
          >
            Add New
          </button>
        </div>
        <select
          id="sequence-category"
          className="w-full px-4 py-3 rounded border border-gray-500 bg-[#1F2937] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-[#1F2937] transition"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={categoriesLoading}
        >
          <option value="" disabled style={{ backgroundColor: '#1F2937' }}>
            {categoriesLoading ? 'Loading...' : 'Select a category'}
          </option>
          {categories.map((c) => (
            <option key={c} value={c} style={{ backgroundColor: '#1F2937' }}>{c}</option>
          ))}
        </select>

        {showAddCategory && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 px-3 py-2 rounded border border-gray-500 bg-transparent text-gray-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleSaveCategory}
              className="px-3 py-2 bg-cyan-400 text-black text-xs hover:bg-cyan-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelAddCategory}
              className="px-3 py-2 border border-gray-500 text-white text-xs hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-white text-base mb-2" htmlFor="brain-type">
          Brain Type
        </label>
        <select
          id="brain-type"
          className="w-full px-4 py-3 rounded border border-gray-500 bg-[#1F2937] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-[#1F2937] transition"
          value={brainType}
          onChange={(e) => setBrainType(e.target.value)}
        >
          <option value="Architect" style={{ backgroundColor: '#1F2937' }}>Architect</option>
          <option value="Challenger" style={{ backgroundColor: '#1F2937' }}>Challenger</option>
          <option value="Synthesizer" style={{ backgroundColor: '#1F2937' }}>Synthesizer</option>
          <option value="Reflector" style={{ backgroundColor: '#1F2937' }}>Reflector</option>
          <option value="Catalyst" style={{ backgroundColor: '#1F2937' }}>Catalyst</option>
        </select>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-500 bg-[#11182780] p-12 text-center mb-6`}
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
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
            />
            <span className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition">
              Choose Files
            </span>
          </label>
        </div>
        <p className="text-gray-500 text-xs">Accept: pdf, doc, docx, txt</p>
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
      <div className="mb-6 border border-[#374151] p-5">
        <h3 className="text-white text-sm font-medium mb-4">
          Tier Access Control
        </h3>
        <div className="space-y-3">
          {/* Basic Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-gray-400"
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
                  {getTierUserCounts().basic} users
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
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500 cursor-pointer"
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
                  {getTierUserCounts().premium} users
                </span>
              </div>
              <div className="text-gray-400 text-xs mt-1">Paid subscribers</div>
            </div>
          </div>

          {/* VIP Tier */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="vip"
              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500 cursor-pointer"
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
                <span className="text-white text-sm">VIP</span>
                <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
                  {getTierUserCounts().enterprise} users
                </span>
              </div>
              <div className="text-gray-400 text-xs mt-1">Exclusive access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => handleUpload('active')}
        className="w-full bg-cyan-400 text-black font-medium py-3  hover:bg-cyan-300 transition-colors text-sm"
        disabled={loading}
        aria-busy={loading && submittingAction === 'active'}
      >
        {loading && submittingAction === 'active' ? 'Uploading...' : 'Upload Email Sequences'}
      </button>
      <button
        onClick={() => handleUpload('scheduled')}
        className="w-full bg-[#FFFFFF] text-black font-medium py-3  hover:bg-cyan-300 transition-colors text-sm mt-5"
        disabled={loading}
        aria-busy={loading && submittingAction === 'scheduled'}
      >
        {loading && submittingAction === 'scheduled' ? 'Scheduling...' : 'Schedule for later'}
      </button>
    </div>
    
  );
}
