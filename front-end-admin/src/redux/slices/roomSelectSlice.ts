import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ORDER_TYPE_VALUE } from '@/constants/forms';

const initialState: {
  rooms: Array<string>;
  isGroup: boolean;
  orderType: 0 | 1;
  maxRoomOrder: number;
  initialRooms: Array<string>;
} = {
  rooms: [],
  isGroup: false,
  orderType: 0,
  maxRoomOrder: 1,
  initialRooms: [],
};

export const roomSelectSlice = createSlice({
  name: 'roomSelect',
  initialState,
  reducers: {
    setRoomSelect: (state, action: PayloadAction<string>) => {
      if (state.rooms.includes(action.payload)) {
        state.rooms = state.rooms.filter((item) => item != action.payload);
      } else if (!state.isGroup && state.rooms.length >= state.maxRoomOrder) {
        return;
      } else if ((!state.isGroup && state.rooms.length < state.maxRoomOrder) || state.isGroup) {
        state.rooms = [...state.rooms, action.payload];
      }
    },
    setMaxRoomOrder: (state, action: PayloadAction<number>) => {
      if (state.orderType === ORDER_TYPE_VALUE.hour) {
        state.maxRoomOrder = 1;
      } else {
        state.maxRoomOrder = action.payload;
      }
    },
    setInitialRoomSelect: (state, action: PayloadAction<string[]>) => {
      state.rooms = [...action.payload];
      state.initialRooms = [...action.payload];
    },
    setGroupState: (state, action: PayloadAction<boolean>) => {
      state.isGroup = action.payload;
    },
    setOrderType: (state, action: PayloadAction<0 | 1>) => {
      state.orderType = action.payload;
    },
    clearRoomSelect: (state) => {
      return { rooms: [], isGroup: false, orderType: 0, maxRoomOrder: 1, initialRooms: [] };
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});
