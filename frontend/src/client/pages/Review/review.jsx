import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axiosInstance from "../../../store/axiosInstance";
import { toast } from "react-hot-toast"; // ✅ import toast

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    review: "",
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFormData((prev) => ({
        ...prev,
        name: storedUser.name || "",
        email: storedUser.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (rating === 0) newErrors.rating = "Please select a rating.";
    if (!formData.review.trim()) newErrors.review = "Review is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axiosInstance.post("/reviews", {
          rating,
          review: formData.review,
        });

        toast.success("✅ Review submitted successfully!"); // ✅ toast instead of alert
        console.log("API Response:", res.data);

        // Reset form
        setRating(0);
        setFormData((prev) => ({
          ...prev,
          review: "",
        }));
      } catch (err) {
        console.error("Error submitting review:", err.response?.data || err.message);
        toast.error("❌ Failed to submit review. Please try again."); // ✅ toast instead of alert
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="text-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-6xl font-bold mb-2">Leave a Review</h2>
        <p className="text-gray-400 mb-6 text-lg">
          How would you rate your experience with Anieuro?
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Star Rating */}
          <div className="flex justify-start gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`w-12 h-12 cursor-pointer transition-colors ${
                  (hover || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-500"
                }`}
              />
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-400 text-sm mb-4">{errors.rating}</p>
          )}

          {/* Review Textarea */}
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="Write a review..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            rows={7}
          />
          {errors.review && (
            <p className="text-red-400 text-sm mb-4">{errors.review}</p>
          )}

          {/* Name (from localStorage, uneditable) */}
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mb-2 text-gray-400 cursor-not-allowed"
          />

          {/* Email (from localStorage, uneditable) */}
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mb-2 text-gray-400 cursor-not-allowed"
          />

          {/* Buttons */}
          <div className="flex flex-row items-center justify-end gap-5 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, review: "" }));
                setRating(0);
                setErrors({});
              }}
              className="px-8 border border-cyan-300 text-white font-medium py-3 rounded-md cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 bg-cyan-400 text-black font-medium py-3 rounded-md hover:bg-cyan-300 transition-all"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
