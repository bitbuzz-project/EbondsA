import { createSlice } from "@reduxjs/toolkit";

export const stakingSlice = createSlice({
    name: 'staking',
    initialState: {
        balance: 0
    },
    
    reducers: {
        setBalance: (state, action)=>{
            return {...state, balance: action.payload}
        }
    }
})

export const {setBalance, setDecimals} = stakingSlice.actions;

export default stakingSlice.reducer;