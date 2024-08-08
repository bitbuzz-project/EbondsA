// features/stakingSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const stakingSlice = createSlice({
  name: 'staking',
  initialState: {
    totalValueLocked: 0,
  },
  reducers: {
    setTotalValueLocked: (state, action) => {
      state.totalValueLocked = action.payload;
    },
  },
});

export const { setTotalValueLocked } = stakingSlice.actions;

export const selectTotalValueLocked = (state) => state.staking.totalValueLocked;

export default stakingSlice.reducer;
