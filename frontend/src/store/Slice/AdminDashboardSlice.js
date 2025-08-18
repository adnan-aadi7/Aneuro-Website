import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Thunks
export const fetchNewSubscribersPerWeek = createAsyncThunk(
  'adminDashboard/fetchNewSubscribersPerWeek',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-analytics/subscribers/new-per-week');
      return response.data; // { success, message, data }
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
      return response.data; // { success, message, count, data }
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
      return response.data; // { success, message, avgTime }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch average completion time' });
    }
  }
);

export const fetchUserAudienceStats = createAsyncThunk(
  'adminDashboard/fetchUserAudienceStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user-analytics/user/${userId}/audience-stats`);
      return response.data; // { success, message, stats }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user audience stats' });
    }
  }
);

const initialState = {
  subscribersPerWeek: [],
  delinquentSubscribers: [],
  avgCompletionTime: '',
  userAudienceStats: {
    totalQuizzes: 0,
    completedQuizzes: 0,
    completionRate: '0%',
    brainTypeDistribution: {}
  },
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // New Subscribers Per Week
      .addCase(fetchNewSubscribersPerWeek.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewSubscribersPerWeek.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribersPerWeek = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchNewSubscribersPerWeek.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch new subscribers per week';
      })
      // Delinquent Subscribers
      .addCase(fetchDelinquentSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDelinquentSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.delinquentSubscribers = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchDelinquentSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch delinquent subscribers';
      })
      // Average Quiz Completion Time
      .addCase(fetchAvgQuizCompletionTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvgQuizCompletionTime.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns a string like "X min Y sec"
        state.avgCompletionTime = action.payload?.avgTime ?? '';
      })
      .addCase(fetchAvgQuizCompletionTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch average completion time';
      })
      // User Audience Stats
      .addCase(fetchUserAudienceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAudienceStats.fulfilled, (state, action) => {
        state.loading = false;
        const stats = action.payload?.stats || {};
        state.userAudienceStats = {
          totalQuizzes: stats.totalQuizzes ?? 0,
          completedQuizzes: stats.completedQuizzes ?? 0,
          completionRate: stats.completionRate ?? '0%',
          brainTypeDistribution: stats.brainTypeDistribution ?? {},
        };
      })
      .addCase(fetchUserAudienceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user audience stats';
      });
  }
});

export const { clearError } = adminDashboardSlice.actions;

// Selectors
export const selectNewSubscribersPerWeek = (state) => state.adminDashboard.subscribersPerWeek;
export const selectDelinquentSubscribers = (state) => state.adminDashboard.delinquentSubscribers;
export const selectAvgCompletionTime = (state) => state.adminDashboard.avgCompletionTime;
export const selectUserAudienceStats = (state) => state.adminDashboard.userAudienceStats;
export const selectAdminAnalyticsLoading = (state) => state.adminDashboard.loading;
export const selectAdminAnalyticsError = (state) => state.adminDashboard.error;

export default adminDashboardSlice.reducer;
