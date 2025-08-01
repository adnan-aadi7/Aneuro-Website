# Google OAuth2 Authentication Setup Guide

## Environment Variables Required

Add these to your `.env` file:

```env
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session Secret (for Passport sessions)
SESSION_SECRET=your_session_secret_key
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)

## API Endpoints

### 1. Get Google Auth URL
```http
GET /api/auth/google/url
```
Returns the Google OAuth2 authorization URL for frontend redirect.

**Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### 2. Google OAuth2 Callback
```http
GET /api/auth/google/callback
```
Handles the OAuth2 callback from Google and returns JWT token.

**Response:**
```json
{
  "message": "Google login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "userType": "user",
    "accountStatus": "active",
    "profileImage": "https://...",
    "subscription": null
  }
}
```

### 3. Google Auth with Code (Alternative)
```http
POST /api/auth/google/code
Content-Type: application/json

{
  "code": "authorization_code_from_google"
}
```
For mobile apps or custom OAuth flows.

## Frontend Integration Examples

### React Example (Using Google OAuth2 URL)

```jsx
import { useState } from 'react';
import axios from 'axios';

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Get Google auth URL from backend
      const response = await axios.get('/api/auth/google/url');
      const { authUrl } = response.data;
      
      // Redirect to Google OAuth2
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Login with Google'}
    </button>
  );
};

export default GoogleLogin;
```

### React Example (Using Google Sign-In Button)

```jsx
import { useEffect } from 'react';
import axios from 'axios';

const GoogleSignIn = () => {
  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Send authorization code to backend
      const result = await axios.post('/api/auth/google/code', {
        code: response.credential
      });

      // Store token and user data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Redirect or update state
      console.log('Google login successful:', result.data);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div>
      <div id="google-signin-button"></div>
    </div>
  );
};

export default GoogleSignIn;
```

### Vanilla JavaScript Example

```javascript
// Get Google auth URL and redirect
async function loginWithGoogle() {
  try {
    const response = await fetch('/api/auth/google/url');
    const data = await response.json();
    
    // Redirect to Google OAuth2
    window.location.href = data.authUrl;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
  }
}

// Handle callback (this would be on your callback page)
async function handleGoogleCallback() {
  try {
    const response = await fetch('/api/auth/google/callback');
    const data = await response.json();
    
    if (data.token) {
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Google callback error:', error);
  }
}
```

## Security Considerations

1. **HTTPS in Production**: Always use HTTPS in production
2. **State Parameter**: Consider adding state parameter for CSRF protection
3. **Token Storage**: Store JWT tokens securely (httpOnly cookies for web apps)
4. **Environment Variables**: Never commit sensitive credentials to version control
5. **Redirect URIs**: Validate redirect URIs on both client and server side

## Error Handling

Common errors and solutions:

- **Invalid Client ID**: Check your Google Cloud Console configuration
- **Invalid Redirect URI**: Ensure callback URL matches exactly in Google Console
- **Access Denied**: User may have denied permission
- **Network Errors**: Check CORS configuration and network connectivity

## Testing

1. Test with Google test accounts first
2. Verify token generation and user creation
3. Test both new user registration and existing user login
4. Test error scenarios (denied access, network issues, etc.) 