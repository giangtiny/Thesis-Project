import { GuestSelectProps } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: GuestSelectProps = {
  elder: 1,
  children: 0
};

export const guestSlice = createSlice({
  name: 'guest',
  initialState: initialState,
  reducers: {
    addElderGuest: (state: GuestSelectProps) => {
      state.elder++;
    },
    removeElderGuest: (state: GuestSelectProps) => {
      state.elder--;
    },
    addChildrenGuest: (state: GuestSelectProps) => {
      state.children++;
    },
    removeChildrenGuest: (state: GuestSelectProps) => {
      state.children--;
    }
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  }
});
