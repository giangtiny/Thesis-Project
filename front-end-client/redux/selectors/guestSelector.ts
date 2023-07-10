import { RootState } from '@/utils/types';

export const selectGuest = (state: RootState) => {
  return state.guest;
};

export const selectCountGuest = (state: RootState) => {
  const { elder, children } = state.guest;
  return elder + children;
};
