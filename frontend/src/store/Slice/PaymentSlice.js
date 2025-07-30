import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to create a subscription (calls your backend)
export const createSubscription = createAsyncThunk(
  'payment/createSubscription',
  async ({ plan, paymentMethodId }, { rejectWithValue }) => {
    try {
      // Get user info from localStorage (set by UserSlice)
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:3000/api/payment/create-subscription',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId, email, paymentMethodId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Subscription failed');
      return data; // { subscriptionId, message }
    } catch (err) {
      return rejectWithValue(err.message);
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
