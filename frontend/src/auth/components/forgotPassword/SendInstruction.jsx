import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/auth/logo.png";
import { Link } from "react-router-dom";
import { verifyOtp, sendOtp } from "../../../store/Slice/UserSlice";

export default function SendInstruction() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { forgotPasswordLoading, error } = useSelector((state) => state.user);
  
  const [email] = useState(location.state?.email || "Yourname@gmail.com");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      otpRefs[idx + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setLocalError("");
    
    // Check if OTP is complete
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setLocalError("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      const result = await dispatch(verifyOtp({ email, otp: otpString })).unwrap();
      console.log("OTP verified successfully:", result);
      // Navigate to new password page with email and OTP
      navigate("/new-password", { state: { email, otp: otpString } });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      setLocalError(error || "Failed to verify OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    setLocalError("");
    try {
      const result = await dispatch(sendOtp(email)).unwrap();
      console.log("OTP resent successfully:", result);
      // Clear OTP fields
      setOtp(["", "", "", "", "", ""]);
      // Focus on first OTP field
      otpRefs[0].current.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setLocalError(error || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-lg mx-auto bg-opacity-90">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-[163px] h-[150px]" />
        </div>
        {/* Content Container */}
        <div className="rounded-lg p-4 bg-opacity-90 w-full">
          <h2 className="text-white text-2xl font-semibold text-center mb-2">
            Email instruction sent
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Please follow the reset instructions in the email we sent to the following address:{" "}
            <span className="text-white font-medium">{email}</span>
          </p>

          {/* Error Message */}
          {(localError || error) && (
            <div className="text-red-400 text-xs sm:text-sm text-center mb-4">
              {localError || error}
            </div>
          )}

          {/* OTP Input */}
          <div className="flex flex-col items-center mb-8">
            <label className="text-gray-300 text-sm mb-2">Enter 6-digit OTP</label>
            <div className="flex gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className="w-10 h-12 text-center text-xl rounded-md border border-gray-600 bg-[#181A20] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleVerifyOtp}
              disabled={forgotPasswordLoading}
              className="w-full bg-cyan-400 text-gray-900 py-3 font-semibold hover:bg-cyan-300 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordLoading ? "Verifying..." : "Continue"}
            </button>
          </div>

          {/* Resend OTP Button */}
          <div className="flex justify-center">
            <button
              onClick={handleResend}
              disabled={forgotPasswordLoading}
              className="text-cyan-400 hover:underline text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordLoading ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
