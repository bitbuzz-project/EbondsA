import { createSlice } from "@reduxjs/toolkit";

export const adminPageSlice= createSlice({
    name: 'adminPage',
    initialState: {
        selectedIDO: null, 
        toUpdate: false
    },
    
    reducers: {
        setSelectedIDO: (state, action)=>{
            return {...state, selectedIDO: action.payload}
        },

        setToUpdate: (state, action)=>{
            return {...state, toUpdate: action.payload}
        }
    }
})

export const {setSelectedIDO, setToUpdate} = adminPageSlice.actions;

export default adminPageSlice.reducer;