import { RootState } from '@/utils/types';

export const selectUser = (state: RootState) => {
  return state.user;
};
