import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// Async thunk to create a subscription (calls your backend)
export const createSubscription = createAsyncThunk(
  'payment/createSubscription',
  async ({ plan, paymentMethodId }, { rejectWithValue }) => {
    try {
      // Get user info from localStorage (set by UserSlice)
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('userEmail');
      const response = await axiosInstance.post('/payment/create-subscription', {
        plan,
        userId,
        email,
        paymentMethodId,
      });
      return response.data; // { subscriptionId, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Subscription failed'
      );
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    subscriptionId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearPaymentState: (state) => {
      state.subscriptionId = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscription.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscriptionId = action.payload.subscriptionId;
        state.error = null;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Subscription failed';
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
