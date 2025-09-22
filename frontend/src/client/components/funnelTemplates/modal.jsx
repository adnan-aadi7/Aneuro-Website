import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../store/axiosInstance";

const Popup = ({ isOpen, onClose, funnelId  }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        `/funnel-templates/${funnelId}/rate`,
        { rating }
      );

      toast.success("Thank you! Your rating has been submitted.");
      setRating(0);
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1E1E2E] p-6 rounded-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-2 text-white text-center">
          Rate This Tool
        </h2>
        <p className="text-gray-400 mb-6 text-sm text-center">
          How would you rate your experience with Aneuro?
        </p>

        {/* Stars */}
        <div className="flex gap-2 mb-12 justify-center mt-12">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`w-10 h-10 cursor-pointer transition-colors ${
                (hover || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-cyan-300 rounded-md text-white hover:bg-[#2A2A3A]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-cyan-400 text-black font-medium rounded-md hover:bg-cyan-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
