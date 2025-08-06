import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../store/Slice/UserSlice";

export default function ResetPasswordPopup({ onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [form, setForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!form.current || !form.new || !form.confirm) {
      setError("All fields are required.");
      return;
    }
    
    if (form.new !== form.confirm) {
      setError("New password and confirm password do not match.");
      return;
    }
    
    if (form.new.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await dispatch(
        changePassword({
          userId: user.id,
          currentPassword: form.current,
          newPassword: form.new,
        })
      ).unwrap();
      
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setError(err || "Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        className="relative w-full max-w-md mx-auto  p-8 bg-[#232336] shadow-2xl"
        style={{ boxShadow: "inset 0 0 20px 0 #12DCF080" }}
      >
        <h2 className="text-2xl font-semibold text-white mb-8">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              name="current"
              value={form.current}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full bg-transparent border border-cyan-400 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          {/* New Password */}
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              name="new"
              value={form.new}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full bg-transparent border border-cyan-400 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400"
              onClick={() => toggleShow("new")}
              tabIndex={-1}
              disabled={isLoading}
            >
              {show.new ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 8.25M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 8.25M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full bg-transparent border border-cyan-400 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400"
              onClick={() => toggleShow("confirm")}
              tabIndex={-1}
              disabled={isLoading}
            >
              {show.confirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 8.25M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75C3.5 7.5 7.5 4.5 12 4.5c4.5 0 8.5 3 9.75 8.25M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          
          {/* Error and Success Messages */}
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-sm bg-green-900/20 border border-green-500/30 rounded px-3 py-2">
              {success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 text-black font-medium py-3 rounded mt-4 hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
