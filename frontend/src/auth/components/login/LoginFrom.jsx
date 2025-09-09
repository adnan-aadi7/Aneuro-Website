// src/pages/Auth/LoginForm.jsx
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/auth/logo.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  resetUserStatus,
  googleLogin,
  facebookLogin,
} from "../../../store/Slice/UserSlice";
import { toastPromise } from "../../../toast";
import axiosInstance from "../../../store/axiosInstance";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { status, googleLoading, facebookLoading } = useSelector(
    (state) => state.user
  );
  const [searchParams] = useSearchParams();
  

  useEffect(() => {
    dispatch(resetUserStatus());
  }, [dispatch]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "google_auth_failed":
          setError("Google authentication failed. Please try again.");
          break;
        case "no_auth_code":
          setError("Authentication was cancelled or failed.");
          break;
        default:
          setError("An error occurred during authentication.");
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const op = dispatch(loginUser(formData)).unwrap();

    try {
      const payload = await toastPromise(
        op,
        {
          loading: "Signing you in…",
          success: "Welcome back!",
          error: (err) =>
            typeof err === "string" ? err : err?.message || "Login failed",
        },
        { duration: 3000 }
      );

      const user = payload?.user || {};
      const token = payload?.token;
      const userId = user?._id || user?.id;

      // Admins bypass quiz and subscription checks
      if (user?.userType === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // --- QUIZ GATE ---
      // Prefer values returned on login if present
      let completion =
        user?.quizProgress?.completionPercentage ??
        (user?.quizProgress?.isCompleted ? 100 : undefined);

      // If not provided by login response, fetch progress
      if (completion == null && userId) {
        try {
          // NOTE: axiosInstance has baseURL '/api', so do NOT prefix with '/api'
          const res = await axiosInstance.get(`/quiz/progress/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          // Accept either {completionPercentage} or {data:{completionPercentage}}
          const body = res?.data ?? {};
          const dataNode =
            body && typeof body === "object" && "data" in body ? body.data : body;

          completion =
            dataNode?.completionPercentage ??
            (dataNode?.isCompleted ? 100 : undefined);
        } catch {
          // On any error (including 404), be safe and send to /quiz
          navigate("/quiz");
          return;
        }
      }

      if (Number(completion) < 100) {
        navigate("/quiz");
        return;
      }
      // --- END QUIZ GATE ---

      // Continue with existing routing
      const hasActiveSubscription =
        user?.subscription &&
        user.subscription.plan &&
        user.subscription.status === "active";

      if (hasActiveSubscription) {
        navigate("/client/dashboard");
        return;
      }
      navigate("/plan");
    } catch (err) {
      setError(typeof err === "string" ? err : err?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
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
      setError(
        typeof e === "string" ? e : e?.message || "Google authentication failed"
      );
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    try {
      await dispatch(facebookLogin());
    } catch {
      setError("Facebook authentication failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-full ">
      <div className="w-full max-w-sm sm:max-w-md mx-auto bg-opacity-90">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-[163px] h-[150px]" />
        </div>

        <div className="rounded-lg p-4 sm:-8 bg-opacity-90 w-full">
          <h2 className="text-white text-2xl font-semibold text-center mb-2">
            Sign in Your Account!
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Enter details to create your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2">
                E-mail 
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-gray-300 text-xs sm:text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs sm:text-sm text-center mb-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-400 text-gray-900 py-3 rounded-md font-semibold hover:bg-cyan-300 transition-colors text-xs sm:text-sm cursor-pointer"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-xs sm:text-sm">Or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center px-2 bg-black border border-gray-600 rounded-md text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              {googleLoading ? "Loading..." : "Sign in with Google"}
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={facebookLoading}
              className="w-full flex items-center px-2 bg-black border border-gray-600 rounded-md text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F3" d="M24 12.073C24 18.7 18.627 24 12 24S0 18.7 0 12.073C0 5.746 5.373.373 12 .373s12 5.373 12 11.7z"/>
                <path fill="#FFFFFF" d="M13.615 19.309v-6.263h2.102l.314-2.433h-2.416V8.847c0-.704.195-1.184 1.204-1.184h1.287V5.5c-.223-.03-.988-.096-1.879-.096-1.86 0-3.135 1.135-3.135 3.221v1.796H9v2.433h2.092v6.455h2.523z"/>
              </svg>
              {facebookLoading ? "Loading..." : "Sign in with Facebook"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-400 text-xs sm:text-sm">
              Don't have an account?{" "}
            </span>
            <Link to="/signup" className="text-cyan-400 hover:underline text-xs sm:text-sm">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
