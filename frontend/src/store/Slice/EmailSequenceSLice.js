import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunks
export const createEmailSequence = createAsyncThunk(
  'emailSequence/create',
  async (sequenceData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', sequenceData.name);
      formData.append('emailCount', sequenceData.emailCount || 0);
      formData.append('emails', sequenceData.emails || 0);
      formData.append('tier', sequenceData.tier);
      formData.append('status', sequenceData.status || 'scheduled');
      formData.append('type', sequenceData.type);
      
      // Add content based on type
      if (sequenceData.type === 'manual') {
        formData.append('manualContent', sequenceData.manualContent);
      } else if (sequenceData.type === 'file' && sequenceData.file) {
        formData.append('file', sequenceData.file);
      }
      
      // Add email template if provided
      if (sequenceData.emailTemplate) {
        formData.append('emailTemplate', JSON.stringify(sequenceData.emailTemplate));
      }
      
      const response = await axios.post('/email-sequences', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create email sequence' });
    }
  }
);

export const fetchEmailSequences = createAsyncThunk(
  'emailSequence/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.tier) queryParams.append('tier', params.tier);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await axios.get(`/email-sequences?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch email sequences' });
    }
  }
);

export const fetchEmailSequenceById = createAsyncThunk(
  'emailSequence/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/email-sequences/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch email sequence' });
    }
  }
);

export const updateEmailSequence = createAsyncThunk(
  'emailSequence/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/email-sequences/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update email sequence' });
    }
  }
);

export const deleteEmailSequence = createAsyncThunk(
  'emailSequence/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/email-sequences/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete email sequence' });
    }
  }
);

export const bulkDeleteEmailSequences = createAsyncThunk(
  'emailSequence/bulkDelete',
  async (ids, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/email-sequences/bulk/delete', {
        data: { ids }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to bulk delete email sequences' });
    }
  }
);

export const fetchEmailSequenceStats = createAsyncThunk(
  'emailSequence/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/email-sequences/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch email sequence stats' });
    }
  }
);

// Initial state
const initialState = {
  sequences: [],
  currentSequence: null,
  stats: {
    totalSequences: 0,
    totalEmails: 0,
    totalOpens: 0,
    totalClicks: 0,
    totalUsage: 0,
    totalActive: 0,
    totalScheduled: 0,
    averageRating: 0,
    categoryCounts: {}
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    tier: '',
    status: '',
    search: ''
  },
  sorting: {
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  loading: false,
  error: null,
  success: null
};

// Slice
const emailSequenceSlice = createSlice({
  name: 'emailSequence',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentSequence: (state, action) => {
      state.currentSequence = action.payload;
    },
    clearCurrentSequence: (state) => {
      state.currentSequence = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateSorting: (state, action) => {
      state.sorting = { ...state.sorting, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        tier: '',
        status: '',
        search: ''
      };
      state.sorting = {
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
    }
  },
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createEmailSequence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmailSequence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.sequences.unshift(action.payload.data);
        state.stats.totalSequences += 1;
      })
      .addCase(createEmailSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create email sequence';
      });

    // Fetch All
    builder
      .addCase(fetchEmailSequences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailSequences.fulfilled, (state, action) => {
        state.loading = false;
        state.sequences = action.payload.data;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters;
        state.sorting = action.payload.sorting;
      })
      .addCase(fetchEmailSequences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch email sequences';
      });

    // Fetch By ID
    builder
      .addCase(fetchEmailSequenceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailSequenceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSequence = action.payload.data;
      })
      .addCase(fetchEmailSequenceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch email sequence';
      });

    // Update
    builder
      .addCase(updateEmailSequence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailSequence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.sequences.findIndex(seq => seq._id === action.payload.data._id);
        if (index !== -1) {
          state.sequences[index] = action.payload.data;
        }
        if (state.currentSequence && state.currentSequence._id === action.payload.data._id) {
          state.currentSequence = action.payload.data;
        }
      })
      .addCase(updateEmailSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update email sequence';
      });

    // Delete
    builder
      .addCase(deleteEmailSequence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmailSequence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.sequences = state.sequences.filter(seq => seq._id !== action.payload.data.deletedId);
        state.stats.totalSequences -= 1;
        if (state.currentSequence && state.currentSequence._id === action.payload.data.deletedId) {
          state.currentSequence = null;
        }
      })
      .addCase(deleteEmailSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete email sequence';
      });

    // Bulk Delete
    builder
      .addCase(bulkDeleteEmailSequences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteEmailSequences.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const deletedIds = action.payload.data.deletedCount;
        state.sequences = state.sequences.filter(seq => !action.payload.data.deletedIds?.includes(seq._id));
        state.stats.totalSequences -= deletedIds;
        if (state.currentSequence && action.payload.data.deletedIds?.includes(state.currentSequence._id)) {
          state.currentSequence = null;
        }
      })
      .addCase(bulkDeleteEmailSequences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to bulk delete email sequences';
      });

    // Fetch Stats
    builder
      .addCase(fetchEmailSequenceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailSequenceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchEmailSequenceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch email sequence stats';
      });
  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setCurrentSequence,
  clearCurrentSequence,
  updateFilters,
  updateSorting,
  resetFilters
} = emailSequenceSlice.actions;

// Export selectors
export const selectEmailSequences = (state) => state.emailSequence.sequences;
export const selectCurrentSequence = (state) => state.emailSequence.currentSequence;
export const selectEmailSequenceStats = (state) => state.emailSequence.stats;
export const selectEmailSequencePagination = (state) => state.emailSequence.pagination;
export const selectEmailSequenceFilters = (state) => state.emailSequence.filters;
export const selectEmailSequenceSorting = (state) => state.emailSequence.sorting;
export const selectEmailSequenceLoading = (state) => state.emailSequence.loading;
export const selectEmailSequenceError = (state) => state.emailSequence.error;
export const selectEmailSequenceSuccess = (state) => state.emailSequence.success;

// Export reducer
export default emailSequenceSlice.reducer;
