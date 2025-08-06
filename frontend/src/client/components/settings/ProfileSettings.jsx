import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../../store/Slice/UserSlice";

export default function ProfileSettigs() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });

  const [avatar, setAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const fileInputRef = useRef(null);

  // Initialize form data with user data from Redux store
  useEffect(() => {
    if (user) {
      // Split full name into first and last name
      const nameParts = (user.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
      });
      
      // Always use Cloudinary URL from Redux user.profileImage
      setAvatar(user.profileImage || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleUpdateNow = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Combine firstName and lastName into name for the API
      const userDataForAPI = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        mobileNumber: formData.mobileNumber ?? '', // Always include mobileNumber
      };
      
      // Remove firstName and lastName from the data sent to API
      delete userDataForAPI.firstName;
      delete userDataForAPI.lastName;
      
      await dispatch(updateUserProfile({
        userId: user.id,
        userData: userDataForAPI,
        profileImage: selectedFile
      })).unwrap();
      
      // Reset selected file after successful update
      setSelectedFile(null);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast(error.message || "Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      // Split full name into first and last name
      const nameParts = (user.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
      });
      
      // Always use Cloudinary URL from Redux user.profileImage
      setAvatar(user.profileImage || "");
    }
    
    // Reset selected file
    setSelectedFile(null);
  };

  const handleEditAvatar = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for upload
      setSelectedFile(file);
      // Preview the image locally until upload is done
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="lg:p-6 p-2">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      
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
              className="w-full bg-[#2A2A39] border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
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
            disabled={isLoading}
            className={`px-6 py-2 font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-cyan-400 text-black hover:bg-cyan-300'
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Now'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-transparent border border-gray-600 text-gray-300 px-6 py-2 hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
