// store.js
import { configureStore } from '@reduxjs/toolkit';
import stakingReducer from './features/stakingSlice';

export const store = configureStore({
  reducer: {
    staking: stakingReducer,
  },
});
