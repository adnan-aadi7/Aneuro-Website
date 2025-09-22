import React, { useState } from "react";
import { Star } from "lucide-react";

const Popup = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1E1E2E] p-6 rounded-lg w-full max-w-md relative">
        {/* Close button */}
        

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-white text-center">Rate This Tool</h2>
        <p className="text-gray-400 mb-6 text-sm text-center">
          How would you rate your experience with Anieuro?
        </p>

        {/* Star Rating */}
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
            className="px-6 py-2 border border-cyan-300 rounded-md text-white hover:bg-[#2A2A3A]"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-cyan-400 text-black font-medium rounded-md hover:bg-cyan-300">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
