import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DateSelectedStateProps } from '@/utils/types';

const setTime = (newTime: Date, time: Date | null) => {
  time?.setUTCHours(newTime.getUTCHours());
  time?.setUTCMinutes(newTime.getUTCMinutes());
  time?.setUTCSeconds(newTime.getUTCSeconds());
  return time;
};

export const dateSlice = createSlice({
  name: 'date',
  initialState: [null, null] as DateSelectedStateProps,
  reducers: {
    setBookedDate: (state, action: PayloadAction<[Date | null, Date | null]>) => {
      return action.payload;
    },
    setCheckinTime: (state, action: PayloadAction<Date>) => {
      const newTime: Date | null = setTime(action.payload, state[0]);
      state[0] = newTime;
    },
    setCheckoutTime: (state, action: PayloadAction<Date>) => {
      const newTime: Date | null = setTime(action.payload, state[1]);
      state[1] = newTime;
    }
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  }
});

export const { setBookedDate, setCheckinTime, setCheckoutTime } = dateSlice.actions;
