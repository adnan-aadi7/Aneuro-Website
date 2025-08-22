import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// ---------- Utils ----------
const normalizeUser = (apiUser = {}) => {
  const id = apiUser._id || apiUser.id || null;
  return {
    id,                     // normalized id (ALWAYS use this in app code)
    _id: apiUser._id || null,
    name: apiUser.name || '',
    email: apiUser.email || '',
    mobileNumber: apiUser.mobileNumber || '',
    userType: apiUser.userType || '',            // "user", "admin", etc.
    accountStatus: apiUser.accountStatus || '',  // "active", "suspended", etc.
    profileImage: apiUser.profileImage || '',
    subscription: apiUser.subscription || null,  // { plan, status, ... }
    quizCompletion: apiUser.quizCompletion ?? 0,
    quizProgress: apiUser.quizProgress || null,  // { completionPercentage, isCompleted }
    lastLogin: apiUser.lastLogin || null,
    createdAt: apiUser.createdAt || null,
    updatedAt: apiUser.updatedAt || null,
  };
};

const persistUser = (user, token) => {
  // full object (preferred)
  localStorage.setItem('user', JSON.stringify(user));
  if (token) localStorage.setItem('token', token);

  // legacy keys (if other parts of app still read these)
  if (user?.id) localStorage.setItem('userId', user.id);
  if (user?.email) localStorage.setItem('userEmail', user.email);
  if (user?.name) localStorage.setItem('userName', user.name);
  localStorage.setItem('userProfileImage', user?.profileImage || '');
  localStorage.setItem('userMobileNumber', user?.mobileNumber || '');
  localStorage.setItem('subscription', JSON.stringify(user?.subscription || null));
};

const clearPersistedUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userProfileImage');
  localStorage.removeItem('userMobileNumber');
  localStorage.removeItem('token');
  localStorage.removeItem('subscription');
};

// Prefer full user JSON first; fall back to legacy keys
const getInitialUserState = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (token && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return {
        user,
        token,
        status: 'succeeded',
        googleLoading: false,
        facebookLoading: false,
        forgotPasswordLoading: false,
        error: null,
      };
    } catch {
      // fall through to legacy path
    }
  }

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const userProfileImage = localStorage.getItem('userProfileImage');
  const userMobileNumber = localStorage.getItem('userMobileNumber');
  const subscription = localStorage.getItem('subscription');

  if (token && userId && userEmail) {
    const user = normalizeUser({
      _id: userId,
      email: userEmail,
      name: userName || userEmail.split('@')[0],
      profileImage: userProfileImage || '',
      mobileNumber: userMobileNumber || '',
      subscription: subscription ? JSON.parse(subscription) : null,
    });

    return {
      user,
      token,
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

// ---------- Thunks ----------
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

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', loginData);
      return response.data; // { message, token, user:{ _id, ... } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Login failed'
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/google/url');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Google authentication failed'
      );
    }
  }
);

export const googleLoginWithCode = createAsyncThunk(
  'user/googleLoginWithCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/google/code', { code });
      return response.data; // expect { token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Google authentication failed'
      );
    }
  }
);

export const facebookLogin = createAsyncThunk(
  'user/facebookLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/facebook/url');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Facebook authentication failed'
      );
    }
  }
);

export const facebookLoginWithCode = createAsyncThunk(
  'user/facebookLoginWithCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/facebook/code', { code });
      return response.data; // expect { token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Facebook authentication failed'
      );
    }
  }
);

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

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData, profileImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        if (key === 'mobileNumber') {
          formData.append(key, userData[key] ?? '');
        } else if (userData[key] !== '') {
          formData.append(key, userData[key]);
        }
      });
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await axiosInstance.put(`/update/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data; // expect { user: {...} }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to update profile'
      );
    }
  }
);

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

export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch users'
      );
    }
  }
);

// ---------- Slice ----------
const userSlice = createSlice({
  name: 'user',
  initialState: {
    ...getInitialUserState(),
    users: [],
    usersLoading: false,
    usersError: null,
    total: 0,
    page: 1,
    totalPages: 1,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      clearPersistedUser();
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
      // SIGNUP
      .addCase(signupUser.fulfilled, (state, action) => {
        const normalized = normalizeUser(action.payload.user || {});
        state.user = normalized;
        state.status = 'succeeded';
        persistUser(normalized, state.token); // token may not be returned on signup
      })

      // LOGIN
      .addCase(loginUser.fulfilled, (state, action) => {
        const normalized = normalizeUser(action.payload.user || {});
        state.user = normalized;
        state.token = action.payload.token || null;
        state.status = 'succeeded';
        persistUser(normalized, state.token);
      })

      // GOOGLE OAUTH: URL redirect
      .addCase(googleLogin.fulfilled, (state, action) => {
        window.location.href = action.payload.authUrl;
      })

      // GOOGLE OAUTH: with code
      .addCase(googleLoginWithCode.fulfilled, (state, action) => {
        const normalized = normalizeUser(action.payload.user || {});
        state.user = normalized;
        state.token = action.payload.token || null;
        state.status = 'succeeded';
        persistUser(normalized, state.token);
      })

      // FACEBOOK OAUTH: URL redirect
      .addCase(facebookLogin.fulfilled, (state, action) => {
        window.location.href = action.payload.authUrl;
      })

      // FACEBOOK OAUTH: with code
      .addCase(facebookLoginWithCode.fulfilled, (state, action) => {
        const normalized = normalizeUser(action.payload.user || {});
        state.user = normalized;
        state.token = action.payload.token || null;
        state.status = 'succeeded';
        persistUser(normalized, state.token);
      })

      // OTP / PASSWORD
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

      // UPDATE PROFILE
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const merged = normalizeUser({ ...(state.user || {}), ...(action.payload.user || {}) });
        state.user = merged;
        state.status = 'succeeded';
        persistUser(merged, state.token);
      })

      // ADMIN ACTIONS
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

      // USERS LIST
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users || [];
        state.usersError = null;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload || 'Failed to fetch users';
      })

      // GLOBAL PENDING/REJECTED
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.status = 'loading';
          if (action.type.includes('googleLogin')) state.googleLoading = true;
          else if (action.type.includes('facebookLogin')) state.facebookLoading = true;
          else if (
            action.type.includes('sendOtp') ||
            action.type.includes('verifyOtp') ||
            action.type.includes('resetPassword')
          ) {
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
          state.error = action.payload?.message || action.error?.message || 'Request failed';
        }
      );
  },
});

export const { logout, resetUserStatus } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserId = (state) => state.user.user?.id || null; // convenience
export default userSlice.reducer;
