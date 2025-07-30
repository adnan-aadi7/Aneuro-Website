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

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
    },
    resetUserStatus: (state) => {
      state.status = 'idle';
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
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => { state.status = 'loading'; }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );
  },
});

export const { logout, resetUserStatus } = userSlice.actions;
export default userSlice.reducer;
