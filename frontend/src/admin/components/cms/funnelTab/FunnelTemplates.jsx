import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Users, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import {
  fetchFunnelTemplates,
  deleteFunnelTemplate,
  clearError,
  clearSuccess,
  selectFunnelTemplates,
  selectFunnelTemplateLoading,
  selectFunnelTemplateError,
  selectFunnelTemplateSuccess
} from "../../../../store/Slice/FunnelSequenceSlice";
import { useNavigate } from "react-router-dom";

const FunnelTemplates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funnelTemplates = useSelector(selectFunnelTemplates);
  const loading = useSelector(selectFunnelTemplateLoading);
  const error = useSelector(selectFunnelTemplateError);
  const success = useSelector(selectFunnelTemplateSuccess);

  // State for delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    dispatch(fetchFunnelTemplates());
  }, [dispatch]);
  console.log("funnelTemplates",funnelTemplates);
 

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      // Close delete modal on success
      setDeleteModal(false);
      setSelectedTemplate(null);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = (template) => {
    setSelectedTemplate(template);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedTemplate?._id) {
      try {
        await dispatch(deleteFunnelTemplate(selectedTemplate._id)).unwrap();
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

  // Get count of pages from various possible shapes
  const getPageCount = (template) => {
    if (!template) return 0;
    const count = template.pageCount;
    if (typeof count === 'number' && !isNaN(count)) return count;

    const pages = template.pages;
    if (Array.isArray(pages)) return pages.length;
    if (typeof pages === 'number' && !isNaN(pages)) return pages;
    if (pages && typeof pages === 'object') {
      if (Array.isArray(pages.items)) return pages.items.length;
      try {
        return Object.keys(pages).length;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  // Ensure funnelTemplates is an array
  const safeTemplates = Array.isArray(funnelTemplates) ? funnelTemplates : [];

  return (
    <div className="bg-[#16161C] text-white  w-full mt-3 border border-slate-800 p-5">
      <Toaster position="top-right" />
      {/* Header */}
      <h1 className="text-3xl font-medium mb-6">All Funnel Templates</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-normal text-sm">
                Pages
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
                    Loading funnel templates...
                  </div>
                </td>
              </tr>
            ) : safeTemplates.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-400">
                  No funnel templates found
                </td>
              </tr>
            ) : (
              safeTemplates.map((template) => {
                if (!template || typeof template !== 'object') {
                  console.warn('Invalid template data:', template);
                  return null;
                }
                return (
                  <tr
                    key={template._id || Math.random()}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-4 px-4 text-white text-sm">
                      <div className="max-w-[200px] truncate" title={safeRender(template.name, 'Unnamed Template')}>
                        {safeRender(template.name, 'Unnamed Template')}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {getPageCount(template)} pages
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {safeRender(template.category)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTierBadge(
                          safeRender(template.tier)
                        )}`}
                      >
                        {safeRender(template.tier)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                          safeRender(template.status)
                        )}`}
                      >
                        {safeRender(template.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-400" />
                        {safeRender(template.usage, 0)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm">
                      {formatDate(template.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-400 hover:text-white transition-colors"
                          title="View"
                          onClick={() => navigate(`/admin/analytics/funnel-details/${template._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                          onClick={() => navigate(`/admin/edit-funnel/${template._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Delete"
                          onClick={() => handleDelete(template)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }).filter(Boolean)
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModal && selectedTemplate && (
        <div className="fixed inset-0 bg_black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Funnel Template</h3>
              <button
                onClick={() => setDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete this funnel template?
              </p>
              <div className="max-w-full overflow-hidden">
                <p className="text-white font-medium truncate" title={selectedTemplate.name || 'Unnamed Template'}>
                  {selectedTemplate.name || 'Unnamed Template'}
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
                className="px-4 py-2 bg-red-600 text_white rounded hover:bg-red-500"
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

export default FunnelTemplates;
