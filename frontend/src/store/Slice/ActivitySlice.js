import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunk
export const fetchRecentActivities = createAsyncThunk(
  'activities/fetchRecent',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching activities from:', '/activities/recent');
      const response = await axios.get('/activities/recent');
      console.log('Activities response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      console.error('Error response:', error.response);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch recent activities' });
    }
  }
);

// Initial state
const initialState = {
  activities: [],
  loading: false,
  error: null,
  success: null
};

// Slice
const activitySlice = createSlice({
  name: 'activities',
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
    builder
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities;
        state.success = 'Fetched recent activities successfully';
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch recent activities';
      });
  }
});

// Export actions
export const { clearError, clearSuccess } = activitySlice.actions;

// Export selectors
export const selectActivities = (state) => state.activities.activities;
export const selectActivitiesLoading = (state) => state.activities.loading;
export const selectActivitiesError = (state) => state.activities.error;
export const selectActivitiesSuccess = (state) => state.activities.success;

// Filtered selectors
export const selectActivitiesByType = (state, type) =>
  state.activities.activities.filter(activity => activity.type === type);

export const selectRecentScheduledActivities = (state) =>
  state.activities.activities.filter(activity => activity.status === 'Scheduled');

export const selectRecentNewActivities = (state) =>
  state.activities.activities.filter(activity => activity.status === 'New');

export const selectActivitiesByDateRange = (state, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return state.activities.activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= start && activityDate <= end;
  });
};

// Export reducer
export default activitySlice.reducer;
