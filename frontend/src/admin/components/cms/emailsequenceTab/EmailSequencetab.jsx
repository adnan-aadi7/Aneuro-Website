import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Users, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { 
  fetchEmailSequences, 
  deleteEmailSequence,
  clearError,
  clearSuccess,
  selectEmailSequences,
  selectEmailSequenceLoading,
  selectEmailSequenceError,
  selectEmailSequenceSuccess
} from "../../../../store/Slice/EmailSequenceSLice";
import { setCurrentSequence } from "../../../../store/Slice/EmailSequenceSLice";
import { useNavigate } from "react-router-dom";

const EmailSequences = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sequences = useSelector(selectEmailSequences);
  const loading = useSelector(selectEmailSequenceLoading);
  const error = useSelector(selectEmailSequenceError);
  const success = useSelector(selectEmailSequenceSuccess);
  
  // State for delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState(null);

  // Debug logging to see what data we're getting
  useEffect(() => {
    console.log('Sequences data:', sequences);
  }, [sequences]);

  // Fetch email sequences on component mount
  useEffect(() => {
    dispatch(fetchEmailSequences());
  }, [dispatch]);

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      // Close delete modal on success
      setDeleteModal(false);
      setSelectedSequence(null);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = (sequence) => {
    setSelectedSequence(sequence);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedSequence?._id) {
      try {
        await dispatch(deleteEmailSequence(selectedSequence._id)).unwrap();
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
      starter: "bg-[#22C55E33] text-[#4ADE80]",
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

  // Get count of emails from various possible shapes
  const getEmailCount = (sequence) => {
    if (!sequence) return 0;
    const count = sequence.emailCount;
    if (typeof count === 'number' && !isNaN(count)) return count;

    const emails = sequence.emails;
    if (Array.isArray(emails)) return emails.length;
    if (typeof emails === 'number' && !isNaN(emails)) return emails;
    if (emails && typeof emails === 'object') {
      if (Array.isArray(emails.items)) return emails.items.length;
      try {
        return Object.keys(emails).length;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  // Ensure sequences is an array
  const safeSequences = Array.isArray(sequences) ? sequences : [];

  return (
    <div className="bg-[#16161C] text-white w-full mt-4 border border-slate-800 p-5">
      <Toaster position="top-right" />
      
      {/* Header */}
      <h1 className="text-3xl font-medium mb-6">All Email Sequences</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Emails
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
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-2"></div>
                    Loading email sequences...
                  </div>
                </td>
              </tr>
            ) : safeSequences.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  No email sequences found
                </td>
              </tr>
            ) : (
              safeSequences.map((sequence) => {
                // Ensure sequence is an object with required properties
                if (!sequence || typeof sequence !== 'object') {
                  console.warn('Invalid sequence data:', sequence);
                  return null;
                }

                return (
                  <tr
                    key={sequence._id || Math.random()}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-4 px-4 text-white text-sm">
                      <div className="max-w-[200px] truncate" title={safeRender(sequence.name, 'Unnamed Sequence')}>
                        {safeRender(sequence.name, 'Unnamed Sequence')}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {getEmailCount(sequence)} emails
                    </td>
                   <td className="py-4 px-4">
  <div className="flex flex-wrap gap-1">
    {Array.isArray(sequence.tier) ? (
      sequence.tier.map((t, i) => (
        <span
          key={i}
          className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(t)}`}
        >
          {t}
        </span>
      ))
    ) : (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
          safeRender(sequence.tier)
        )}`}
      >
        {safeRender(sequence.tier)}
      </span>
    )}
  </div>
</td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                          safeRender(sequence.status)
                        )}`}
                      >
                        {safeRender(sequence.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-400" />
                        {safeRender(sequence.usage, 0)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {formatDate(sequence.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                          title="View"
                          onClick={() => navigate(`/admin/analytics/email-details/${sequence._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                          onClick={() => {
                            // Prefill store and navigate to add-manually in edit mode
                            dispatch(setCurrentSequence(sequence));
                            navigate(`/admin/mannual-email/${sequence._id}`);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                          title="Delete"
                          onClick={() => handleDelete(sequence)}
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
      {deleteModal && selectedSequence && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Email Sequence</h3>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this email sequence?
              </p>
              <div className="max-w-full overflow-hidden">
                <p className="text-white font-medium truncate" title={selectedSequence.name || 'Unnamed Sequence'}>
                  {selectedSequence.name || 'Unnamed Sequence'}
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

export default EmailSequences;
