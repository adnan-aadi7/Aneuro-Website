import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunks
export const fetchSystemLogs = createAsyncThunk(
  'systemLogs/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.action) queryParams.append('action', params.action);
      if (params.user) queryParams.append('user', params.user);
      if (params.timeRange) queryParams.append('timeRange', params.timeRange);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await axios.get(`/system-logs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch system logs' });
    }
  }
);

// Initial state
const initialState = {
  logs: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    action: '',
    user: '',
    timeRange: 'all_time',
    search: ''
  },
  loading: false,
  error: null,
  success: null
};

// Slice
const systemLogsSlice = createSlice({
  name: 'systemLogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        action: '',
        user: '',
        timeRange: 'all_time',
        search: ''
      };
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing items per page
    }
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchSystemLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        
        // Calculate pagination
        const totalPages = Math.ceil(action.payload.total / action.payload.limit);
        state.pagination = {
          currentPage: action.payload.page,
          totalPages,
          totalItems: action.payload.total,
          itemsPerPage: action.payload.limit,
          hasNextPage: action.payload.page < totalPages,
          hasPrevPage: action.payload.page > 1
        };
      })
      .addCase(fetchSystemLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch system logs';
      });
  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  updateFilters,
  resetFilters,
  setPage,
  setItemsPerPage
} = systemLogsSlice.actions;

// Export selectors
export const selectSystemLogs = (state) => state.systemLogs.logs;
export const selectSystemLogsPagination = (state) => state.systemLogs.pagination;
export const selectSystemLogsFilters = (state) => state.systemLogs.filters;
export const selectSystemLogsLoading = (state) => state.systemLogs.loading;
export const selectSystemLogsError = (state) => state.systemLogs.error;
export const selectSystemLogsSuccess = (state) => state.systemLogs.success;

// Additional selectors for filtering and analysis
export const selectLogsByAction = (state, action) => 
  state.systemLogs.logs.filter(log => log.action === action);

export const selectLogsByUser = (state, userEmail) => 
  state.systemLogs.logs.filter(log => log.user.email === userEmail);

export const selectLogsByContentType = (state, contentType) => 
  state.systemLogs.logs.filter(log => log.contentType === contentType);

export const selectLogsBySeverity = (state, severity) => 
  state.systemLogs.logs.filter(log => log.severity === severity);

export const selectLogsByTimeRange = (state, hours) => {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  return state.systemLogs.logs.filter(log => new Date(log.timestamp) >= cutoffTime);
};

export const selectRecentLogs = (state, limit = 10) => 
  [...state.systemLogs.logs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);

export const selectLogsByAsset = (state, assetId) => 
  state.systemLogs.logs.filter(log => log.affectedAsset === assetId);

export const selectUserActivityLogs = (state, userId) => 
  state.systemLogs.logs.filter(log => log.user.id === userId);

export const selectLogsByDateRange = (state, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return state.systemLogs.logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= start && logDate <= end;
  });
};

// Analytics selectors
export const selectLogsSummary = (state) => {
  const logs = state.systemLogs.logs;
  return {
    totalLogs: logs.length,
    byAction: logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {}),
    bySeverity: logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {}),
    byContentType: logs.reduce((acc, log) => {
      acc[log.contentType] = (acc[log.contentType] || 0) + 1;
      return acc;
    }, {}),
    uniqueUsers: new Set(logs.map(log => log.user.email)).size,
    timeRange: logs.length > 0 ? {
      earliest: new Date(Math.min(...logs.map(log => new Date(log.timestamp)))),
      latest: new Date(Math.max(...logs.map(log => new Date(log.timestamp))))
    } : null
  };
};

export const selectTopUsers = (state, limit = 5) => {
  const userCounts = state.systemLogs.logs.reduce((acc, log) => {
    acc[log.user.email] = (acc[log.user.email] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(userCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([email, count]) => ({ email, count }));
};

export const selectTopContentTypes = (state, limit = 5) => {
  const contentTypeCounts = state.systemLogs.logs.reduce((acc, log) => {
    acc[log.contentType] = (acc[log.contentType] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(contentTypeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([contentType, count]) => ({ contentType, count }));
};

export const selectLogsByHour = (state) => {
  const hourlyCounts = new Array(24).fill(0);
  
  state.systemLogs.logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    hourlyCounts[hour]++;
  });
  
  return hourlyCounts.map((count, hour) => ({ hour, count }));
};

// Export reducer
export default systemLogsSlice.reducer;
