import { RootState } from '@/utils/types';

export const getRooms = (state: RootState) => {
  return state.room.hotelRooms;
};

export const getSelectedRooms = (state: RootState) => {
  return state.room.selectedRooms;
};
