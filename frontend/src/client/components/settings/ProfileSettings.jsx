import { useState, useRef } from "react";

export default function ProfileSettigs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });

  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  );
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateNow = () => {
    console.log("Update Now clicked", formData);
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
    });
  };

  const handleEditAvatar = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="  lg:p-6 p-2">
      <div className="w-full">
        {/* Profile Avatar */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600 relative group">
            <img
              src={avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleEditAvatar}
              className="absolute bottom-2 right-2 bg-cyan-400 p-1 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center"
              title="Edit profile picture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 12.362-12.3z"
                />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-gray-600  px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-gray-600  px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full bg-[#2A2A39] border border-gray-600  px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleUpdateNow}
            className="bg-cyan-400 text-black px-6 py-2  font-medium hover:bg-cyan-300 transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={handleCancel}
            className="bg-transparent border border-gray-600 text-gray-300 px-6 py-2  hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
