import React, { useState } from "react";
import { Star } from "lucide-react";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    review: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error when typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (rating === 0) newErrors.rating = "Please select a rating.";
    if (!formData.review.trim()) newErrors.review = "Review is required.";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // ✅ Form is valid
      console.log("Form submitted:", { rating, ...formData });
      alert("Review submitted successfully!");

      // Reset form
      setRating(0);
      setFormData({
        review: "",
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="text-white p-8 rounded-lg shadow-lg w-full">
        {/* Title */}
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
          {errors.rating && <p className="text-red-400 text-sm mb-4">{errors.rating}</p>}

          {/* Review Textarea */}
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="Write a review..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            rows={7}
          />
          {errors.review && <p className="text-red-400 text-sm mb-4">{errors.review}</p>}

          {/* First Name */}
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {errors.firstName && <p className="text-red-400 text-sm mb-4">{errors.firstName}</p>}

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {errors.lastName && <p className="text-red-400 text-sm mb-4">{errors.lastName}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Email"
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {errors.email && <p className="text-red-400 text-sm mb-4">{errors.email}</p>}

          {/* Buttons */}
          <div className="flex flex-row items-center justify-end gap-5 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({ review: "", firstName: "", lastName: "", email: "" });
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
