import { RootState } from '@/utils/types';

export const selectPaymentType = (state: RootState) => {
  return state.payment.paymentType;
};
