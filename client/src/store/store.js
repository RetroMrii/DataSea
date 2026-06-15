import { configureStore } from '@reduxjs/toolkit';

import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
  },
});