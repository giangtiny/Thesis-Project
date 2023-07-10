import { RootState } from '@/utils/types';

export const selectHotels = (state: RootState) => {
  return state.hotel;
};
