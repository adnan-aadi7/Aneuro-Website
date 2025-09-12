import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosInstance';

// Async thunks
export const fetchPromptCategories = createAsyncThunk(
  'promptPack/fetchPromptCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/categories/prompts');
      return response.data; // { success, data: ["Category1", ...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch prompt categories' });
    }
  }
);

export const uploadPromptPack = createAsyncThunk(
  'promptPack/upload',
  async (uploadData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Required by backend: file, name, category, tier, status
      formData.append('file', uploadData.file);
      formData.append('name', uploadData.name);
      formData.append('category', uploadData.category);
      formData.append('tier', uploadData.tier);
      formData.append('status', uploadData.status);
      // Optional fields
      if (uploadData.releaseDateTime) {
        formData.append('releaseDateTime', uploadData.releaseDateTime);
      }
      if (uploadData.type) {
        formData.append('type', uploadData.type); // prompt type used when saving first prompt from file
      }

      const response = await axios.post('/prompt-packs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to upload prompt pack' });
    }
  }
);

export const createPromptPack = createAsyncThunk(
  'promptPack/create',
  async (packData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/prompt-packs', packData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create prompt pack' });
    }
  }
);

export const fetchPromptPacks = createAsyncThunk(
  'promptPack/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.tier) queryParams.append('tier', params.tier);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.minUsage) queryParams.append('minUsage', params.minUsage);
      if (params.maxUsage) queryParams.append('maxUsage', params.maxUsage);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await axios.get(`/prompt-packs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch prompt packs' });
    }
  }
);

export const fetchPromptPackById = createAsyncThunk(
  'promptPack/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/prompt-packs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch prompt pack' });
    }
  }
);

export const updatePromptPack = createAsyncThunk(
  'promptPack/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/prompt-packs/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update prompt pack' });
    }
  }
);

export const deletePromptPack = createAsyncThunk(
  'promptPack/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/prompt-packs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete prompt pack' });
    }
  }
);

// Note: No bulk delete or add-prompt endpoints in backend routes; remove related thunks

export const removePromptFromPack = createAsyncThunk(
  'promptPack/removePrompt',
  async ({ id, promptId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/prompt-packs/${id}/prompts/${promptId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove prompt from pack' });
    }
  }
);

export const editPromptInPack = createAsyncThunk(
  'promptPack/editPrompt',
  async ({ packId, promptId, update }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/prompt-packs/${packId}/prompts/${promptId}`, update);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to edit prompt' });
    }
  }
);

export const incrementPromptPackUsage = createAsyncThunk(
  'promptPack/incrementUsage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/prompt-packs/${id}/usage`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to increment usage count' });
    }
  }
);

export const fetchPromptPackStats = createAsyncThunk(
  'promptPack/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/prompt-packs/statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch prompt pack stats' });
    }
  }
);

// GET /api/prompt-packs/grouped?tier=&category=
export const fetchGroupedPromptsByTier = createAsyncThunk(
  'promptPack/fetchGroupedByTier',
  async ({ tier, category }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (tier) params.append('tier', tier);
      if (category) params.append('category', category);
      const response = await axios.get(`/prompt-packs/grouped?${params.toString()}`);
      return response.data; // { success, data: { Architect:[], Challenger:[], ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch grouped prompts' });
    }
  }
);

// Initial state
const initialState = {
  packs: [],
  currentPack: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  stats: {
    overall: {
      totalPacks: 0,
      totalUsage: 0,
      avgUsage: 0,
      maxUsage: 0,
      minUsage: 0,
      avgRating: 0
    },
    byCategory: [],
    byTier: [],
    status: {
      active: {
        totalPacks: 0,
        totalPrompts: 0,
        avgRating: 0
      },
      scheduled: {
        totalPacks: 0,
        totalPrompts: 0,
        avgRating: 0
      }
    },
    grouped: undefined
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
    category: '',
    tier: '',
    status: '',
    search: '',
    minUsage: '',
    maxUsage: ''
  },
  sorting: {
    sortBy: 'createdDate',
    sortOrder: 'desc'
  },
  loading: false,
  error: null,
  success: null
};

