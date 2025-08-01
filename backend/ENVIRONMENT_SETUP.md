# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Facebook OAuth2 Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Session Secret
SESSION_SECRET=your_session_secret_key
```

## Important Notes

### Google OAuth2 Setup
1. **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: Get these from Google Cloud Console
2. **GOOGLE_CALLBACK_URL**: Should point to your backend callback endpoint
3. **FRONTEND_URL**: Should point to your frontend application URL

### Facebook OAuth2 Setup
1. **FACEBOOK_APP_ID** and **FACEBOOK_APP_SECRET**: Get these from Facebook Developers Console
2. **FACEBOOK_CALLBACK_URL**: Should point to your backend callback endpoint
3. **FRONTEND_URL**: Should point to your frontend application URL

### Frontend URL Configuration
The `FRONTEND_URL` is crucial for Google OAuth redirects. Make sure it matches your frontend development server URL:
- Development: `http://localhost:5173` (Vite default)
- Production: `https://yourdomain.com`

### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)

### Facebook Developers Console Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add Facebook Login product to your app
4. Go to "Facebook Login" → "Settings"
5. Set Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/facebook/callback` (for development)
   - `https://yourdomain.com/api/auth/facebook/callback` (for production)

## Testing the Setup

1. Start your backend server
2. Navigate to `http://localhost:3000/api/auth/google/url` to test Google auth URL generation
3. Navigate to `http://localhost:3000/api/auth/facebook/url` to test Facebook auth URL generation
4. Test the complete OAuth flow from frontend

## Troubleshooting

### Common Issues:
1. **"GOOGLE_CLIENT_ID not configured"**: Check your `.env` file
2. **"FACEBOOK_APP_ID not configured"**: Check your `.env` file
3. **"Invalid redirect URI"**: Verify callback URL in Google Cloud Console or Facebook Developers Console
4. **"FRONTEND_URL not configured"**: Add FRONTEND_URL to your `.env` file

### Debug Routes:
- `GET /api/auth/google/debug` - Check Google OAuth configuration
- `GET /api/auth/google/url` - Test Google auth URL generation
- `GET /api/auth/facebook/url` - Test Facebook auth URL generation 