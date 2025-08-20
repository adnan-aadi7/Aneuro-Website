import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// Async thunk for creating a ticket
export const createTicket = createAsyncThunk(
  'ticket/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      // Handle file upload if present
      const formData = new FormData();
      formData.append('name', ticketData.name);
      formData.append('email', ticketData.email);
      formData.append('mobileNumber', ticketData.mobileNumber);
      formData.append('category', ticketData.category);
      formData.append('message', ticketData.message);
      
      if (ticketData.file) {
        formData.append('file', ticketData.file);
      }

      const response = await axiosInstance.post('/ticket/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Ticket creation failed'
      );
    }
  }
);

// Async thunk for fetching all tickets
export const getTickets = createAsyncThunk(
  'ticket/getTickets',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.email) {
        params.append('email', filters.email);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }
      const response = await axiosInstance.get(`/ticket?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch tickets'
      );
    }
  }
);

// Async thunk for fetching a single ticket by ID
export const getTicketById = createAsyncThunk(
  'ticket/getTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/ticket/${ticketId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch ticket'
      );
    }
  }
);

// Async thunk for updating a ticket
export const updateTicket = createAsyncThunk(
  'ticket/updateTicket',
  async ({ ticketId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/ticket/${ticketId}`, updateData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update ticket'
      );
    }
  }
);

// Async thunk for updating ticket status
export const updateTicketStatus = createAsyncThunk(
  'ticket/updateTicketStatus',
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/ticket/${ticketId}/status`, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update ticket status'
      );
    }
  }
);

// Async thunk for deleting a ticket
export const deleteTicket = createAsyncThunk(
  'ticket/deleteTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/ticket/${ticketId}`);
      return { ticketId, ...response.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to delete ticket'
      );
    }
  }
);

// Async thunk for adding a reply to a ticket
export const addReplyToTicket = createAsyncThunk(
  'ticket/addReplyToTicket',
  async ({ ticketId, replyData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('message', replyData.message);
      formData.append('repliedBy', replyData.repliedBy || 'admin');
      
      if (replyData.file) {
        formData.append('file', replyData.file);
      }

      const response = await axiosInstance.post(`/ticket/${ticketId}/reply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to add reply'
      );
    }
  }
);

// Async thunk for assigning a ticket
export const assignTicket = createAsyncThunk(
  'ticket/assignTicket',
  async ({ ticketId, assignedTo }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/ticket/${ticketId}/assign`, { assignedTo });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to assign ticket'
      );
    }
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    tickets: [],
    currentTicket: null,
    status: 'idle',
    loading: false,
    error: null,
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    replyStatus: 'idle',
    assignStatus: 'idle',
  },
  reducers: {
    resetTicketStatus: (state) => {
      state.status = 'idle';
      state.createStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
      state.replyStatus = 'idle';
      state.assignStatus = 'idle';
      state.error = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create ticket cases
      .addCase(createTicket.pending, (state) => {
        state.createStatus = 'loading';
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.loading = false;
        state.tickets.unshift(action.payload.ticket);
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get tickets cases
      .addCase(getTickets.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.count = action.payload.count;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get ticket by ID cases
      .addCase(getTicketById.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.currentTicket = action.payload.ticket;
        state.error = null;
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update ticket cases
      .addCase(updateTicket.pending, (state) => {
        state.updateStatus = 'loading';
        state.loading = true;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.loading = false;
        // Update the ticket in the list
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload.ticket._id);
        if (index !== -1) {
          state.tickets[index] = action.payload.ticket;
        }
        // Update current ticket if it's the same one
        if (state.currentTicket && state.currentTicket._id === action.payload.ticket._id) {
          state.currentTicket = action.payload.ticket;
        }
        state.error = null;
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update ticket status cases
      .addCase(updateTicketStatus.pending, (state) => {
        state.updateStatus = 'loading';
        state.loading = true;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.loading = false;
        // Update the ticket in the list
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload.ticket._id);
        if (index !== -1) state.tickets[index] = action.payload.ticket;
        // Update current ticket if it's the same one
        if (state.currentTicket && state.currentTicket._id === action.payload.ticket._id) {
          state.currentTicket = action.payload.ticket;
        }
        state.error = null;
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete ticket cases
      .addCase(deleteTicket.pending, (state) => {
        state.deleteStatus = 'loading';
        state.loading = true;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.loading = false;
        // Remove the ticket from the list
        state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload.ticketId);
        // Clear current ticket if it's the deleted one
        if (state.currentTicket && state.currentTicket._id === action.payload.ticketId) {
          state.currentTicket = null;
        }
        state.error = null;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add reply cases
      .addCase(addReplyToTicket.pending, (state) => {
        state.replyStatus = 'loading';
        state.loading = true;
      })
      .addCase(addReplyToTicket.fulfilled, (state, action) => {
        state.replyStatus = 'succeeded';
        state.loading = false;
        // Update the ticket in the list
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload.ticket._id);
        if (index !== -1) {
          state.tickets[index] = action.payload.ticket;
        }
        // Update current ticket if it's the same one
        if (state.currentTicket && state.currentTicket._id === action.payload.ticket._id) {
          state.currentTicket = action.payload.ticket;
        }
        state.error = null;
      })
      .addCase(addReplyToTicket.rejected, (state, action) => {
        state.replyStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign ticket cases
      .addCase(assignTicket.pending, (state) => {
        state.assignStatus = 'loading';
        state.loading = true;
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.assignStatus = 'succeeded';
        state.loading = false;
        // Update the ticket in the list
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload.ticket._id);
        if (index !== -1) {
          state.tickets[index] = action.payload.ticket;
        }
        // Update current ticket if it's the same one
        if (state.currentTicket && state.currentTicket._id === action.payload.ticket._id) {
          state.currentTicket = action.payload.ticket;
        }
        state.error = null;
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.assignStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTicketStatus, clearCurrentTicket, clearError } = ticketSlice.actions;
export default ticketSlice.reducer;
