import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../../services/api.js';

const initialState = {
  reports: [],
  pagination: null,
  selectedReport: null,
  uploadPreview: null,
  savedReport: null,

  listLoading: false,
  detailLoading: false,
  uploadLoading: false,
  saveLoading: false,
  updateLoading: false,
  deleteLoading: false,

  uploadProgress: 0,
  error: null,
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reports?page=${page}&limit=${limit}`);
      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Could not load your saved reports.')
      );
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'reports/fetchReportById',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data?.data?.report || response.data?.report || null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Could not load this report.')
      );
    }
  }
);

export const uploadDataset = createAsyncThunk(
  'reports/uploadDataset',
  async (file, { dispatch, rejectWithValue }) => {
    const formData = new FormData();
    formData.append('dataset', file);

    try {
      const response = await api.post('/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) {
            dispatch(setUploadProgress(50));
            return;
          }

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          dispatch(setUploadProgress(percent));
        },
      });

      dispatch(setUploadProgress(100));

      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Upload failed. Check the file and try again.')
      );
    }
  }
);

export const saveReport = createAsyncThunk(
  'reports/saveReport',
  async ({ title, file, analysis, tags = [], descriptionCategory = 'other' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reports', {
        title,
        tags,
        descriptionCategory,
        file,
        analysis,
      });

      return response.data?.data?.report || response.data?.report || null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Could not save the report. Please try again.')
      );
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ reportId, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reports/${reportId}`, updates);
      return response.data?.data?.report || response.data?.report || null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Could not update the report.')
      );
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      await api.delete(`/reports/${reportId}`);
      return reportId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Could not delete the report.')
      );
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    clearUploadPreview: (state) => {
      state.uploadPreview = null;
      state.savedReport = null;
      state.uploadProgress = 0;
      state.error = null;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
      state.error = null;
    },
    clearSavedReport: (state) => {
      state.savedReport = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.listLoading = false;
        state.reports = action.payload.reports || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchReportById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.selectedReport = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      .addCase(uploadDataset.pending, (state) => {
        state.uploadLoading = true;
        state.uploadProgress = 0;
        state.uploadPreview = null;
        state.savedReport = null;
        state.error = null;
      })
      .addCase(uploadDataset.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadPreview = action.payload;
        state.uploadProgress = 100;
      })
      .addCase(uploadDataset.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })

      .addCase(saveReport.pending, (state) => {
        state.saveLoading = true;
        state.error = null;
      })
      .addCase(saveReport.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.savedReport = action.payload;

        if (action.payload) {
          state.reports = [action.payload, ...state.reports];
        }
      })
      .addCase(saveReport.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload;
      })

      .addCase(updateReport.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.selectedReport = action.payload;

        if (action.payload?._id) {
          state.reports = state.reports.map((report) =>
            report._id === action.payload._id ? action.payload : report
          );
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteReport.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );

        if (state.selectedReport?._id === action.payload) {
          state.selectedReport = null;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearReportsError,
  clearUploadPreview,
  clearSelectedReport,
  clearSavedReport,
  setUploadProgress,
} = reportsSlice.actions;

export default reportsSlice.reducer;