# Google Authentication Test Guide

## Prerequisites

1. Set up Google Cloud Console project
2. Configure environment variables
3. Start the backend server

## Environment Variables Setup

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session
SESSION_SECRET=your_session_secret

# Email (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Testing Steps

### 1. Test Google Auth URL Generation

```bash
curl -X GET http://localhost:3000/api/auth/google/url
```

**Expected Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

### 2. Test Google OAuth2 Flow

1. Open the auth URL in browser
2. Complete Google authentication
3. You should be redirected to callback URL
4. Check response for JWT token and user data

### 3. Test Google Auth with Code (Alternative)

```bash
curl -X POST http://localhost:3000/api/auth/google/code \
  -H "Content-Type: application/json" \
  -d '{"code": "your_authorization_code"}'
```

### 4. Test User Creation/Login

After successful Google authentication:

1. Check MongoDB for new user creation
2. Verify user fields:
   - `name`: From Google profile
   - `email`: From Google profile
   - `profileImage`: From Google profile (if available)
   - `password`: Should start with "google_"
   - `userType`: "user"
   - `accountStatus`: "active"

### 5. Test JWT Token

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Common Issues and Solutions

### Issue: "Invalid Client ID"
- **Solution**: Check Google Cloud Console configuration
- Verify client ID and secret in environment variables

### Issue: "Invalid Redirect URI"
- **Solution**: Ensure callback URL matches exactly in Google Console
- Check for trailing slashes or protocol mismatches

### Issue: "Access Denied"
- **Solution**: User may have denied permission
- Check OAuth consent screen configuration

### Issue: "Network Error"
- **Solution**: Check CORS configuration
- Verify server is running on correct port

## Frontend Integration Test

### Simple HTML Test Page

Create `test-google.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Google Auth Test</title>
</head>
<body>
    <h1>Google Authentication Test</h1>
    <button onclick="testGoogleAuth()">Test Google Login</button>
    <div id="result"></div>

    <script>
        async function testGoogleAuth() {
            try {
                const response = await fetch('http://localhost:3000/api/auth/google/url');
                const data = await response.json();
                
                document.getElementById('result').innerHTML = 
                    `<p>Auth URL: ${data.authUrl}</p>
                     <p><a href="${data.authUrl}" target="_blank">Click to test Google OAuth</a></p>`;
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

## Verification Checklist

- [ ] Google Cloud Console project configured
- [ ] Environment variables set correctly
- [ ] Backend server starts without errors
- [ ] Google auth URL generation works
- [ ] OAuth2 flow completes successfully
- [ ] JWT token is generated
- [ ] User is created/updated in database
- [ ] Token can be used for authenticated requests
- [ ] Profile image is saved (if available)
- [ ] Error handling works properly

## Production Considerations

1. **HTTPS**: Use HTTPS in production
2. **Domain**: Update callback URLs for production domain
3. **Security**: Use strong session secrets
4. **Monitoring**: Add logging for authentication events
5. **Rate Limiting**: Consider adding rate limiting for auth endpoints 