// Slice
const promptPackSlice = createSlice({
  name: 'promptPack',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentPack: (state, action) => {
      state.currentPack = action.payload;
    },
    clearCurrentPack: (state) => {
      state.currentPack = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateSorting: (state, action) => {
      state.sorting = { ...state.sorting, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: '',
        tier: '',
        status: '',
        search: '',
        minUsage: '',
        maxUsage: ''
      };
      state.sorting = {
        sortBy: 'createdDate',
        sortOrder: 'desc'
      };
    },
    updatePackUsage: (state, action) => {
      const { packId, usageCount } = action.payload;
      const pack = state.packs.find(p => p._id === packId);
      if (pack) {
        pack.usageCount = usageCount;
      }
      if (state.currentPack && state.currentPack._id === packId) {
        state.currentPack.usageCount = usageCount;
      }
    }
  },
  extraReducers: (builder) => {
    // Prompt categories
    builder
      .addCase(fetchPromptCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchPromptCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        const payload = action.payload;
        const raw = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        state.categories = raw.map((item) => typeof item === 'string' ? item : (item?.name || ''))
                              .filter(Boolean);
      })
      .addCase(fetchPromptCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload?.message || 'Failed to fetch prompt categories';
      });

    // Upload
    builder
      .addCase(uploadPromptPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPromptPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.packs.unshift(action.payload.data);
        state.stats.overall.totalPacks += 1;
      })
      .addCase(uploadPromptPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upload prompt pack';
      });

    // Create
    builder
      .addCase(createPromptPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPromptPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.packs.unshift(action.payload.data);
        state.stats.overall.totalPacks += 1;
      })
      .addCase(createPromptPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create prompt pack';
      });

    // Fetch All
    builder
      .addCase(fetchPromptPacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromptPacks.fulfilled, (state, action) => {
        state.loading = false;
        state.packs = action.payload.data;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters;
        state.sorting = action.payload.sorting;
      })
      .addCase(fetchPromptPacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch prompt packs';
      });

    // Fetch By ID
    builder
      .addCase(fetchPromptPackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromptPackById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPack = action.payload.data;
      })
      .addCase(fetchPromptPackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch prompt pack';
      });

    // Update
    builder
      .addCase(updatePromptPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePromptPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.packs.findIndex(pack => pack._id === action.payload.data._id);
        if (index !== -1) {
          state.packs[index] = action.payload.data;
        }
        if (state.currentPack && state.currentPack._id === action.payload.data._id) {
          state.currentPack = action.payload.data;
        }
      })
      .addCase(updatePromptPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update prompt pack';
      });

    // Delete
    builder
      .addCase(deletePromptPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePromptPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.packs = state.packs.filter(pack => pack._id !== action.payload.data.deletedId);
        state.stats.overall.totalPacks -= 1;
        if (state.currentPack && state.currentPack._id === action.payload.data.deletedId) {
          state.currentPack = null;
        }
      })
      .addCase(deletePromptPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete prompt pack';
      });

    // No bulk delete or add prompt cases (not supported by backend)

    // Remove Prompt
    builder
      .addCase(removePromptFromPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePromptFromPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.packs.findIndex(pack => pack._id === action.payload.data._id);
        if (index !== -1) {
          state.packs[index] = action.payload.data;
        }
        if (state.currentPack && state.currentPack._id === action.payload.data._id) {
          state.currentPack = action.payload.data;
        }
      })
      .addCase(removePromptFromPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove prompt from pack';
      });

    // Edit Prompt
    builder
      .addCase(editPromptInPack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPromptInPack.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.packs.findIndex(pack => pack._id === action.payload.data._id);
        if (index !== -1) {
          state.packs[index] = action.payload.data;
        }
        if (state.currentPack && state.currentPack._id === action.payload.data._id) {
          state.currentPack = action.payload.data;
        }
      })
      .addCase(editPromptInPack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to edit prompt';
      });

    // Increment Usage
    builder
      .addCase(incrementPromptPackUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementPromptPackUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.packs.findIndex(pack => pack._id === action.payload.data._id);
        if (index !== -1) {
          state.packs[index] = action.payload.data;
        }
        if (state.currentPack && state.currentPack._id === action.payload.data._id) {
          state.currentPack = action.payload.data;
        }
      })
      .addCase(incrementPromptPackUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to increment usage count';
      });

    // Fetch Stats
    builder
      .addCase(fetchPromptPackStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromptPackStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchPromptPackStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch prompt pack stats';
      });

    // Fetch Grouped By Tier
    builder
      .addCase(fetchGroupedPromptsByTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupedPromptsByTier.fulfilled, (state, action) => {
        state.loading = false;
        state.stats.grouped = action.payload.data; // Architect/Challenger/... arrays
      })
      .addCase(fetchGroupedPromptsByTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch grouped prompts';
      });

  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setCurrentPack,
  clearCurrentPack,
  updateFilters,
  updateSorting,
  resetFilters,
  updatePackUsage
} = promptPackSlice.actions;

// Export selectors
export const selectPromptPacks = (state) => state.promptPack.packs;
export const selectCurrentPromptPack = (state) => state.promptPack.currentPack;
export const selectPromptPackStats = (state) => state.promptPack.stats;
export const selectPromptPackPagination = (state) => state.promptPack.pagination;
export const selectPromptPackFilters = (state) => state.promptPack.filters;
export const selectPromptPackSorting = (state) => state.promptPack.sorting;
export const selectPromptPackLoading = (state) => state.promptPack.loading;
export const selectPromptPackError = (state) => state.promptPack.error;
export const selectPromptPackSuccess = (state) => state.promptPack.success;
export const selectPromptCategories = (state) => state.promptPack.categories;


// Additional selectors for filtering and analysis
export const selectActivePromptPacks = (state) =>
  state.promptPack.packs.filter(pack => pack.status === 'active');

export const selectScheduledPromptPacks = (state) =>
  state.promptPack.packs.filter(pack => pack.status === 'scheduled');

export const selectPromptPacksByTier = (state, tier) =>
  state.promptPack.packs.filter(pack => pack.tier === tier);

export const selectPromptPacksByCategory = (state, category) =>
  state.promptPack.packs.filter(pack => pack.category === category);

export const selectPromptPacksByType = (state, type) =>
  state.promptPack.packs.filter(pack =>
    pack.prompts.some(prompt => prompt.type === type)
  );

export const selectMostUsedPromptPacks = (state, limit = 5) =>
  [...state.promptPack.packs]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);

export const selectPromptPacksWithMostPrompts = (state, limit = 5) =>
  [...state.promptPack.packs]
    .sort((a, b) => (b.prompts?.length || 0) - (a.prompts?.length || 0))
    .slice(0, limit);

export const selectPromptPacksByUsageRange = (state, minUsage, maxUsage) =>
  state.promptPack.packs.filter(pack => {
    const usage = pack.usageCount || 0;
    return usage >= minUsage && usage <= maxUsage;
  });

// Export reducer
export default promptPackSlice.reducer;
