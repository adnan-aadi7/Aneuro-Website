import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/auth/logo.png";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, googleLogin, facebookLogin } from "../../../store/Slice/UserSlice"; // path based on your setup
import { toastPromise } from "../../../toast";

export default function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { loading, error, googleLoading, facebookLoading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "google_auth_failed":
          setFormError("Google authentication failed. Please try again.");
          break;
        case "no_auth_code":
          setFormError("Authentication was cancelled or failed.");
          break;
        default:
          setFormError("An error occurred during authentication.");
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyLetters }));
    } 
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic field trims
    const name = (formData.name || "").trim();
    const email = (formData.email || "").trim();
    const password = formData.password || "";
    const confirmPassword = formData.confirmPassword || "";

    // Client-side validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (name.length < 2) {
      setFormError("Please enter your full name");
      return;
    }
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }
    if (password.length < 8 || !hasUpper || !hasLower || !hasNumber) {
      setFormError("Password must be 8+ chars and include upper, lower, and number");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(signupUser({ name, email, password, confirmPassword })).unwrap();
      console.log("Signup successful", result);
      navigate("/plan");
    } catch (err) {
      setFormError(err || "Signup failed");
    }
  };

  const handleGoogleLogin = async () => {
    setFormError("");
    try {
      const op = dispatch(googleLogin()).unwrap();
      await toastPromise(
        op,
        {
          loading: "Connecting to Google…",
          success: "Authenticated with Google",
          error: "Google authentication failed",
        },
        { duration: 3000 }
      );
    } catch (e) {
      setFormError(
        typeof e === "string" ? e : e?.message || "Google authentication failed"
      );
    }
  };

  const handleFacebookLogin = async () => {
    setFormError("");
    try {
      await dispatch(facebookLogin());
    } catch {
      setFormError("Facebook authentication failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-2">
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
                className="cursor-pointer w-full bg-cyan-400 text-gray-900 py-3 rounded-md font-semibold hover:bg-cyan-300 transition-colors"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-xs sm:text-sm">Or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          <div className=" gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center px-2 bg-black border border-gray-600 rounded-md text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
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
              {googleLoading ? "Loading..." : "Sign up with Google"}
            </button>

           {/*} <button
              onClick={handleFacebookLogin}
              disabled={facebookLoading}
              className="w-full flex items-center px-2 bg-black border border-gray-600 rounded-md text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F3" d="M24 12.073C24 18.7 18.627 24 12 24S0 18.7 0 12.073C0 5.746 5.373.373 12 .373s12 5.373 12 11.7z"/>
                <path fill="#FFFFFF" d="M13.615 19.309v-6.263h2.102l.314-2.433h-2.416V8.847c0-.704.195-1.184 1.204-1.184h1.287V5.5c-.223-.03-.988-.096-1.879-.096-1.86 0-3.135 1.135-3.135 3.221v1.796H9v2.433h2.092v6.455h2.523z"/>
              </svg>
              {facebookLoading ? "Loading..." : "Sign up with Facebook"}
            </button> */}
          </div>

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
