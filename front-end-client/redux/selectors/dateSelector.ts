import { RootState } from '@/utils/types';

export const selectBookedDate = (state: RootState) => {
  return state.date;
};
