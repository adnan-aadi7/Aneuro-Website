import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiUploadCloud } from "react-icons/fi";
import ThankPopup from "./ThankPopup";

const CATEGORY_OPTIONS = [
  "Quiz Problem",
  "Bug/Error Report",
  "Billing Issue",
  "Login/Account Access",
  "Feedback",
  "Other",
];

const Form = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
    categories: ["Quiz Problem", "Bug/Error Report"],
    file: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showThank, setShowThank] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
    // Do not close dropdown here
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm((prev) => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowThank(true);
  };

  // Blur overlay for sidebar/header/main when popup is open
  useEffect(() => {
    if (showThank) {
      document.body.classList.add("feedback-blur-bg");
    } else {
      document.body.classList.remove("feedback-blur-bg");
    }
    return () => {
      document.body.classList.remove("feedback-blur-bg");
    };
  }, [showThank]);

  return (
    <>
      <form className="w-full max-w-full mx-auto mt-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400"
          />
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400"
          />
          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center justify-between bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span>
                {form.categories.length > 0
                  ? form.categories.join(", ")
                  : "Category"}
              </span>
              <FiChevronDown size={22} className="text-cyan-400" />
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 mt-2 w-full bg-[#23232C] rounded-lg shadow-lg border border-[#2A2A39] z-50 p-2"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center justify-between gap-2 py-2 cursor-pointer"
                  >
                    <span className="text-white text-base">{cat}</span>
                    <input
                      type="checkbox"
                      checked={form.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="accent-cyan-400 w-5 h-5 rounded border-2 border-cyan-400 bg-transparent focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleInputChange}
            placeholder="Message"
            rows={5}
            className="bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400 resize-none"
          />
          {/* File Upload */}
          <div
            className="border-2 border-dotted border-cyan-400 rounded-lg p-6 flex flex-col items-center justify-center mt-2 mb-4 cursor-pointer bg-transparent min-h-[120px] w-full max-w-[350px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FiUploadCloud size={36} className="text-cyan-400 mb-2" />
            <span className="text-white text-base mb-1">
              {form.file ? form.file.name : "Drop file or browse"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="text-cyan-400 cursor-pointer text-sm"
            >
              {form.file ? "Change file" : ""}
            </label>
            <span className="text-xs text-gray-400 mt-1">
              Format: .jpeg, .png & Max file size: 25 MB
            </span>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              className="border border-cyan-400 text-white px-6 py-2 rounded transition-colors hover:bg-cyan-400 hover:text-[#232432]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-400 text-[#232432] px-6 py-2 rounded font-semibold transition-colors hover:bg-cyan-300"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      {showThank && <ThankPopup onClose={() => setShowThank(false)} />}
    </>
  );
};

export default Form;
