import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
    name: 'navActive',
    initialState: '/hotel',
    reducers: {
        setNavActive: (state, action) => {
            return action.payload;
        }
    },
    extraReducers: (builder) => {
      builder.addDefaultCase((state) => state);
    }
});