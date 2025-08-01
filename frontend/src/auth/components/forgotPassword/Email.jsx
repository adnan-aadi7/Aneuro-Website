import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/auth/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../../../store/Slice/UserSlice";

export default function Email() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { forgotPasswordLoading, error } = useSelector((state) => state.user);
  
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setLocalError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    // Basic email validation
    if (!email) {
      setLocalError("Please enter your email address");
      return;
    }
    
    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address");
      return;
    }

    try {
      const result = await dispatch(sendOtp(email)).unwrap();
      console.log("OTP sent successfully:", result);
      // Navigate to email instruction page with email
      navigate("/email-instruction", { state: { email } });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setLocalError(error || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full ">
      <div className="w-full max-w-lg mx-auto bg-opacity-90">
        {/* Logo */}
        <div className="flex justify-center ">
          <img src={logo} alt="Logo" className="w-[163px] h-[150px]" />
        </div>
        
        {/* Form Container */}
        <div className="rounded-lg p-4  bg-opacity-90 w-full">
          <h2 className="text-white text-2xl font-semibold text-center mb-2">
            Forgot your password?
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Enter your registered email below to receive your password reset instructions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {(localError || error) && (
              <div className="text-red-400 text-xs sm:text-sm text-center mb-2">
                {localError || error}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-600  text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            {/* Send Instructions Button */}
            <button
              type="submit"
              disabled={forgotPasswordLoading}
              className="w-full bg-cyan-400 text-gray-900 py-3  font-semibold hover:bg-cyan-300 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-xs sm:text-sm">
              Remember your password?{" "}
            </span>
            <Link
              to="/login"
              className="text-cyan-400 hover:underline text-xs sm:text-sm"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
