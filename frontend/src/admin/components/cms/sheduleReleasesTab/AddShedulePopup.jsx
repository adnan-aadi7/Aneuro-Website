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

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    scheduledDate: '',
    scheduledTime: '',
    combinedDateTime: '',
    tier: ''
  });

  // Validation functions
  const validateDate = (date) => {
    if (!date) return 'Date is required';
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(selectedDate.getTime())) return 'Invalid date format';
    if (selectedDate < today) return 'Date cannot be in the past';
    
    return '';
  };

  const getMinTimeForDate = (date) => {
    if (!date) return '';
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If selected date is today, return current time + 5 minutes
    if (selectedDate.toDateString() === today.toDateString()) {
      const now = new Date();
      const bufferTime = new Date(now.getTime() + 5 * 60 * 1000);
      return bufferTime.toTimeString().split(' ')[0].substring(0, 5);
    }
    
    return '';
  };

  const validateTime = (time) => {
    if (!time) return 'Time is required';
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) return 'Invalid time format';
    
    return '';
  };

  const validateCombinedDateTime = (date, time) => {
    if (!date || !time) return '';
    
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    // Add 5 minutes buffer to allow for form submission
    const bufferTime = new Date(now.getTime() + 5 * 60 * 1000);
    
    if (selectedDateTime <= bufferTime) {
      return 'Scheduled time must be at least 5 minutes in the future';
    }
    
    return '';
  };

  const validateTier = (tier) => {
    if (!tier) return 'Tier is required';
    if (!['basic', 'premium', 'enterprise'].includes(tier)) return 'Invalid tier selection';
    return '';
  };

  // Pre-fill form when editing
  useEffect(() => {
    if (editingRelease && open) {
      try {
        // Validate and parse the releaseDateTime
        let releaseDate;
        if (editingRelease.releaseDateTime) {
          releaseDate = new Date(editingRelease.releaseDateTime);
          
          // Check if the date is valid
          if (isNaN(releaseDate.getTime())) {
            console.warn('Invalid releaseDateTime:', editingRelease.releaseDateTime);
            // Use current date as fallback
            releaseDate = new Date();
          }
        } else {
          // No releaseDateTime, use current date
          releaseDate = new Date();
        }
        
        const dateStr = releaseDate.toISOString().split('T')[0];
        const timeStr = releaseDate.toTimeString().split(' ')[0].substring(0, 5);
        
        setFormData({
          contentId: editingRelease.id,
          modelType: getModelTypeFromContentType(editingRelease.type),
          scheduledDate: dateStr,
          scheduledTime: timeStr,
          tier: editingRelease.tier
        });

        // Clear validation errors when editing
        setValidationErrors({
          scheduledDate: '',
          scheduledTime: '',
          combinedDateTime: '',
          tier: ''
        });
      } catch (error) {
        console.error('Error parsing releaseDateTime:', error);
        // Set default values on error
        setFormData({
          contentId: editingRelease.id,
          modelType: getModelTypeFromContentType(editingRelease.type),
          scheduledDate: new Date().toISOString().split('T')[0],
          scheduledTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
          tier: editingRelease.tier
        });
      }
    } else if (!editingRelease) {
      // Reset form when not editing
      setFormData({
        contentId: '',
        modelType: '',
        scheduledDate: '',
        scheduledTime: '',
        tier: ''
      });
      
      // Clear validation errors
      setValidationErrors({
        scheduledDate: '',
        scheduledTime: '',
        combinedDateTime: '',
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

    // Real-time validation for date and time fields
    if (name === 'scheduledDate') {
      const dateError = validateDate(value);
      setValidationErrors(prev => ({ ...prev, scheduledDate: dateError }));
      
      // Re-validate combined date and time if both are present
      if (formData.scheduledTime) {
        const combinedError = validateCombinedDateTime(value, formData.scheduledTime);
        setValidationErrors(prev => ({ ...prev, combinedDateTime: combinedError }));
      }
    }
    
    if (name === 'scheduledTime') {
      const timeError = validateTime(value);
      setValidationErrors(prev => ({ ...prev, scheduledTime: timeError }));
      
      // Re-validate combined date and time if both are present
      if (formData.scheduledDate) {
        const combinedError = validateCombinedDateTime(formData.scheduledDate, value);
        setValidationErrors(prev => ({ ...prev, combinedDateTime: combinedError }));
      }
    }
    
    if (name === 'tier') {
      const tierError = validateTier(value);
      setValidationErrors(prev => ({ ...prev, tier: tierError }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasError = false;
    

    // Validate date
    const dateError = validateDate(formData.scheduledDate);
    if (dateError) {
      setValidationErrors(prev => ({ ...prev, scheduledDate: dateError }));
      hasError = true;
    } else {
      setValidationErrors(prev => ({ ...prev, scheduledDate: '' }));
    }

    // Validate time
    const timeError = validateTime(formData.scheduledTime);
    if (timeError) {
      setValidationErrors(prev => ({ ...prev, scheduledTime: timeError }));
      hasError = true;
    } else {
      setValidationErrors(prev => ({ ...prev, scheduledTime: '' }));
    }

    // Validate combined date and time
    const combinedDateTimeError = validateCombinedDateTime(formData.scheduledDate, formData.scheduledTime);
    if (combinedDateTimeError) {
      setValidationErrors(prev => ({ ...prev, combinedDateTime: combinedDateTimeError }));
      hasError = true;
    } else {
      setValidationErrors(prev => ({ ...prev, combinedDateTime: '' }));
    }

    // Validate tier
    const tierError = validateTier(formData.tier);
    if (tierError) {
      setValidationErrors(prev => ({ ...prev, tier: tierError }));
      hasError = true;
    } else {
      setValidationErrors(prev => ({ ...prev, tier: '' }));
    }

    if (hasError) {
      if (onError) {
        onError('Please correct the errors in the form.');
      }
      return;
    }

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
      
      // Clear validation errors on success
      setValidationErrors({
        scheduledDate: '',
        scheduledTime: '',
        combinedDateTime: '',
        tier: ''
      });
      
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
              {validationErrors.scheduledDate && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.scheduledDate}</p>
              )}
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
                min={getMinTimeForDate(formData.scheduledDate)}
                className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                style={{ colorScheme: "dark", color: "white" }}
                required
              />
              {validationErrors.scheduledTime && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.scheduledTime}</p>
              )}
              {formData.scheduledDate && getMinTimeForDate(formData.scheduledDate) && (
                <p className="text-cyan-400 text-xs mt-1">
                  Minimum time for today: {getMinTimeForDate(formData.scheduledDate)}
                </p>
              )}
            </div>
            
            {/* Combined Date and Time Validation Error */}
            {validationErrors.combinedDateTime && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.combinedDateTime}</p>
            )}
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
            {validationErrors.tier && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.tier}</p>
            )}
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
