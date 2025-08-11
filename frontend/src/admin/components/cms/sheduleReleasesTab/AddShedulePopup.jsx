import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import {
  scheduleContent,
  clearError,
  clearSuccess,
  selectScheduleLoading,
  selectScheduleError,
  selectScheduleSuccess
} from "../../../../store/Slice/ScheduleSlice";
import {
  selectEmailSequences,
  fetchEmailSequences
} from "../../../../store/Slice/EmailSequenceSLice";
import {
  selectPromptPacks,
  fetchPromptPacks
} from "../../../../store/Slice/PromptPacksSlice";
import {
  selectFunnelTemplates,
  fetchFunnelTemplates
} from "../../../../store/Slice/FunnelSequenceSlice";
import {
  fetchStripeProducts,
  selectStripeProducts,
  selectStripeProductsLoading
} from "../../../../store/Slice/PaymentSlice";

const AddShedulePopup = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectScheduleLoading);
  const error = useSelector(selectScheduleError);
  const success = useSelector(selectScheduleSuccess);
  
  // Fetch available content
  const emailSequences = useSelector(selectEmailSequences);
  const promptPacks = useSelector(selectPromptPacks);
  const funnelTemplates = useSelector(selectFunnelTemplates);
  
  // Fetch Stripe products for tier options
  const stripeProducts = useSelector(selectStripeProducts);
  const stripeProductsLoading = useSelector(selectStripeProductsLoading);

  // Form state
  const [formData, setFormData] = useState({
    contentId: '',
    modelType: '',
    scheduledDate: '',
    scheduledTime: '',
    tier: ''
  });

  // Fetch content on component mount
  useEffect(() => {
    if (open) {
      dispatch(fetchEmailSequences());
      dispatch(fetchPromptPacks());
      dispatch(fetchFunnelTemplates());
      dispatch(fetchStripeProducts());
    }
  }, [open, dispatch]);

  // Handle success and error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      handleClose();
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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
    
    // Validation
    if (!formData.contentId || !formData.modelType || !formData.scheduledDate || !formData.scheduledTime || !formData.tier) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if date is in the future
    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      toast.error('Scheduled date and time must be in the future');
      return;
    }

    try {
      await dispatch(scheduleContent(formData)).unwrap();
    } catch (error) {
      console.error('Schedule creation failed:', error);
      if (error.message && error.message.includes('Content not found')) {
        toast.error('Selected content no longer exists. Please refresh and try again.');
      } else {
        toast.error(error.message || 'Failed to schedule content');
      }
    }
  };

  // Get available content options
  const getContentOptions = () => {
    const options = [];
    
    // Add email sequences
    if (Array.isArray(emailSequences)) {
      emailSequences.forEach(seq => {
        if (seq.status !== 'scheduled') {
          options.push({
            id: seq._id,
            name: seq.name,
            type: 'EmailSequence',
            displayName: `Email Sequence: ${seq.name}`
          });
        }
      });
    }

    // Add prompt packs
    if (Array.isArray(promptPacks)) {
      promptPacks.forEach(pack => {
        if (pack.status !== 'scheduled') {
          options.push({
            id: pack._id,
            name: pack.name,
            type: 'PromptPack',
            displayName: `Prompt Pack: ${pack.name}`
          });
        }
      });
    }

    // Add funnel templates
    if (Array.isArray(funnelTemplates)) {
      funnelTemplates.forEach(template => {
        if (template.status !== 'scheduled') {
          options.push({
            id: template._id,
            name: template.name,
            type: 'FunnelTemplate',
            displayName: `Funnel Template: ${template.name}`
          });
        }
      });
    }

    return options;
  };

  const contentOptions = getContentOptions();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-sm">
      <Toaster position="top-right" />
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
          Schedule New Release
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
              onChange={(e) => {
                const selectedOption = contentOptions.find(opt => opt.id === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  contentId: e.target.value,
                  modelType: selectedOption ? selectedOption.type : ''
                }));
              }}
              className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="">Select Content</option>
              {contentOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
            {contentOptions.length === 0 && (
              <p className="text-red-400 text-xs mt-1">
                No available content to schedule. Please create some content first.
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
              {stripeProductsLoading ? (
                <option value="">Loading tiers...</option>
              ) : (
                stripeProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))
              )}
            </select>
            {!formData.tier && formData.tier !== '' && (
              <p className="text-red-400 text-xs mt-1">
                Please select a tier
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <button
              type="submit"
              disabled={loading || contentOptions.length === 0 || !formData.tier || stripeProductsLoading}
              className={`bg-cyan-400 text-black font-semibold px-4 py-2 mt-2 transition-all text-sm ${
                loading || contentOptions.length === 0 || !formData.tier || stripeProductsLoading
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-cyan-300'
              }`}
            >
              {loading ? 'Scheduling...' : 'Schedule Release'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShedulePopup;
