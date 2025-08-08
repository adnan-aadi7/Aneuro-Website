import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiUploadCloud } from "react-icons/fi";
import ThankPopup from "./ThankPopup";
import { useDispatch, useSelector } from "react-redux";
import { createTicket } from "../../../store/Slice/TicketSlice";

const CATEGORY_OPTIONS = [
  "Quiz Problem",
  "Bug/Error Report",
  "Billing Issue",
  "Login/Account Access",
  "Feedback",
  "Other",
];

const Form = () => {
  const dispatch = useDispatch();
  const { createStatus, error } = useSelector((state) => state.ticket);
  const currentUser = useSelector((state) => state.user.user);

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const dropdownRef = useRef(null);

  const fileInputRef = useRef(null);

  // Show error toast when there's an error
  useEffect(() => {
    if (error && createStatus === 'failed') {
      setToast({ show: true, message: error, type: 'error' });
      // Auto-hide toast after 5 seconds
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
    }
  }, [error, createStatus]);

  // Populate form with user data when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.name || currentUser.firstName || "",
        email: currentUser.email || "",
        mobile: currentUser.mobileNumber || currentUser.phone || "",
      }));
    }
  }, [currentUser]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the ticket data
    const ticketData = {
      name: form.name,
      email: form.email,
      mobileNumber: form.mobile, // API expects 'mobileNumber'
      category: form.categories, // Now sending as array
      message: form.message,
      file: form.file,
    };
    // Dispatch the thunk
    const resultAction = await dispatch(createTicket(ticketData));
    // Check if the ticket was created successfully
    if (createTicket.fulfilled.match(resultAction)) {
      setShowThank(true);
      // Only clear the message field, keep other fields
      setForm(prev => ({
        ...prev,
        message: "",
      }));
    } else {
      // Error feedback is handled below
    }
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
            readOnly
            className="bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400 opacity-60 cursor-not-allowed"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Email"
            readOnly
            className="bg-[#23232C] text-white px-4 py-3 rounded focus:outline-none placeholder-gray-400 opacity-60 cursor-not-allowed"
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
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            tabIndex={0}
            role="button"
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current && fileInputRef.current.click();
              }
            }}
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
              ref={fileInputRef}
            />
            <label
              htmlFor="file-upload"
              className="text-cyan-400 cursor-pointer text-sm"
              onClick={e => e.stopPropagation()} // Prevent label click from bubbling to drop area
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
              className={`bg-cyan-400 text-[#232432] px-6 py-2 rounded font-semibold transition-colors hover:bg-cyan-300 flex items-center justify-center ${createStatus === "loading" ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={createStatus === "loading"}
            >
              {createStatus === "loading" ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-[#232432]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
          toast.type === 'error' 
            ? 'bg-red-600 text-white border border-red-500' 
            : 'bg-green-600 text-white border border-green-500'
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {toast.message}
          </div>
        </div>
      )}
      
      {showThank && <ThankPopup onClose={() => setShowThank(false)} />}
    </>
  );
};

export default Form;
