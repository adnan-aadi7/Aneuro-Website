import { useState, useRef } from "react";
import logo from "../../../assets/auth/logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function SendInstruction() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email] = useState("Yourname@gmail.com"); // This would come from props or state management
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

  const handleResend = () => {
    setIsLoading(true);
    // Simulate API call to resend instructions
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to new password page
      navigate("/new-password");
    }, 1000);
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

          {/* Resend Instructions Button */}
          <div className="flex justify-center mt-15">
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="w-full bg-cyan-400 text-gray-900 py-3 font-semibold hover:bg-cyan-300 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
