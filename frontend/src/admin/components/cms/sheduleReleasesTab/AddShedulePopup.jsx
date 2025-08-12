import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchEmailSequences, 
  selectEmailSequences, 
  selectEmailSequenceLoading 
} from "../../../../store/Slice/EmailSequenceSLice";
import { 
  fetchFunnelTemplates, 
  selectFunnelTemplates, 
  selectFunnelTemplateLoading 
} from "../../../../store/Slice/FunnelSequenceSlice";
import { 
  fetchPromptPacks, 
  selectPromptPacks, 
  selectPromptPackLoading 
} from "../../../../store/Slice/PromptPacksSlice";
import { 
  scheduleContent, 
  clearError, 
  selectScheduleLoading, 
  selectScheduleError
} from "../../../../store/Slice/ScheduleSlice";

const AddShedulePopup = ({ open, onClose, editingRelease = null, onSuccess = null, onError = null }) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const emailSequences = useSelector(selectEmailSequences);
  const funnelTemplates = useSelector(selectFunnelTemplates);
  const promptPacks = useSelector(selectPromptPacks);
  const emailLoading = useSelector(selectEmailSequenceLoading);
  const funnelLoading = useSelector(selectFunnelTemplateLoading);
  const promptLoading = useSelector(selectPromptPackLoading);
  const scheduleLoading = useSelector(selectScheduleLoading);
  const scheduleError = useSelector(selectScheduleError);

  // Get error states from content slices
  const emailError = useSelector((state) => state.emailSequence.error);
  const funnelError = useSelector((state) => state.promptPack.error);
  const promptError = useSelector((state) => state.funnelTemplate.error);

  // Form state
  const [formData, setFormData] = useState({
    contentId: '',
    modelType: '',
    scheduledDate: '',
    scheduledTime: '',
    tier: ''
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editingRelease && open) {
      // Parse the releaseDateTime to get date and time
      const releaseDate = new Date(editingRelease.releaseDateTime);
      const dateStr = releaseDate.toISOString().split('T')[0];
      const timeStr = releaseDate.toTimeString().split(' ')[0].substring(0, 5);
      
      setFormData({
        contentId: editingRelease.id,
        modelType: getModelTypeFromContentType(editingRelease.type),
        scheduledDate: dateStr,
        scheduledTime: timeStr,
        tier: editingRelease.tier
      });
    } else if (!editingRelease) {
      // Reset form when not editing
      setFormData({
        contentId: '',
        modelType: '',
        scheduledDate: '',
        scheduledTime: '',
        tier: ''
      });
    }
  }, [editingRelease, open]);

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

  // Fetch all content on component mount
  useEffect(() => {
    if (open) {
      dispatch(fetchEmailSequences());
      dispatch(fetchFunnelTemplates());
      dispatch(fetchPromptPacks());
    }
  }, [dispatch, open]);

  // Handle success and error messages
  useEffect(() => {
    if (scheduleError) {
      if (onError) {
        onError(scheduleError);
      }
      dispatch(clearError());
    }
  }, [scheduleError, dispatch, onError]);

  const handleClose = () => {
    setFormData({
      contentId: '',
      modelType: '',
      scheduledDate: '',
      scheduledTime: '',
      tier: ''
    });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contentId || !formData.modelType || !formData.scheduledDate || !formData.scheduledTime || !formData.tier) {
      if (onError) {
        onError('Please fill in all required fields');
      }
      return;
    }

    // Validate that the selected content still exists
    const selectedOption = generateContentOptions().find(option => option.value === formData.contentId);
    if (!selectedOption) {
      if (onError) {
        onError('Selected content is no longer available. Please refresh and try again.');
      }
      return;
    }

    try {
      await dispatch(scheduleContent(formData)).unwrap();
      const successMessage = editingRelease ? 'Release updated successfully!' : 'Content scheduled successfully!';
      if (onSuccess) {
        onSuccess(successMessage);
      }
      handleClose();
    } catch (error) {
      // Show more specific error message
      let errorMessage = 'Failed to schedule content. Please try again.';
      if (error.message === 'Invalid modelType') {
        errorMessage = `Invalid model type: ${formData.modelType}. Please try again.`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Generate content options for dropdown
  const generateContentOptions = () => {
    const options = [];
    
    // Add email sequences
    if (emailSequences && emailSequences.length > 0) {
      emailSequences.forEach(sequence => {
        if (sequence && sequence._id && sequence.name) {
          const displayName = sequence.name.length > 25 ? `${sequence.name.substring(0, 25)}...` : sequence.name;
          options.push({
            value: sequence._id,
            label: displayName,
            fullName: sequence.name,
            type: 'EmailSequence'
          });
        }
      });
    }
    
    // Add funnel templates
    if (funnelTemplates && funnelTemplates.length > 0) {
      funnelTemplates.forEach(template => {
        if (template && template._id && template.name) {
          const displayName = template.name.length > 25 ? `${template.name.substring(0, 25)}...` : template.name;
          options.push({
            value: template._id,
            label: displayName,
            fullName: template.name,
            type: 'FunnelTemplate'
          });
        }
      });
    }
    
    // Add prompt packs
    if (promptPacks && promptPacks.length > 0) {
      promptPacks.forEach(pack => {
        if (pack && pack._id && pack.name) {
          const displayName = pack.name.length > 25 ? `${pack.name.substring(0, 25)}...` : pack.name;
          options.push({
            value: pack._id,
            label: displayName,
            fullName: pack.name,
            type: 'PromptPack'
          });
        }
      });
    }
    
    return options;
  };

  // Handle content selection to auto-set model type
  const handleContentChange = (e) => {
    const contentId = e.target.value;
    const selectedOption = generateContentOptions().find(option => option.value === contentId);
    
    setFormData(prev => ({
      ...prev,
      contentId,
      modelType: selectedOption ? selectedOption.type : ''
    }));
  };

  // Check if any content is available
  const hasContent = generateContentOptions().length > 0;

  // Check if content is still loading
  const isContentLoading = emailLoading || funnelLoading || promptLoading;

  // Check if there was an error loading content
  const hasContentError = emailError || funnelError || promptError;

  // Check if we should show the no content message
  const shouldShowNoContent = !isContentLoading && !hasContentError && !hasContent;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-sm">
      <div className="bg-[#23283A] rounded-lg shadow-lg w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-gray-300 hover:text-white text-2xl"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          {editingRelease ? 'Edit Scheduled Release' : 'Schedule New Release'}
        </h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Content */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Select Content *
            </label>
            <select 
              name="contentId"
              value={formData.contentId}
              onChange={handleContentChange}
              className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              required
              disabled={isContentLoading || !hasContent || editingRelease}
            >
              <option value="">
                {editingRelease ? editingRelease.content : (isContentLoading ? 'Loading content...' : !hasContent ? 'No content available' : 'Select Content')}
              </option>
              {!isContentLoading && hasContent && !editingRelease && generateContentOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!isContentLoading && shouldShowNoContent && (
              <p className="text-yellow-400 text-xs mt-1">
                No content available to schedule. Please create some content first.
              </p>
            )}
            {hasContentError && (
              <p className="text-red-400 text-xs mt-1">
                Error loading content. Please try refreshing the page.
              </p>
            )}
          </div>

          {/* Release Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">
                Release Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                style={{ colorScheme: "dark", color: "white" }}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">
                Release Time *
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                style={{ colorScheme: "dark", color: "white" }}
                required
              />
            </div>
          </div>

          {/* Tier Access */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Tier Access *
            </label>
            <select 
              name="tier"
              value={formData.tier}
              onChange={handleInputChange}
              className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="">Select Tier</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <button
              type="submit"
              disabled={scheduleLoading || isContentLoading || !hasContent}
              className="bg-cyan-400 text-black font-semibold px-4 py-2 mt-2 transition-all text-sm hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scheduleLoading ? (editingRelease ? 'Updating...' : 'Scheduling...') : (editingRelease ? 'Update Release' : 'Schedule Release')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShedulePopup;
