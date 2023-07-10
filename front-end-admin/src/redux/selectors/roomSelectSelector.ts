import { RootState } from '@/utils/types';

export const selectRoomSelect = (state: RootState) => {
  return state.roomSelect.rooms;
};

export const selectIsGroup = (state: RootState) => {
  return state.roomSelect.isGroup;
};

export const selectMaxRoomOrder = (state: RootState) => {
  return state.roomSelect.maxRoomOrder;
};

export const selectInitialRooms = (state: RootState) => {
  return state.roomSelect.initialRooms;
};

export const selectOrderType = (state: RootState) => {
  return state.roomSelect.orderType;
};
