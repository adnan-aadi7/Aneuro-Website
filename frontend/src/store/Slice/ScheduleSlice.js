import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunks
export const fetchAllScheduled = createAsyncThunk(
  'schedule/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/schedule');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch scheduled content' });
    }
  }
);

export const fetchScheduledStats = createAsyncThunk(
  'schedule/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/schedule/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch scheduled stats' });
    }
  }
);

export const scheduleContent = createAsyncThunk(
  'schedule/scheduleContent',
  async (payload, { rejectWithValue }) => {
    try {
      // Map frontend payload to backend expectations
      const backendPayload = {
        id: payload.contentId, // Map contentId to id
        modelType: payload.modelType,
        scheduledDate: payload.scheduledDate,
        scheduledTime: payload.scheduledTime,
        tier: payload.tier // Include tier if needed by backend
      };
      
      const response = await axios.post('/schedule', backendPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to schedule content' });
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedule/updateSchedule',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.put('/schedule', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update schedule' });
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedule/deleteSchedule',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/schedule', { data: payload });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete scheduled content' });
    }
  }
);

// Initial state
const initialState = {
  scheduled: [],
  stats: {
    // Stats from getAllScheduled endpoint
    totalPending: 0,
    totalPrompts: 0,
    totalEmails: 0,
    totalFunnels: 0,
    thisWeekReleases: 0,
    nextRelease: null,
    // Stats from getScheduledStats endpoint
    upcoming: 0,
    thisWeek: 0,
    thisMonth: 0,
    overdue: 0
  },
  loading: false,
  error: null,
  success: null
};

// Slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch All Scheduled
    builder
      .addCase(fetchAllScheduled.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllScheduled.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduled = action.payload.data;
        // Update stats from getAllScheduled response
        state.stats = {
          ...state.stats,
          ...action.payload.stats
        };
        state.success = 'Fetched scheduled content successfully';
      })
      .addCase(fetchAllScheduled.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch scheduled content';
      });

    // Fetch Scheduled Stats
    builder
      .addCase(fetchScheduledStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduledStats.fulfilled, (state, action) => {
        state.loading = false;
        // Update stats from getScheduledStats response
        state.stats = {
          ...state.stats,
          ...action.payload.stats
        };
        state.success = 'Fetched scheduled stats successfully';
      })
      .addCase(fetchScheduledStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch scheduled stats';
      });

    // Schedule Content
    builder
      .addCase(scheduleContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleContent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Note: The component should dispatch fetchAllScheduled after successful scheduling
        // to refresh the scheduled content list
      })
      .addCase(scheduleContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to schedule content';
      });

    // Update Schedule
    builder
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update schedule';
      });

    // Delete Schedule
    builder
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete scheduled content';
      });
  }
});

// Export actions
export const { clearError, clearSuccess } = scheduleSlice.actions;

// Export selectors
export const selectScheduled = (state) => state.schedule.scheduled;
export const selectScheduleStats = (state) => state.schedule.stats;
export const selectScheduleLoading = (state) => state.schedule.loading;
export const selectScheduleError = (state) => state.schedule.error;
export const selectScheduleSuccess = (state) => state.schedule.success;

// Filtered selectors
export const selectScheduledByType = (state, type) =>
  state.schedule.scheduled.filter(item => item.type === type);

export const selectScheduledByStatus = (state, status) =>
  state.schedule.scheduled.filter(item => item.status === status);

export const selectScheduledByDateRange = (state, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return state.schedule.scheduled.filter(item => {
    const itemDate = new Date(item.scheduledDate);
    return itemDate >= start && itemDate <= end;
  });
};

export const selectNextRelease = (state) => state.schedule.stats.nextRelease;

// Export reducer
export default scheduleSlice.reducer;
