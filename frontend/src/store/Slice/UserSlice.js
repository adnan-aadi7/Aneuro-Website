import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'user/signupUser',
  async (userData) => {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Signup failed');
    return await response.json();
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData) => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
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

export const { logout } = userSlice.actions;
export default userSlice.reducer;
