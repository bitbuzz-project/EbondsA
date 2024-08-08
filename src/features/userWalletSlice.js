// userWalletSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const userWalletSlice = createSlice({
    name: 'wallet',
    initialState: {
        address: null,
        balance: 0,
        decimal: 8,
        // Add new token properties here
        newTokenBalance: '0',
        newTokenDecimal: 18,
    }, 

    reducers: {
        setAddress: (state, action) => {
            if (action.payload === undefined)
                return { ...state, address: null };
            return { ...state, address: action.payload };
        },

        setBalance: (state, action) => {
            return { ...state, balance: action.payload };
        },

        setDecimal: (state, action) => {
            return { ...state, decimal: action.payload };
        },

        // New reducers for the new token
        setNewTokenBalance: (state, action) => {
            return { ...state, newTokenBalance: action.payload };
        },

        setNewTokenDecimal: (state, action) => {
            return { ...state, newTokenDecimal: action.payload };
        },
    },
});

export const { setAddress, setBalance, setDecimal, setNewTokenBalance, setNewTokenDecimal } = userWalletSlice.actions;

export const selectAddress = state => state.userWallet.address;

// Selectors for the new token
export const selectNewTokenBalance = state => state.userWallet.newTokenBalance;
export const selectNewTokenDecimal = state => state.userWallet.newTokenDecimal;

export default userWalletSlice.reducer;
