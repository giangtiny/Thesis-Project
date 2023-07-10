import { combineReducers } from '@reduxjs/toolkit';

import { dateSlice, guestSlice, hotelSlice, paymentSlice, roomSlice } from '@redux/slices';

export const rootReducer = combineReducers({
  [dateSlice.name]: dateSlice.reducer,
  [hotelSlice.name]: hotelSlice.reducer,
  [roomSlice.name]: roomSlice.reducer,
  [guestSlice.name]: guestSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer
});
