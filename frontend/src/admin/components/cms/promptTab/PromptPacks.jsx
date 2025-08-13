import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Users, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { 
  fetchPromptPacks, 
  deletePromptPack,
  clearError,
  clearSuccess,
  selectPromptPacks,
  selectPromptPackLoading,
  selectPromptPackError,
  selectPromptPackSuccess
} from "../../../../store/Slice/PromptPacksSlice";
import { useNavigate } from "react-router-dom";

const PromptPacks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const promptPacks = useSelector(selectPromptPacks);
  const loading = useSelector(selectPromptPackLoading);
  const error = useSelector(selectPromptPackError);
  const success = useSelector(selectPromptPackSuccess);

  // State for delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);

  // Debug logging to see what data we're getting
  useEffect(() => {
    console.log('Prompt packs data:', promptPacks);
  }, [promptPacks]);

  // Fetch prompt packs on component mount
  useEffect(() => {
    dispatch(fetchPromptPacks());
  }, [dispatch]);

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      // Close delete modal on success
      setDeleteModal(false);
      setSelectedPack(null);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = (pack) => {
    setSelectedPack(pack);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPack?._id) {
      try {
        await dispatch(deletePromptPack(selectedPack._id)).unwrap();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const getTierBadge = (tier) => {
    const styles = {
      premium: "bg-[#3B82F633] text-[#60A5FA]",
      basic: "bg-[#22C55E33] text-[#4ADE80]",
      enterprise: "bg-[#A855F733] text-[#C084FC]",
    };
    return styles[tier] || "bg-gray-600 text-white";
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-[#22C55E33] text-[#4ADE80]",
      scheduled: "bg-[#3B82F633] text-[#60A5FA]",
      inactive: "bg-gray-600 text-gray-300",
    };
    return styles[status] || "bg-gray-600 text-white";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Safety function to ensure we're not rendering objects
  const safeRender = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      console.warn('Attempting to render object:', value);
      return fallback;
    }
    return String(value);
  };

  // Ensure promptPacks is an array
  const safePromptPacks = Array.isArray(promptPacks) ? promptPacks : [];

  return (
    <div className="bg-[#16161C] text-white w-full mt-4 border border-slate-800 p-5">
      <Toaster position="top-right" />
      
      {/* Header */}
      <h1 className="text-3xl font-medium mb-6">All Prompt Packs</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Prompts
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Category
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Tier
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Usage
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Created
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-2"></div>
                    Loading prompt packs...
                  </div>
                </td>
              </tr>
            ) : safePromptPacks.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-400">
                  No prompt packs found
                </td>
              </tr>
            ) : (
              safePromptPacks.map((pack) => {
                // Ensure pack is an object with required properties
                if (!pack || typeof pack !== 'object') {
                  console.warn('Invalid pack data:', pack);
                  return null;
                }

                return (
                  <tr
                    key={pack._id || Math.random()}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-4 px-4 text-white text-sm">
                      <div className="max-w-[200px] truncate" title={safeRender(pack.name, 'Unnamed Pack')}>
                        {safeRender(pack.name, 'Unnamed Pack')}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {pack.prompts ? `${pack.prompts.length} prompts` : '0 prompts'}
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {safeRender(pack.category)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                          safeRender(pack.tier)
                        )}`}
                      >
                        {safeRender(pack.tier)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                          safeRender(pack.status)
                        )}`}
                      >
                        {safeRender(pack.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-400" />
                        {safeRender(pack.usageCount || pack.usage, 0)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {formatDate(pack.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-white transition-colors"
                          title="View"
                          onClick={() => navigate(`/admin/analytics/prompts-details/${pack._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Delete"
                          onClick={() => handleDelete(pack)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }).filter(Boolean) // Remove any null entries
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModal && selectedPack && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Prompt Pack</h3>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this prompt pack?
              </p>
              <div className="max-w-full overflow-hidden">
                <p className="text-white font-medium truncate" title={selectedPack.name || 'Unnamed Pack'}>
                  {selectedPack.name || 'Unnamed Pack'}
                </p>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPacks;
