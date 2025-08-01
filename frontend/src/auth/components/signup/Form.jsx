import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/auth/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../../store/Slice/UserSlice"; // path based on your setup

export default function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple password match validation
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(signupUser(formData)).unwrap();
      console.log("Signup successful", result);
      navigate("/plan");
    } catch (err) {
      setFormError(err || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full px-2">
      <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 py-6 bg-opacity-80">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-[163px] h-[150px]" />
        </div>
        {/* Form Container */}
        <div className="rounded-lg shadow-xl">
          <h2 className="text-white text-2xl font-semibold text-center">Sign up Your Account!</h2>
          <p className="text-gray-400 text-center mb-3">Enter details to create your account</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-md text-white placeholder-gray-400 pr-12 focus:ring-2 focus:ring-cyan-400"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-md text-white placeholder-gray-400 pr-12 focus:ring-2 focus:ring-cyan-400"
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

              {/* Error */}
              {(formError || error) && (
                <p className="text-red-500 text-sm text-center">
                  {formError || error}
                </p>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 text-gray-900 py-3 rounded-md font-semibold hover:bg-cyan-300 transition-colors"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-xs sm:text-sm">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-cyan-400 hover:underline text-xs sm:text-sm"
            >
              Sign in
            </Link>
          </div>
           
        </div>
        
      </div>
      
    </div>
    
  );
}
