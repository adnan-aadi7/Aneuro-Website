import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Thunks
export const fetchNewSubscribersPerWeek = createAsyncThunk(
  'adminDashboard/fetchNewSubscribersPerWeek',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/subscribers/new-per-week');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch new subscribers per week' });
    }
  }
);

export const fetchDelinquentSubscribers = createAsyncThunk(
  'adminDashboard/fetchDelinquentSubscribers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/subscribers/delinquent');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch delinquent subscribers' });
    }
  }
);

export const fetchAvgQuizCompletionTime = createAsyncThunk(
  'adminDashboard/fetchAvgQuizCompletionTime',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/avg-completion-time');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch average quiz completion time' });
    }
  }
);

export const fetchUserAudienceStats = createAsyncThunk(
  'adminDashboard/fetchUserAudienceStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user-analytics/user/${userId}/audience-stats`);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue({ userId, error: error.response?.data || { message: 'Failed to fetch user audience stats' } });
    }
  }
);

export const fetchTotalRevenue = createAsyncThunk(
  'adminDashboard/fetchTotalRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/total-revenue');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch total revenue' });
    }
  }
);

export const fetchStripeBalance = createAsyncThunk(
  'adminDashboard/fetchStripeBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/stripe-balance');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch Stripe balance' });
    }
  }
);

export const fetchInboxLatest = createAsyncThunk(
  'adminDashboard/fetchInboxLatest',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user-analytics/inbox/latest?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch inbox messages' });
    }
  }
);

export const fetchRecentFeedback = createAsyncThunk(
  'adminDashboard/fetchRecentFeedback',
  async (limit = 3, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/ticket/feedback?page=1&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch recent feedback' });
    }
  }
);

// New thunks for dynamic analytics
export const fetchDashboardAnalytics = createAsyncThunk(
  'adminDashboard/fetchDashboardAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch dashboard analytics' });
    }
  }
);

export const fetchNewSubscribersAnalytics = createAsyncThunk(
  'adminDashboard/fetchNewSubscribersAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/new-subscribers-analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch new subscribers analytics' });
    }
  }
);

export const fetchDelinquentSubscribersAnalytics = createAsyncThunk(
  'adminDashboard/fetchDelinquentSubscribersAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/delinquent-subscribers-analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch delinquent subscribers analytics' });
    }
  }
);

export const fetchAvgQuizCompletionTimeAnalytics = createAsyncThunk(
  'adminDashboard/fetchAvgQuizCompletionTimeAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/avg-completion-time-analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch average quiz completion time analytics' });
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'adminDashboard/fetchRevenueAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/revenue-analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch revenue analytics' });
    }
  }
);

