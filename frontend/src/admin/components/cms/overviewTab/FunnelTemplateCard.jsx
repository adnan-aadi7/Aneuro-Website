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
import { fetchEmailCategories, createCategory as createEmailCategory } from "../../../../store/Slice/EmailSequenceSLice";
import { getAllUsers } from "../../../../store/Slice/UserSlice";

export default function FunnelTemplateCard() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.funnelTemplate);
  const fileInputRef = useRef(null);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTiers, setSelectedTiers] = useState([]); // ["basic", "premium", "enterprise"]
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [brainType, setBrainType] = useState("Architect");
  const [submittingAction, setSubmittingAction] = useState(null); // 'active' | 'scheduled' | null
  const categories = useSelector((state) => state.emailSequence.categories || []);
  const categoriesLoading = useSelector((state) => state.emailSequence.categoriesLoading);

  // Users data for tier counts
  const users = useSelector((state) => state.user.users || []);
  const usersLoading = useSelector((state) => state.user.usersLoading);

  const isAllowedFile = (file) => {
    const name = file?.name?.toLowerCase() || "";
    return name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.txt');
  };

  // Handle file selection from input
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
        toast.error("Only .pdf, .doc, .docx, .txt files are allowed");
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
    const desiredStatus = 'active';
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (selectedTiers.length === 0) {
      toast.error("Please select at least one tier");
      return;
    }

    if (!templateName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    try {
      const tierMap = { basic: 'starter', premium: 'growth', enterprise: 'enterprise' };
      const backendTier = tierMap[selectedTiers[0]] || 'starter';

      setSubmittingAction(desiredStatus);
      await dispatch(createFunnelTemplateWithFile({
        file: selectedFile,
        name: templateName.trim(),
        category,
        tier: backendTier,
        status: desiredStatus,
        brainType
      })).unwrap();
      
      // Reset form on success
      setSelectedFile(null);
      setSelectedTiers([]);
      setTemplateName("");
      setCategory("");
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
      setSubmittingAction(null);
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
      setSubmittingAction(null);
    }
  }, [success, error, dispatch]);

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchEmailCategories());
  }, [dispatch]);

  // Load users for tier counts
  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 1000 })); // Get all users for accurate counts
  }, [dispatch]);

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
      setCategory(name);
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
      
      <div className="mb-6 mt-19">
        <label className="block text-white text-base mb-2" htmlFor="sequence-name">
          Name
        </label>
        <input
          id="sequence-name"
          type="text"
          placeholder="Input Field"
          className="w-full px-4 py-3 rounded border border-gray-500  text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
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
          className="w-full px-4 py-3 rounded border border-gray-500 bg-[#232B39] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-[#232B39] transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categoriesLoading}
        >
          <option value="" disabled style={{ backgroundColor: '#232B39' }}>
            {categoriesLoading ? 'Loading...' : 'Select a category'}
          </option>
          {categories.map((c) => (
            <option key={c} value={c} style={{ backgroundColor: '#232B39' }}>{c}</option>
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

      <div className="mb-5 mt-8">
        <label className="block text-white text-base mb-2" htmlFor="brain-type">
          Brain Type
        </label>
        <select
          id="brain-type"
          className="w-full px-4 py-3 rounded border border-gray-500 bg-[#232B39] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-[#232B39] transition"
          value={brainType}
          onChange={(e) => setBrainType(e.target.value)}
        >
          <option value="Architect" style={{ backgroundColor: '#232B39' }}>Architect</option>
          <option value="Challenger" style={{ backgroundColor: '#232B39' }}>Challenger</option>
          <option value="Synthesizer" style={{ backgroundColor: '#232B39' }}>Synthesizer</option>
          <option value="Reflector" style={{ backgroundColor: '#232B39' }}>Reflector</option>
          <option value="Catalyst" style={{ backgroundColor: '#232B39' }}>Catalyst</option>
        </select>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-500 bg-[#11182780]  p-12 text-center  ${
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
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
            />
            <span className="bg-transparent border border-gray-400 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition">
              Choose File
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
      <div className="  mt-7 border border-[#374151]  p-5 ">
        <h3 className="text-white text-sm font-medium ">
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
                  {getTierUserCounts().premium} users
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
                  {getTierUserCounts().enterprise} users
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">Enterprise access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => { setSubmittingAction('active'); handleUpload(); }}
        className="mt-6 w-full bg-cyan-400 text-black font-medium py-3  hover:bg-cyan-300 transition-colors text-sm"
        disabled={loading}
        aria-busy={loading && submittingAction === 'active'}
      >
        {loading && submittingAction === 'active' ? 'Uploading...' : 'Upload Funnel Templates'}
      </button>

      <button
        onClick={async () => {
          // schedule
          const desiredStatus = 'scheduled';
          if (!selectedFile || selectedTiers.length === 0 || !templateName.trim() || !category) {
            handleUpload(); // Will show validations
            return;
          }
          try {
            const tierMap = { basic: 'starter', premium: 'growth', enterprise: 'enterprise' };
            const backendTier = tierMap[selectedTiers[0]] || 'starter';
            setSubmittingAction('scheduled');
            await dispatch(createFunnelTemplateWithFile({
              file: selectedFile,
              name: templateName.trim(),
              category,
              tier: backendTier,
              status: desiredStatus,
              brainType
            }));
          } catch {
            // no-op, error toast handled globally
          }
        }}
        className="w-full bg-[#FFFFFF] text-black font-medium py-3  hover:bg-cyan-300 transition-colors text-sm mt-5"
        disabled={loading}
        aria-busy={loading && submittingAction === 'scheduled'}
      >
        {loading && submittingAction === 'scheduled' ? 'Scheduling...' : 'Schedule for later'}
      </button>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
