import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [],
  selectedReport: null,
  uploadPreview: null,
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportsError: (state) => {
      state.error = null;
    },
    clearUploadPreview: (state) => {
      state.uploadPreview = null;
    },
  },
});

export const { clearReportsError, clearUploadPreview } = reportsSlice.actions;

export default reportsSlice.reducer;