const initialState = {
  newSubscribersPerWeek: [],
  delinquentSubscribers: [],
  avgCompletionTime: null,
  userAudienceStatsByUserId: {},
  totalRevenueDollars: 0,
  stripeBalance: {
    available: null,
    pending: null,
  },
  inboxMessages: [],
  recentFeedback: [],
  // New state for dynamic analytics
  dashboardAnalytics: {
    newSubscribers: null,
    delinquentSubscribers: null,
    avgQuizCompletionTime: null,
    revenue: null,
  },
  loading: {
    newSubscribers: false,
    delinquent: false,
    avgTime: false,
    audience: {},
    revenue: false,
    balance: false,
    inbox: false,
    feedback: false,
    // New loading states
    dashboardAnalytics: false,
    newSubscribersAnalytics: false,
    delinquentAnalytics: false,
    avgTimeAnalytics: false,
    revenueAnalytics: false,
  },
  error: {
    newSubscribers: null,
    delinquent: null,
    avgTime: null,
    audience: {},
    revenue: null,
    balance: null,
    inbox: null,
    feedback: null,
    // New error states
    dashboardAnalytics: null,
    newSubscribersAnalytics: null,
    delinquentAnalytics: null,
    avgTimeAnalytics: null,
    revenueAnalytics: null,
  },
  success: {
    newSubscribers: null,
    delinquent: null,
    avgTime: null,
    audience: {},
    revenue: null,
    balance: null,
    inbox: null,
    feedback: null,
    // New success states
    dashboardAnalytics: null,
    newSubscribersAnalytics: null,
    delinquentAnalytics: null,
    avgTimeAnalytics: null,
    revenueAnalytics: null,
  },
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearAdminDashboardErrors(state) {
      state.error.newSubscribers = null;
      state.error.delinquent = null;
      state.error.avgTime = null;
      state.error.audience = {};
      state.error.revenue = null;
      state.error.balance = null;
      state.error.inbox = null;
      state.error.feedback = null;
    },
    clearAdminDashboardSuccess(state) {
      state.success.newSubscribers = null;
      state.success.delinquent = null;
      state.success.avgTime = null;
      state.success.audience = {};
      state.success.revenue = null;
      state.success.balance = null;
      state.success.inbox = null;
      state.success.feedback = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewSubscribersPerWeek.pending, (state) => {
        state.loading.newSubscribers = true;
        state.error.newSubscribers = null;
      })
      .addCase(fetchNewSubscribersPerWeek.fulfilled, (state, action) => {
        state.loading.newSubscribers = false;
        state.newSubscribersPerWeek = action.payload?.data || [];
        state.success.newSubscribers = 'Fetched new subscribers per week';
      })
      .addCase(fetchNewSubscribersPerWeek.rejected, (state, action) => {
        state.loading.newSubscribers = false;
        state.error.newSubscribers = action.payload?.message || 'Failed to fetch new subscribers per week';
      })

      .addCase(fetchDelinquentSubscribers.pending, (state) => {
        state.loading.delinquent = true;
        state.error.delinquent = null;
      })
      .addCase(fetchDelinquentSubscribers.fulfilled, (state, action) => {
        state.loading.delinquent = false;
        state.delinquentSubscribers = action.payload?.data || [];
        state.success.delinquent = 'Fetched delinquent subscribers';
      })
      .addCase(fetchDelinquentSubscribers.rejected, (state, action) => {
        state.loading.delinquent = false;
        state.error.delinquent = action.payload?.message || 'Failed to fetch delinquent subscribers';
      })

      .addCase(fetchAvgQuizCompletionTime.pending, (state) => {
        state.loading.avgTime = true;
        state.error.avgTime = null;
      })
      .addCase(fetchAvgQuizCompletionTime.fulfilled, (state, action) => {
        state.loading.avgTime = false;
        state.avgCompletionTime = action.payload?.avgTime ?? null;
        state.success.avgTime = 'Fetched average quiz completion time';
      })
      .addCase(fetchAvgQuizCompletionTime.rejected, (state, action) => {
        state.loading.avgTime = false;
        state.error.avgTime = action.payload?.message || 'Failed to fetch average quiz completion time';
      })

      .addCase(fetchUserAudienceStats.pending, (state, action) => {
        const userId = action.meta.arg;
        state.loading.audience[userId] = true;
        state.error.audience[userId] = null;
      })
      .addCase(fetchUserAudienceStats.fulfilled, (state, action) => {
        const { userId, data } = action.payload;
        state.loading.audience[userId] = false;
        state.userAudienceStatsByUserId[userId] = data?.stats || data || null;
        state.success.audience[userId] = 'Fetched user audience stats';
      })
      .addCase(fetchUserAudienceStats.rejected, (state, action) => {
        const userId = action.payload?.userId || action.meta.arg;
        state.loading.audience[userId] = false;
        state.error.audience[userId] = action.payload?.error?.message || 'Failed to fetch user audience stats';
      })

      .addCase(fetchTotalRevenue.pending, (state) => {
        state.loading.revenue = true;
        state.error.revenue = null;
      })
      .addCase(fetchTotalRevenue.fulfilled, (state, action) => {
        state.loading.revenue = false;
        state.totalRevenueDollars = action.payload?.totalDollars ?? 0;
        state.success.revenue = 'Fetched total revenue';
      })
      .addCase(fetchTotalRevenue.rejected, (state, action) => {
        state.loading.revenue = false;
        state.error.revenue = action.payload?.message || 'Failed to fetch total revenue';
      })

      .addCase(fetchStripeBalance.pending, (state) => {
        state.loading.balance = true;
        state.error.balance = null;
      })
      .addCase(fetchStripeBalance.fulfilled, (state, action) => {
        state.loading.balance = false;
        state.stripeBalance.available = action.payload?.available || null;
        state.stripeBalance.pending = action.payload?.pending || null;
        state.success.balance = 'Fetched Stripe balance';
      })
      .addCase(fetchStripeBalance.rejected, (state, action) => {
        state.loading.balance = false;
        state.error.balance = action.payload?.message || 'Failed to fetch Stripe balance';
      })

      .addCase(fetchInboxLatest.pending, (state) => {
        state.loading.inbox = true;
        state.error.inbox = null;
      })
      .addCase(fetchInboxLatest.fulfilled, (state, action) => {
        state.loading.inbox = false;
        state.inboxMessages = action.payload?.messages || [];
        state.success.inbox = 'Fetched inbox messages';
      })
      .addCase(fetchInboxLatest.rejected, (state, action) => {
        state.loading.inbox = false;
        state.error.inbox = action.payload?.message || 'Failed to fetch inbox messages';
      })

      .addCase(fetchRecentFeedback.pending, (state) => {
        state.loading.feedback = true;
        state.error.feedback = null;
      })
      .addCase(fetchRecentFeedback.fulfilled, (state, action) => {
        state.loading.feedback = false;
        state.recentFeedback = action.payload?.tickets || [];
        state.success.feedback = 'Fetched recent feedback';
      })
      .addCase(fetchRecentFeedback.rejected, (state, action) => {
        state.loading.feedback = false;
        state.error.feedback = action.payload?.message || 'Failed to fetch recent feedback';
      })

      // New dynamic analytics reducers
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading.dashboardAnalytics = true;
        state.error.dashboardAnalytics = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading.dashboardAnalytics = false;
        state.dashboardAnalytics = action.payload?.data || {};
        state.success.dashboardAnalytics = 'Fetched dashboard analytics';
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading.dashboardAnalytics = false;
        state.error.dashboardAnalytics = action.payload?.message || 'Failed to fetch dashboard analytics';
      })

      .addCase(fetchNewSubscribersAnalytics.pending, (state) => {
        state.loading.newSubscribersAnalytics = true;
        state.error.newSubscribersAnalytics = null;
      })
      .addCase(fetchNewSubscribersAnalytics.fulfilled, (state, action) => {
        state.loading.newSubscribersAnalytics = false;
        state.dashboardAnalytics.newSubscribers = action.payload?.data || null;
        state.success.newSubscribersAnalytics = 'Fetched new subscribers analytics';
      })
      .addCase(fetchNewSubscribersAnalytics.rejected, (state, action) => {
        state.loading.newSubscribersAnalytics = false;
        state.error.newSubscribersAnalytics = action.payload?.message || 'Failed to fetch new subscribers analytics';
      })

      .addCase(fetchDelinquentSubscribersAnalytics.pending, (state) => {
        state.loading.delinquentAnalytics = true;
        state.error.delinquentAnalytics = null;
      })
      .addCase(fetchDelinquentSubscribersAnalytics.fulfilled, (state, action) => {
        state.loading.delinquentAnalytics = false;
        state.dashboardAnalytics.delinquentSubscribers = action.payload?.data || null;
        state.success.delinquentAnalytics = 'Fetched delinquent subscribers analytics';
      })
      .addCase(fetchDelinquentSubscribersAnalytics.rejected, (state, action) => {
        state.loading.delinquentAnalytics = false;
        state.error.delinquentAnalytics = action.payload?.message || 'Failed to fetch delinquent subscribers analytics';
      })

      .addCase(fetchAvgQuizCompletionTimeAnalytics.pending, (state) => {
        state.loading.avgTimeAnalytics = true;
        state.error.avgTimeAnalytics = null;
      })
      .addCase(fetchAvgQuizCompletionTimeAnalytics.fulfilled, (state, action) => {
        state.loading.avgTimeAnalytics = false;
        state.dashboardAnalytics.avgQuizCompletionTime = action.payload?.data || null;
        state.success.avgTimeAnalytics = 'Fetched average quiz completion time analytics';
      })
      .addCase(fetchAvgQuizCompletionTimeAnalytics.rejected, (state, action) => {
        state.loading.avgTimeAnalytics = false;
        state.error.avgTimeAnalytics = action.payload?.message || 'Failed to fetch average quiz completion time analytics';
      })

      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.loading.revenueAnalytics = true;
        state.error.revenueAnalytics = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.loading.revenueAnalytics = false;
        state.dashboardAnalytics.revenue = action.payload?.data || null;
        state.success.revenueAnalytics = 'Fetched revenue analytics';
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.loading.revenueAnalytics = false;
        state.error.revenueAnalytics = action.payload?.message || 'Failed to fetch revenue analytics';
      });
  }
});

