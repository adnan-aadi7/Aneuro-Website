import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunks
export const createFunnelTemplate = createAsyncThunk(
  'funnelTemplate/create',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/funnel-templates', templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create funnel template' });
    }
  }
);

export const fetchFunnelTemplates = createAsyncThunk(
  'funnelTemplate/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/funnel-templates');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch funnel templates' });
    }
  }
);

export const fetchFunnelTemplateById = createAsyncThunk(
  'funnelTemplate/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/funnel-templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch funnel template' });
    }
  }
);

export const updateFunnelTemplate = createAsyncThunk(
  'funnelTemplate/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/funnel-templates/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update funnel template' });
    }
  }
);

export const deleteFunnelTemplate = createAsyncThunk(
  'funnelTemplate/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/funnel-templates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete funnel template' });
    }
  }
);

export const fetchFunnelTemplateStats = createAsyncThunk(
  'funnelTemplate/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/funnel-templates/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch funnel template stats' });
    }
  }
);

// Initial state
const initialState = {
  templates: [],
  currentTemplate: null,
  stats: {
    totalTemplates: 0,
    totalUsage: 0,
    totalConversions: 0,
    averageUserRating: 0,
    totalActive: 0,
    totalScheduled: 0,
    categoryCounts: {}
  },
  loading: false,
  error: null,
  success: null
};

// Slice
const funnelTemplateSlice = createSlice({
  name: 'funnelTemplate',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    updateTemplateUsage: (state, action) => {
      const { templateId, usage, conversions } = action.payload;
      const template = state.templates.find(t => t._id === templateId);
      if (template) {
        template.usage = usage;
        template.conversions = conversions;
      }
      if (state.currentTemplate && state.currentTemplate._id === templateId) {
        state.currentTemplate.usage = usage;
        state.currentTemplate.conversions = conversions;
      }
    },
    updateTemplateRating: (state, action) => {
      const { templateId, rating } = action.payload;
      const template = state.templates.find(t => t._id === templateId);
      if (template) {
        template.userRating = rating;
      }
      if (state.currentTemplate && state.currentTemplate._id === templateId) {
        state.currentTemplate.userRating = rating;
      }
    }
  },
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createFunnelTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFunnelTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Funnel template created successfully';
        state.templates.unshift(action.payload.data);
        state.stats.totalTemplates += 1;
      })
      .addCase(createFunnelTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create funnel template';
      });

    // Fetch All
    builder
      .addCase(fetchFunnelTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunnelTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data;
      })
      .addCase(fetchFunnelTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch funnel templates';
      });

    // Fetch By ID
    builder
      .addCase(fetchFunnelTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunnelTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload.data;
      })
      .addCase(fetchFunnelTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch funnel template';
      });

    // Update
    builder
      .addCase(updateFunnelTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFunnelTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Funnel template updated successfully';
        const index = state.templates.findIndex(template => template._id === action.payload.data._id);
        if (index !== -1) {
          state.templates[index] = action.payload.data;
        }
        if (state.currentTemplate && state.currentTemplate._id === action.payload.data._id) {
          state.currentTemplate = action.payload.data;
        }
      })
      .addCase(updateFunnelTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update funnel template';
      });

    // Delete
    builder
      .addCase(deleteFunnelTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFunnelTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.templates = state.templates.filter(template => template._id !== action.payload.data.deletedId);
        state.stats.totalTemplates -= 1;
        if (state.currentTemplate && state.currentTemplate._id === action.payload.data.deletedId) {
          state.currentTemplate = null;
        }
      })
      .addCase(deleteFunnelTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete funnel template';
      });

    // Fetch Stats
    builder
      .addCase(fetchFunnelTemplateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunnelTemplateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchFunnelTemplateStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch funnel template stats';
      });
  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setCurrentTemplate,
  clearCurrentTemplate,
  updateTemplateUsage,
  updateTemplateRating
} = funnelTemplateSlice.actions;

// Export selectors
export const selectFunnelTemplates = (state) => state.funnelTemplate.templates;
export const selectCurrentFunnelTemplate = (state) => state.funnelTemplate.currentTemplate;
export const selectFunnelTemplateStats = (state) => state.funnelTemplate.stats;
export const selectFunnelTemplateLoading = (state) => state.funnelTemplate.loading;
export const selectFunnelTemplateError = (state) => state.funnelTemplate.error;
export const selectFunnelTemplateSuccess = (state) => state.funnelTemplate.success;

// Additional selectors for filtering and analysis
export const selectActiveFunnelTemplates = (state) => 
  state.funnelTemplate.templates.filter(template => template.status === 'active');

export const selectScheduledFunnelTemplates = (state) => 
  state.funnelTemplate.templates.filter(template => template.status === 'scheduled');

export const selectFunnelTemplatesByTier = (state, tier) => 
  state.funnelTemplate.templates.filter(template => template.tier === tier);

export const selectFunnelTemplatesByCategory = (state, category) => 
  state.funnelTemplate.templates.filter(template => template.category === category);

export const selectTopRatedFunnelTemplates = (state, limit = 5) => 
  [...state.funnelTemplate.templates]
    .sort((a, b) => (b.userRating || 0) - (a.userRating || 0))
    .slice(0, limit);

export const selectMostUsedFunnelTemplates = (state, limit = 5) => 
  [...state.funnelTemplate.templates]
    .sort((a, b) => (b.usage || 0) - (a.usage || 0))
    .slice(0, limit);

export const selectHighConversionFunnelTemplates = (state, limit = 5) => 
  [...state.funnelTemplate.templates]
    .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
    .slice(0, limit);

// Export reducer
export default funnelTemplateSlice.reducer;
