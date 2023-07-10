import { combineReducers } from '@reduxjs/toolkit';

import { navbarSlice } from '@/redux/slices';
import { imagesHotelSelectSlice } from '@/redux/slices';
import { userSlice } from '@/redux/slices';
import { roomSelectSlice } from '@/redux/slices/roomSelectSlice';

export const rootReducer = combineReducers({
  [navbarSlice.name]: navbarSlice.reducer,
  [imagesHotelSelectSlice.name]: imagesHotelSelectSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [roomSelectSlice.name]: roomSelectSlice.reducer,
});
