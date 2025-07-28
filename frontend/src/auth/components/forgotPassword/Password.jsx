import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/auth/logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function Password() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!formData.password) {
      setError("Please enter a password");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to update password
    setTimeout(() => {
      setIsLoading(false);
      // Here you would typically make an API call to update the password
      console.log("Updating password...");
      // For demo purposes, we'll just show success and redirect
      alert("Password updated successfully!");
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-lg mx-auto bg-opacity-90">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-[163px] h-[150px]" />
        </div>
        
        {/* Form Container */}
        <div className="rounded-lg p-4 bg-opacity-90 w-full">
          <h2 className="text-white text-2xl font-semibold text-center mb-2">
            Reset your password?
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Enter your new password below to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-xs sm:text-sm text-center mb-2">
                {error}
              </div>
            )}
            
            {/* Password Field */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-600 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-600 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-400 text-gray-900 py-3 font-semibold hover:bg-cyan-300 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>

          {/* Back to Login Link */}
          
        </div>
      </div>
    </div>
  );
}
