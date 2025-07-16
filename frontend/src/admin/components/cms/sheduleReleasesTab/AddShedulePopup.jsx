import React from "react";

const AddShedulePopup = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-sm">
      <div className="bg-[#23283A] rounded-lg shadow-lg w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 text-gray-300 hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Schedule New Release
        </h2>
        {/* Form */}
        <form className="space-y-6">
          {/* Select Content */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Select Content
            </label>
            <select className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none">
              <option value="">Select</option>
              <option value="content1">Content 1</option>
              <option value="content2">Content 2</option>
            </select>
          </div>
          {/* Release Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">
                Release Date
              </label>
              <input
                type="date"
                className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none"
                style={{ colorScheme: "dark", color: "white" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">
                Release Time
              </label>
              <input
                type="time"
                className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none"
                style={{ colorScheme: "dark", color: "white" }}
              />
            </div>
          </div>
          {/* Tier Access */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Tier Access
            </label>
            <select className="w-full bg-[#23283A] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none">
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          {/* Submit Button */}
          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-cyan-400 text-black font-semibold px-4 py-2  mt-2 hover:bg-cyan-300 transition-all text-sm"
            >
              Schedule Release
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShedulePopup;