export const { clearAdminDashboardErrors, clearAdminDashboardSuccess } = adminDashboardSlice.actions;

// Selectors
export const selectNewSubscribersPerWeek = (state) => state.adminDashboard.newSubscribersPerWeek;
export const selectDelinquentSubscribers = (state) => state.adminDashboard.delinquentSubscribers;
export const selectAvgQuizCompletionTime = (state) => state.adminDashboard.avgCompletionTime;
export const selectUserAudienceStatsByUserId = (state, userId) => state.adminDashboard.userAudienceStatsByUserId[userId] || null;
export const selectTotalRevenueDollars = (state) => state.adminDashboard.totalRevenueDollars;
export const selectStripeBalance = (state) => state.adminDashboard.stripeBalance;
export const selectInboxMessages = (state) => state.adminDashboard.inboxMessages;
export const selectRecentFeedback = (state) => state.adminDashboard.recentFeedback;

export const selectAdminDashboardLoading = (state) => state.adminDashboard.loading;
export const selectAdminDashboardError = (state) => state.adminDashboard.error;
export const selectAdminDashboardSuccess = (state) => state.adminDashboard.success;

// New selectors for dynamic analytics
export const selectDashboardAnalytics = (state) => state.adminDashboard.dashboardAnalytics;
export const selectNewSubscribersAnalytics = (state) => state.adminDashboard.dashboardAnalytics.newSubscribers;
export const selectDelinquentSubscribersAnalytics = (state) => state.adminDashboard.dashboardAnalytics.delinquentSubscribers;
export const selectAvgQuizCompletionTimeAnalytics = (state) => state.adminDashboard.dashboardAnalytics.avgQuizCompletionTime;
export const selectRevenueAnalytics = (state) => state.adminDashboard.dashboardAnalytics.revenue;

export default adminDashboardSlice.reducer;
