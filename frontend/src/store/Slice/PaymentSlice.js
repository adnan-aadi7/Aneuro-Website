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

// Async thunk to fetch current user's subscription
export const fetchUserSubscription = createAsyncThunk(
  'payment/fetchUserSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }
      const response = await axiosInstance.get(`/payment/user-subscription/${userId}`);
      return response.data; // { user: { subscription: {...} } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch user subscription'
      );
    }
  }
);

// Async thunk to fetch user payments
export const fetchUserPayments = createAsyncThunk(
  'payment/fetchUserPayments',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await axiosInstance.get(`/payment/user-payments/${userId}`);
      return response.data; // { payments: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch user payments'
      );
    }
  }
);

// Async thunk to fetch user card information
export const fetchUserCardInfo = createAsyncThunk(
  'payment/fetchUserCardInfo',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await axiosInstance.get(`/payment/user-card-info/${userId}`);
      return response.data; // { user, subscription, cards, customer, hasCards }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch user card info'
      );
    }
  }
);

// Async thunk to fetch user payment methods (all types)
export const fetchUserPaymentMethods = createAsyncThunk(
  'payment/fetchUserPaymentMethods',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await axiosInstance.get(`/payment/user-payment-methods/${userId}`);
      return response.data; // { user, customer, paymentMethods, defaultPaymentMethod, totalPaymentMethods }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch user payment methods'
      );
    }
  }
);

// Async thunk to upgrade a subscription (calls your backend)
export const upgradeSubscription = createAsyncThunk(
  'payment/upgradeSubscription',
  async ({ userId, newPlan }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/payment/upgrade-subscription', {
        userId,
        newPlan,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Upgrade failed'
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
    userSubscription: null,
    userSubscriptionLoading: false,
    userSubscriptionError: null,
    userPayments: [],
    userPaymentsLoading: false,
    userPaymentsError: null,
    userCardInfo: null,
    userCardInfoLoading: false,
    userCardInfoError: null,
    userPaymentMethods: null,
    userPaymentMethodsLoading: false,
    userPaymentMethodsError: null,
  },
  reducers: {
    clearPaymentState: (state) => {
      state.subscriptionId = null;
      state.status = 'idle';
      state.error = null;
    },
    clearCardInfo: (state) => {
      state.userCardInfo = null;
      state.userCardInfoError = null;
    },
    clearPaymentMethods: (state) => {
      state.userPaymentMethods = null;
      state.userPaymentMethodsError = null;
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
      })
      .addCase(fetchUserSubscription.pending, (state) => {
        state.userSubscriptionLoading = true;
        state.userSubscriptionError = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.userSubscriptionLoading = false;
        state.userSubscription = action.payload.user.subscription;
        state.userSubscriptionError = null;
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.userSubscriptionLoading = false;
        state.userSubscriptionError = action.payload || 'Failed to fetch user subscription';
      })
      .addCase(fetchUserPayments.pending, (state) => {
        state.userPaymentsLoading = true;
        state.userPaymentsError = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.userPaymentsLoading = false;
        state.userPayments = action.payload.payments;
        state.userPaymentsError = null;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.userPaymentsLoading = false;
        state.userPaymentsError = action.payload || 'Failed to fetch user payments';
      })
      .addCase(fetchUserCardInfo.pending, (state) => {
        state.userCardInfoLoading = true;
        state.userCardInfoError = null;
      })
      .addCase(fetchUserCardInfo.fulfilled, (state, action) => {
        state.userCardInfoLoading = false;
        state.userCardInfo = action.payload;
        state.userCardInfoError = null;
      })
      .addCase(fetchUserCardInfo.rejected, (state, action) => {
        state.userCardInfoLoading = false;
        state.userCardInfoError = action.payload || 'Failed to fetch user card info';
      })
      .addCase(fetchUserPaymentMethods.pending, (state) => {
        state.userPaymentMethodsLoading = true;
        state.userPaymentMethodsError = null;
      })
      .addCase(fetchUserPaymentMethods.fulfilled, (state, action) => {
        state.userPaymentMethodsLoading = false;
        state.userPaymentMethods = action.payload;
        state.userPaymentMethodsError = null;
      })
      .addCase(fetchUserPaymentMethods.rejected, (state, action) => {
        state.userPaymentMethodsLoading = false;
        state.userPaymentMethodsError = action.payload || 'Failed to fetch user payment methods';
      })
      .addCase(upgradeSubscription.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(upgradeSubscription.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Upgrade failed';
      });
  },
});

export const { clearPaymentState, clearCardInfo, clearPaymentMethods } = paymentSlice.actions;
export default paymentSlice.reducer;
