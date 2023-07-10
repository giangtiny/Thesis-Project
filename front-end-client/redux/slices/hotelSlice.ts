import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { hydrate } from '@redux/actions';
import { Hotels } from '@/utils/types';

export const hotelSlice = createSlice({
  name: 'hotel',
  initialState: [] as Hotels,
  reducers: {
    setHotels: (state, action: PayloadAction<Hotels>) => {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrate, (state, action) => {
        console.log('HYDRATE HOTEL', state, action.payload);
        return action.payload.hotel;
      })
      .addDefaultCase((state) => state);
  }
});
