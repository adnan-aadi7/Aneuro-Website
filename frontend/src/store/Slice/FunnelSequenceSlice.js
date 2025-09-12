import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

/** Categories (like Email Sequences' categories) */
export const fetchFunnelCategories = createAsyncThunk(
  'funnelTemplate/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // If your axiosInstance already has baseURL: '/api', change to '/categories/funnel-templates'
      const res = await axios.get('/categories/funnel-templates');
      return res.data; // { success: true, data: ["Marketing","Sales","Education"] }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch funnel categories' });
    }
  }
);

/** CRUD + list with filters (brainType from tabs, category from dropdown) */
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

export const createFunnelTemplateWithFile = createAsyncThunk(
  'funnelTemplate/createWithFile',
  async (payload, { rejectWithValue }) => {
    try {
      // Support both: direct FormData or plain object { file, name, category, tier, status, releaseDateTime? }
      let formData;
      if (payload instanceof FormData) {
        formData = payload;
      } else {
        formData = new FormData();
        formData.append('file', payload.file);
        formData.append('name', payload.name);
        formData.append('tier', payload.tier);
        formData.append('status', payload.status);
        formData.append('category', payload.category || '');
        if (payload.releaseDateTime) {
          formData.append('releaseDateTime', payload.releaseDateTime);
        }
      }

      const response = await axios.post('/funnel-templates/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create funnel template with file' });
    }
  }
);

export const fetchFunnelTemplates = createAsyncThunk(
  'funnelTemplate/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qp = new URLSearchParams();
      if (params.page) qp.append('page', params.page);
      if (params.limit) qp.append('limit', params.limit);
      if (params.brainType) qp.append('brainType', params.brainType);
      if (params.category) qp.append('category', params.category);
      if (params.status) qp.append('status', params.status);
      if (params.search) qp.append('search', params.search);
      if (params.sortBy) qp.append('sortBy', params.sortBy);
      if (params.sortOrder) qp.append('sortOrder', params.sortOrder);

      const response = await axios.get(`/funnel-templates?${qp.toString()}`);
      return response.data; // { success, data, pagination?, filters?, sorting? }
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
  categories: [],
  categoriesLoading: false,

  loading: false,
  error: null,
  success: null
};

const funnelTemplateSlice = createSlice({
  name: 'funnelTemplate',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = null; },
    setCurrentTemplate: (state, action) => { state.currentTemplate = action.payload; },
    clearCurrentTemplate: (state) => { state.currentTemplate = null; },
    updateTemplateUsage: (state, action) => {
      const { templateId, usage, conversions } = action.payload;
      const t = state.templates.find(x => x._id === templateId);
      if (t) { t.usage = usage; t.conversions = conversions; }
      if (state.currentTemplate?._id === templateId) {
        state.currentTemplate.usage = usage;
        state.currentTemplate.conversions = conversions;
      }
    },
    updateTemplateRating: (state, action) => {
      const { templateId, rating } = action.payload;
      const t = state.templates.find(x => x._id === templateId);
      if (t) t.userRating = rating;
      if (state.currentTemplate?._id === templateId) state.currentTemplate.userRating = rating;
    }
  },
  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchFunnelCategories.pending, (state) => { state.categoriesLoading = true; })
      .addCase(fetchFunnelCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload?.data || [];
      })
      .addCase(fetchFunnelCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload?.message || 'Failed to fetch funnel categories';
      });

    // Create
    builder
      .addCase(createFunnelTemplate.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createFunnelTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Funnel template created successfully';
        state.templates.unshift(action.payload.data);
        state.stats.totalTemplates += 1;
      })
      .addCase(createFunnelTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create funnel template';
      });

    // Create with File
    builder
      .addCase(createFunnelTemplateWithFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFunnelTemplateWithFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Funnel template created successfully with file';
        state.templates.unshift(action.payload.data);
        state.stats.totalTemplates += 1;
      })
      .addCase(createFunnelTemplateWithFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create funnel template with file';
      });

    // Fetch All
    builder
      .addCase(fetchFunnelTemplates.pending, (state) => { state.loading = true; state.error = null; })
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
      .addCase(fetchFunnelTemplateById.pending, (state) => { state.loading = true; state.error = null; })
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
      .addCase(updateFunnelTemplate.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateFunnelTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Funnel template updated successfully';
        const index = state.templates.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) state.templates[index] = action.payload.data;
        if (state.currentTemplate?._id === action.payload.data._id) {
          state.currentTemplate = action.payload.data;
        }
      })
      .addCase(updateFunnelTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update funnel template';
      });

    // Delete
    builder
      .addCase(deleteFunnelTemplate.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteFunnelTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Use id from thunk arg to ensure removal even if backend omits deletedId
        const deletedId = action.meta.arg;
        state.templates = state.templates.filter(t => t._id !== deletedId);
        if (state.stats.totalTemplates > 0) state.stats.totalTemplates -= 1;
        if (state.currentTemplate?._id === deletedId) {
          state.currentTemplate = null;
        }
      })
      .addCase(deleteFunnelTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete funnel template';
      });

    // Stats
    builder
      .addCase(fetchFunnelTemplateStats.pending, (state) => { state.loading = true; state.error = null; })
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

export const {
  clearError,
  clearSuccess,
  setCurrentTemplate,
  clearCurrentTemplate,
  updateTemplateUsage,
  updateTemplateRating
} = funnelTemplateSlice.actions;

// Selectors
export const selectFunnelTemplates = (state) => state.funnelTemplate.templates;
export const selectCurrentFunnelTemplate = (state) => state.funnelTemplate.currentTemplate;
export const selectFunnelTemplateStats = (state) => state.funnelTemplate.stats;
export const selectFunnelTemplateLoading = (state) => state.funnelTemplate.loading;
export const selectFunnelTemplateError = (state) => state.funnelTemplate.error;
export const selectFunnelTemplateSuccess = (state) => state.funnelTemplate.success;

export const selectFunnelCategories = (state) => state.funnelTemplate.categories;
export const selectFunnelCategoriesLoading = (state) => state.funnelTemplate.categoriesLoading;

export default funnelTemplateSlice.reducer;
