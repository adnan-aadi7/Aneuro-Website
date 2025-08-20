import React, { useEffect, useState } from "react";
import { Edit, Trash2, Mail, Zap, Filter, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAllScheduled, 
  selectScheduled, 
  selectScheduleLoading, 
  selectScheduleError, 
  selectScheduleSuccess,
  deleteSchedule,
  clearError,
  clearSuccess
} from "../../../../store/Slice/ScheduleSlice";
import AddShedulePopup from "./AddShedulePopup";

const ScheduledReleasesTable = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const scheduledReleases = useSelector(selectScheduled);
  const loading = useSelector(selectScheduleLoading);
  const error = useSelector(selectScheduleError);
  const success = useSelector(selectScheduleSuccess);
  
  // State for edit popup
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);
  
  // State for delete confirmation popup
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deletingRelease, setDeletingRelease] = useState(null);

  // Fetch scheduled releases on component mount
  useEffect(() => {
    dispatch(fetchAllScheduled());
  }, [dispatch]);

  // Handle success and error messages
  useEffect(() => {
    if (!success) return;
    // Avoid duplicate toasts for create/update which are handled in popups
    const isDelete = success.toLowerCase().includes('deleted successfully');
    if (isDelete && onSuccess) onSuccess(success);
    dispatch(clearSuccess());
  }, [success, dispatch, onSuccess]);

  useEffect(() => {
    if (error) {
      if (onError) {
        onError(error);
      }
      dispatch(clearError());
    }
  }, [error, dispatch, onError]);

  // Refresh function
  const handleRefresh = () => {
    dispatch(fetchAllScheduled());
  };

  console.log("scheduledReleases", scheduledReleases);
  
  const getTierBadge = (tier) => {
    const styles = {
      premium: "bg-blue-100 text-blue-800",
      basic: "bg-green-100 text-green-800",
      enterprise: "bg-purple-100 text-purple-800",
      starter: "bg-green-100 text-green-800",
      growth: "bg-blue-100 text-blue-800",
    };
    return styles[tier] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getIcon = (type) => {
    switch (type) {
      case "Email Sequence":
        return <Mail className="w-4 h-4 mr-2" />;
      case "Prompt Pack":
        return <Zap className="w-4 h-4 mr-2" />;
      case "Funnel Template":
        return <Filter className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return "Invalid date";
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Not set";
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid time string:', dateString);
        return "Invalid time";
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return "Invalid time";
    }
  };

  const truncateContentName = (name, maxLength = 30) => {
    if (!name) return "Unnamed";
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  const handleEdit = (release) => {
    // Validate release data before opening edit popup
    if (!release || !release.id) {
      console.error('Invalid release data:', release);
      if (onError) {
        onError('Invalid release data. Please try again.');
      }
      return;
    }
    
    console.log('Editing release data:', release);
    console.log('releaseDateTime:', release.releaseDateTime);
    console.log('releaseDateTime type:', typeof release.releaseDateTime);
    
    setEditingRelease(release);
    setEditPopupOpen(true);
  };

  const handleEditClose = () => {
    setEditingRelease(null);
    setEditPopupOpen(false);
    // Refresh the table after edit
    dispatch(fetchAllScheduled());
  };

  const handleEditSuccess = () => {
    // Refresh the table after successful edit
    dispatch(fetchAllScheduled());
  };

  const handleDelete = (release) => {
    setDeletingRelease(release);
    setDeletePopupOpen(true);
  };

  const handleDeleteClose = () => {
    setDeletingRelease(null);
    setDeletePopupOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingRelease) {
      try {
        // Get modelType from the release type
        const modelType = getModelTypeFromContentType(deletingRelease.type);
        
        await dispatch(deleteSchedule({ 
          id: deletingRelease.id, 
          modelType: modelType 
        })).unwrap();
        
        // Refresh the table after successful deletion
        dispatch(fetchAllScheduled());
        handleDeleteClose();
        
        // Show success message through parent's toast system
        if (onSuccess) {
          onSuccess("Scheduled release deleted successfully!");
        }
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        // Show error message through parent's toast system
        if (onError) {
          onError("Failed to delete scheduled release.");
        }
      }
    }
  };

  // Helper function to get model type from content type
  const getModelTypeFromContentType = (contentType) => {
    switch (contentType) {
      case 'Email Sequence':
        return 'EmailSequence';
      case 'Prompt Pack':
        return 'PromptPack';
      case 'Funnel Template':
        return 'FunnelTemplate';
      default:
        return '';
    }
  };

  if (loading && (!scheduledReleases || scheduledReleases.length === 0)) {
    return (
      <div className="bg- text-white w-full mt-3 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-medium">All Scheduled Releases</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
          <span className="text-gray-400">Loading scheduled releases...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg- text-white w-full mt-3 border border-slate-800 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-medium">
          All Scheduled Releases
          {scheduledReleases && scheduledReleases.length > 0 && (
            <span className="text-gray-400 text-lg ml-3">({scheduledReleases.length})</span>
          )}
        </h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded">
          <p className="text-red-400 mb-2">Error loading scheduled releases</p>
          <button 
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Content
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Type
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Scheduled Date
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Time
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Tier
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!scheduledReleases || scheduledReleases.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  {loading ? 'Loading...' : 'No scheduled releases found'}
                </td>
              </tr>
            ) : (
              scheduledReleases.map((release) => (
                <tr
                  key={release.id}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  <td className="py-4 px-4 text-white text-sm">
                    <div title={release.content}>
                      {truncateContentName(release.content)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">
                    <div className="flex items-center">
                      {getIcon(release.type)}
                      {release.type}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">
                    {formatDate(release.releaseDateTime)}
                  </td>
                  <td className="py-4 px-4 text-gray-300 text-sm">
                    {formatTime(release.releaseDateTime)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                        release.tier
                      )}`}
                    >
                      {release.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                        release.status
                      )}`}
                    >
                      {release.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(release)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(release)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Schedule Popup */}
      {editPopupOpen && editingRelease && (
        <AddShedulePopup
          open={editPopupOpen}
          onClose={handleEditClose}
          editingRelease={editingRelease}
          onSuccess={handleEditSuccess}
          onError={onError}
        />
      )}

      {/* Delete Confirmation Popup */}
      {deletePopupOpen && deletingRelease && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#23283A] p-6 rounded-lg shadow-xl border border-slate-700 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Confirm Deletion</h3>
            <div className="mb-6">
              <p className="text-sm text-gray-300 mb-2">
                Are you sure you want to delete this scheduled release?
              </p>
              <div className="bg-slate-800 p-3 rounded border border-slate-600">
                <p className="text-white font-medium text-sm break-words">
                  {deletingRelease.content}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {deletingRelease.type} • {deletingRelease.tier} • {formatDate(deletingRelease.releaseDateTime)}
                </p>
              </div>
              <p className="text-red-400 text-xs mt-2">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteClose}
                className="flex-1 px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
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

export default ScheduledReleasesTable;
