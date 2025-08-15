// src/store/customizationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// POST /api/customization  (multipart/form-data)
// payload: { userId, logo (File|undefined), primaryColor, secondaryColor, textColor, borderColor }
export const saveCustomization = createAsyncThunk(
  'customization/saveCustomization',
  async (payload, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append('userId', payload.userId);
      form.append('primaryColor', payload.primaryColor);
      form.append('secondaryColor', payload.secondaryColor);
      form.append('textColor', payload.textColor);
      form.append('borderColor', payload.borderColor);
      // only append logo if it's a File
      if (payload.logo instanceof File) {
        form.append('logo', payload.logo);
      }

      const res = await axiosInstance.post('/customization', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data; // { success, data: {...} }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { success: false, message: err.message || 'Customization save failed' }
      );
    }
  }
);

const customizationSlice = createSlice({
  name: 'customization',
  initialState: {
    lastSaved: null,       // server object returned
    saving: false,
    error: null,
  },
  reducers: {
    resetCustomizationState: (state) => {
      state.saving = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveCustomization.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveCustomization.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.lastSaved = action.payload?.data || null;
      })
      .addCase(saveCustomization.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || 'Failed to save customization';
      });
  },
});

export const { resetCustomizationState } = customizationSlice.actions;
export default customizationSlice.reducer;
