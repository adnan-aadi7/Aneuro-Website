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

// Async thunk to fetch Stripe products
export const fetchStripeProducts = createAsyncThunk(
  'payment/fetchStripeProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/payment/stripe-products');
      return response.data; // { plans: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch products'
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
    products: [],
    productsLoading: false,
    productsError: null,
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
      })
      .addCase(fetchStripeProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchStripeProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload.plans;
        state.productsError = null;
      })
      .addCase(fetchStripeProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload || 'Failed to fetch products';
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
