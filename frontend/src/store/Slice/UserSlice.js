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

// Async thunk for changing password from settings
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/change-password', {
        userId,
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to change password'
      );
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData, profileImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Always append mobileNumber, even if empty string
      Object.keys(userData).forEach(key => {
        if (key === 'mobileNumber') {
          formData.append(key, userData[key] ?? '');
        } else if (userData[key] !== '') {
          formData.append(key, userData[key]);
        }
      });
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      const response = await axiosInstance.put(`/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to update profile'
      );
    }
  }
);

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/delete/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to delete user'
      );
    }
  }
);

// Async thunk for suspending a user
export const suspendUser = createAsyncThunk(
  'user/suspendUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/suspend/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to suspend user'
      );
    }
  }
);

// Async thunk for reactivating a user
export const reactivateUser = createAsyncThunk(
  'user/reactivateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/reactivate/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to reactivate user'
      );
    }
  }
);

// Async thunk for fetching all users
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data.users;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch users'
      );
    }
  }
);

// Helper function to get initial user state from localStorage
const getInitialUserState = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const userProfileImage = localStorage.getItem('userProfileImage');
  const userMobileNumber = localStorage.getItem('userMobileNumber');
  const subscription = localStorage.getItem('subscription');
  
  if (token && userId && userEmail) {
    return {
      user: {
        id: userId,
        email: userEmail,
        name: userName || userEmail.split('@')[0], // Use stored name or email prefix as fallback
        profileImage: userProfileImage || "",
        mobileNumber: userMobileNumber || "",
        subscription: subscription ? JSON.parse(subscription) : null
      },
      token: token,
      status: 'succeeded',
      googleLoading: false,
      facebookLoading: false,
      forgotPasswordLoading: false,
      error: null,
    };
  }
  
  return {
    user: null,
    token: null,
    status: 'idle',
    googleLoading: false,
    facebookLoading: false,
    forgotPasswordLoading: false,
    error: null,
  };
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    ...getInitialUserState(),
    users: [],
    usersLoading: false,
    usersError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userProfileImage');
      localStorage.removeItem('userMobileNumber');
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
        localStorage.setItem('userName', action.payload.user.name);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        // Save to localStorage for payment flow
        localStorage.setItem('userId', action.payload.user.id);
        localStorage.setItem('userEmail', action.payload.user.email);
        localStorage.setItem('userName', action.payload.user.name);
        localStorage.setItem('userProfileImage', action.payload.user.profileImage || ""); // Always Cloudinary URL
        localStorage.setItem('userMobileNumber', action.payload.user.mobileNumber || "");
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
        localStorage.setItem('userName', action.payload.user.name);
        localStorage.setItem('userProfileImage', action.payload.user.profileImage || "");
        localStorage.setItem('userMobileNumber', action.payload.user.mobileNumber || "");
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
        localStorage.setItem('userName', action.payload.user.name);
        localStorage.setItem('userProfileImage', action.payload.user.profileImage || "");
        localStorage.setItem('userMobileNumber', action.payload.user.mobileNumber || "");
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
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.forgotPasswordLoading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload.user,
        };
        state.status = 'succeeded';
        // Update localStorage with new user data
        if (action.payload.user.name) {
          localStorage.setItem('userName', action.payload.user.name);
        }
        if (action.payload.user.profileImage) {
          localStorage.setItem('userProfileImage', action.payload.user.profileImage); // Always Cloudinary URL
        }
        if (action.payload.user.mobileNumber !== undefined) {
          localStorage.setItem('userMobileNumber', action.payload.user.mobileNumber);
        }
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(suspendUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(reactivateUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      // Fetch users list
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload || [];
        state.usersError = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload || 'Failed to fetch users';
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
