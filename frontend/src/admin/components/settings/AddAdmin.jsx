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
  const [showModal, setShowModal] = useState(false);
  const [, setSelectedAdmin] = useState(null);
  const [toggleStates, setToggleStates] = useState({
    activate: true,
    deactivate: false
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

  const handleAdminClick = (adminIndex) => {
    setSelectedAdmin(adminIndex);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAdmin(null);
  };

  const handleToggle = (toggleType) => {
    // Make toggles mutually exclusive: only one can be ON at a time
    if (toggleType === 'activate') {
      setToggleStates({ activate: true, deactivate: false });
    } else if (toggleType === 'deactivate') {
      setToggleStates({ activate: false, deactivate: true });
    }
  };

  return (
    <div className=" text-white">
      {/* Admin Profile Cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-[#2A2A39] border border-[#374151]  p-4 flex items-center gap-3 min-w-[240px] md:min-w-[280px] flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-700 shrink-0">
              <img
                src={`https://i.pravatar.cc/80?img=${index + 10}`}
                alt="Admin avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Aden Smith</h3>
              <p className="text-gray-400 text-sm">Commissions Manager</p>
            </div>
            <button 
              className="text-white hover:text-white"
              onClick={() => handleAdminClick(index)}
            >
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
          <div className="flex flex-col md:flex-row gap-4">
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
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

      {/* Admin Action Modal */}
      {showModal && (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2A39] border border-[#374151] p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Admin Actions</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Activate Admin */}
              <div className="flex items-center justify-between">
                <span className={toggleStates.activate ? "text-green-400" : "text-white"}>
                  Activate Admin
                </span>
                <button
                  onClick={() => handleToggle('activate')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    toggleStates.activate ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    toggleStates.activate ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* Deactivate Admin */}
              <div className="flex items-center justify-between">
                <span className={toggleStates.deactivate ? "text-red-400" : "text-white"}>
                  Deactivate Admin
                </span>
                <button
                  onClick={() => handleToggle('deactivate')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    toggleStates.deactivate ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    toggleStates.deactivate ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAdmin;
