import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/auth/logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded users
  const users = [
    {
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "user@example.com",
      password: "user123",
      role: "user",
    },
    {
      email: "enterprize@example.com",
      password: "user123",
      role: "enterprize",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const foundUser = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );
    if (foundUser) {
      if (foundUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (foundUser.role === "user") {
        navigate("/client/dashboard");
      } else if (foundUser.role === "enterprize") {
        navigate("/enterprize-quiz");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col p-2 sm:p-4 ">
      <div className="w-full sm:w-full md:max-w-md md:mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-[163px] h-[150px]" />
        </div>
        {/* Form Container */}
        <div className="rounded-lg  p-4 sm:-8 bg-opacity-90">
          <h2 className="text-white text-2xl font-semibold text-center mb-2">
            Sign in Your Account!
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Enter details to create your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-xs sm:text-sm text-center mb-2">
                {error}
              </div>
            )}
            {/* Email Field */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2">
                E-mail or Phone Number
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-600 rounded-md text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

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
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-600 rounded-md text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a
                  href="#"
                  className="text-gray-300 text-xs sm:text-sm hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-cyan-400 text-gray-900 py-3 rounded-md font-semibold hover:bg-cyan-300 transition-colors text-xs sm:text-sm"
            >
              Sign up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-xs sm:text-sm">Or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="w-full flex items-center px-2 bg-black border border-gray-600 rounded-md text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap py-2 text-xs sm:text-sm">
              {/* Colored Google SVG */}
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.09 1.53 7.49 2.81l5.54-5.39C33.64 3.54 29.2 1.5 24 1.5 14.98 1.5 7.06 7.5 3.68 15.44l6.44 5.01C11.6 15.01 17.32 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.5c0-1.64-.15-3.21-.42-4.72H24v9.02h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.18 5.59C43.98 37.01 46.1 31.25 46.1 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.12 28.45A14.5 14.5 0 0 1 9.5 24c0-1.55.27-3.05.62-4.45l-6.44-5.01A23.93 23.93 0 0 0 0 24c0 3.81.92 7.41 2.54 10.56l7.58-6.11z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 46.5c6.48 0 11.92-2.14 15.89-5.84l-7.58-6.11c-2.13 1.43-4.87 2.3-8.31 2.3-6.68 0-12.4-5.51-13.88-12.94l-7.58 6.11C7.06 40.5 14.98 46.5 24 46.5z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </g>
              </svg>
              Sign up with Google
            </button>
            <button className="w-full flex items-center px-2 bg-black border border-gray-600 rounded-md text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap py-2 text-xs sm:text-sm ">
              {/* Colored Facebook SVG */}
              <span style={{ transform: "scale(.7)", display: "inline-block" }}>
                <svg className="w-5 h-5 " viewBox="0 0 24 24">
                  <path
                    fill="#1877F3"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                  <path
                    fill="#FFF"
                    d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.436V5.996S15.312 5.761 14 5.761c-2.741 0-4.533 1.662-4.533 4.669v2.143H6.42v3.47h3.047v8.385A12.07 12.07 0 0 0 12 24c.414 0 .822-.024 1.225-.062v-8.395h2.446z"
                  />
                </svg>
              </span>
              Sign up with Facebook
            </button>
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-xs sm:text-sm">
              Don't have an account?{" "}
            </span>
            <Link
              to="/"
              className="text-cyan-400 hover:underline text-xs sm:text-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
