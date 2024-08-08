import { createSlice } from "@reduxjs/toolkit";

export const projectDetailsSlice= createSlice({
    name: 'projectDetails',
    initialState: {
        bg_image: ''
    },
    
    reducers: {

        setBG: (state, action)=>{
            return {...state, bg_image: action.payload}
        }
    }
})

export const {setBG} = projectDetailsSlice.actions;

export default projectDetailsSlice.reducer;