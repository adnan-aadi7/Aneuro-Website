import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    startDate: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log("Cancel clicked");
  };

  return (
    <div className=" text-white">
      {/* Admin Profile Cards */}
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-[#2A2A39] border border-[#374151]  p-4 flex items-center gap-3 min-w-[280px]">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AS</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Aden Smith</h3>
              <p className="text-gray-400 text-sm">Commissions Manager</p>
            </div>
            <button className="text-white hover:text-white">
              <MoreVertical size={30} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Admin Form */}
      <div className="">
        <h2 className="text-2xl font-semibold text-white mb-6">Add New Admin</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name and Last Name Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-300 text-sm mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-[#2A2A39] border border-[#374151] text-white px-4 py-3  focus:outline-none focus:border-[#12DCF0]"
                placeholder="Enter first name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 text-sm mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-[#2A2A39] border border-[#374151] text-white px-4 py-3  focus:outline-none focus:border-[#12DCF0]"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email Row */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-[#374151] text-white px-4 py-3  focus:outline-none focus:border-[#12DCF0]"
              placeholder="Enter email address"
            />
          </div>

          {/* Confirm Email Row */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Confirm Email</label>
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-[#374151] text-white px-4 py-3  focus:outline-none focus:border-[#12DCF0]"
              placeholder="Confirm email address"
            />
          </div>

          {/* Start Date Row */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-[#374151] text-white px-4 py-3  focus:outline-none focus:border-[#12DCF0]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#12DCF0] text-black font-medium px-10 py-2  hover:bg-[#0FB8CC] transition-colors"
              onClick={() => navigate("/admin/settings/admin-permission")}
            >
              Next
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-transparent border border-[#12DCF0] text-white px-10 py-2  hover:bg-[#12DCF0] hover:text-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
