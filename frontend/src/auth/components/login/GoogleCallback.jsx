import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get the data from URL parameters
        const data = searchParams.get('data');
        const error = searchParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          navigate('/login?error=google_auth_failed', { replace: true });
          return;
        }

        if (!data) {
          console.error('No data received from Google callback');
          navigate('/login?error=no_auth_data', { replace: true });
          return;
        }

        // Decode and parse the data
        const decodedData = JSON.parse(decodeURIComponent(data));
        const { token, user, hasActiveSubscription } = decodedData;

        if (!token || !user) {
          console.error('Invalid data received from Google callback');
          navigate('/login?error=invalid_auth_data', { replace: true });
          return;
        }

        // Store the data in localStorage (similar to regular login)
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('token', token);
        localStorage.setItem('subscription', JSON.stringify(user.subscription || null));

        // Navigate based on user type and subscription status
        if (user.userType === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (hasActiveSubscription) {
          // User has active subscription, go to dashboard
          navigate("/client/dashboard", { replace: true });
        } else {
          // User has no subscription or inactive subscription, go to plan selection
          navigate("/plan", { replace: true });
        }
      } catch (error) {
        console.error('Google callback error:', error);
        navigate('/login?error=google_auth_failed', { replace: true });
      }
    };

    handleGoogleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Processing Google authentication...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
} 