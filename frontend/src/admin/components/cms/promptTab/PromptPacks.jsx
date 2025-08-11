import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Users, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { 
  fetchPromptPacks, 
  deletePromptPack,
  updatePromptPack,
  clearError,
  clearSuccess,
  selectPromptPacks,
  selectPromptPackLoading,
  selectPromptPackError,
  selectPromptPackSuccess
} from "../../../../store/Slice/PromptPacksSlice";

const PromptPacks = () => {
  const dispatch = useDispatch();
  const promptPacks = useSelector(selectPromptPacks);
  const loading = useSelector(selectPromptPackLoading);
  const error = useSelector(selectPromptPackError);
  const success = useSelector(selectPromptPackSuccess);

  // State for modals
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    tier: '',
    status: '',
    prompts: []
  });

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
      // Close modals on success
      setViewModal(false);
      setEditModal(false);
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

  const handleView = (pack) => {
    setSelectedPack(pack);
    setViewModal(true);
  };

  const handleEdit = (pack) => {
    setSelectedPack(pack);
    setEditForm({
      name: pack.name || '',
      category: pack.category || '',
      tier: pack.tier || '',
      status: pack.status || '',
      prompts: pack.prompts || []
    });
    setEditModal(true);
  };

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedPack?._id) {
      try {
        await dispatch(updatePromptPack({
          id: selectedPack._id,
          updateData: editForm
        })).unwrap();
      } catch (error) {
        console.error('Update failed:', error);
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
                          onClick={() => handleView(pack)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                          onClick={() => handleEdit(pack)}
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

      {/* View Modal */}
      {viewModal && selectedPack && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">View Prompt Pack</h3>
              <button
                onClick={() => setViewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{safeRender(selectedPack.name, 'N/A')}</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2">{safeRender(selectedPack.category, 'N/A')}</span>
              </div>
              <div>
                <span className="text-gray-400">Tier:</span>
                <span className="ml-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                    safeRender(selectedPack.tier)
                  )}`}>
                    {safeRender(selectedPack.tier, 'N/A')}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                    safeRender(selectedPack.status)
                  )}`}>
                    {safeRender(selectedPack.status, 'N/A')}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-gray-400">Prompts:</span>
                <span className="text-white ml-2">{selectedPack.prompts ? selectedPack.prompts.length : 0} prompts</span>
              </div>
              <div>
                <span className="text-gray-400">Usage:</span>
                <span className="text-white ml-2">{safeRender(selectedPack.usageCount || selectedPack.usage, 0)}</span>
              </div>
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="text-white ml-2">{formatDate(selectedPack.createdAt)}</span>
              </div>
              {/* Debug: Show raw data structure */}
              <div className="mt-4 p-3 bg-gray-800 rounded text-xs">
                <span className="text-gray-400">Debug Info:</span>
                <pre className="text-gray-300 mt-1 overflow-auto">
                  {JSON.stringify(selectedPack, null, 2)}
                </pre>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && selectedPack && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Edit Prompt Pack</h3>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-[#374151] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Category</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full bg-[#374151] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Tier</label>
                <select
                  value={editForm.tier}
                  onChange={(e) => setEditForm({...editForm, tier: e.target.value})}
                  className="w-full bg-[#374151] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Tier</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full bg-[#374151] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
