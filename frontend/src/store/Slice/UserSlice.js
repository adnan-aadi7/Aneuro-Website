import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/signup', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Signup failed'
      );
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', loginData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Login failed'
      );
    }
  }
);

// Async thunk for Google authentication
export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      // Get Google auth URL from backend
      const response = await axiosInstance.get('/auth/google/url');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Google authentication failed'
      );
    }
  }
);

// Async thunk for Google authentication with code
export const googleLoginWithCode = createAsyncThunk(
  'user/googleLoginWithCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/google/code', { code });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Google authentication failed'
      );
    }
  }
);

// Async thunk for Facebook authentication
export const facebookLogin = createAsyncThunk(
  'user/facebookLogin',
  async (_, { rejectWithValue }) => {
    try {
      // Get Facebook auth URL from backend
      const response = await axiosInstance.get('/auth/facebook/url');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Facebook authentication failed'
      );
    }
  }
);

// Async thunk for Facebook authentication with code
export const facebookLoginWithCode = createAsyncThunk(
  'user/facebookLoginWithCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/facebook/code', { code });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Facebook authentication failed'
      );
    }
  }
);

// Async thunk for sending OTP
export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to send OTP'
      );
    }
  }
);

// Async thunk for verifying OTP
export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/verify-otp', { email, otp });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to verify OTP'
      );
    }
  }
);

// Async thunk for resetting password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to reset password'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    googleLoading: false,
    facebookLoading: false,
    forgotPasswordLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      localStorage.removeItem('subscription');
    },
    resetUserStatus: (state) => {
      state.status = 'idle';
      state.googleLoading = false;
      state.facebookLoading = false;
      state.forgotPasswordLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'succeeded';
        // Save to localStorage for payment flow
        localStorage.setItem('userId', action.payload.user.id);
        localStorage.setItem('userEmail', action.payload.user.email);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        // Save to localStorage for payment flow
        localStorage.setItem('userId', action.payload.user.id);
        localStorage.setItem('userEmail', action.payload.user.email);
        localStorage.setItem('token', action.payload.token);
        // Save subscription to localStorage for plan-based UI
        localStorage.setItem('subscription', JSON.stringify(action.payload.user.subscription || null));
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        // Redirect to Google OAuth2 URL
        window.location.href = action.payload.authUrl;
      })
      .addCase(googleLoginWithCode.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        // Save to localStorage for payment flow
        localStorage.setItem('userId', action.payload.user.id);
        localStorage.setItem('userEmail', action.payload.user.email);
        localStorage.setItem('token', action.payload.token);
        // Save subscription to localStorage for plan-based UI
        localStorage.setItem('subscription', JSON.stringify(action.payload.user.subscription || null));
      })
      .addCase(facebookLogin.fulfilled, (state, action) => {
        // Redirect to Facebook OAuth2 URL
        window.location.href = action.payload.authUrl;
      })
      .addCase(facebookLoginWithCode.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        // Save to localStorage for payment flow
        localStorage.setItem('userId', action.payload.user.id);
        localStorage.setItem('userEmail', action.payload.user.email);
        localStorage.setItem('token', action.payload.token);
        // Save subscription to localStorage for plan-based UI
        localStorage.setItem('subscription', JSON.stringify(action.payload.user.subscription || null));
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.forgotPasswordLoading = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.forgotPasswordLoading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.forgotPasswordLoading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state, action) => { 
          state.status = 'loading';
          // Set specific loading states for Google and Facebook
          if (action.type.includes('googleLogin')) {
            state.googleLoading = true;
          } else if (action.type.includes('facebookLogin')) {
            state.facebookLoading = true;
          } else if (action.type.includes('sendOtp') || action.type.includes('verifyOtp') || action.type.includes('resetPassword')) {
            state.forgotPasswordLoading = true;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.googleLoading = false;
          state.facebookLoading = false;
          state.forgotPasswordLoading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { logout, resetUserStatus } = userSlice.actions;
export default userSlice.reducer;
