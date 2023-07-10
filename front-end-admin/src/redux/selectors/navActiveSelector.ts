import { RootState } from '@/utils/types';

export const selectNavActive = (state: RootState) => {
  return state.navActive;
};
