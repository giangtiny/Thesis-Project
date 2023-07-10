import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { hydrate } from '@redux/actions';
import { IPaymentInformation } from '@/utils/types';

export const paymentSlice = createSlice({
  name: 'payment',
  initialState: { paymentType: 'momo' } as IPaymentInformation,
  reducers: {
    setPaymentType: (state, action: PayloadAction<'momo' | 'bank' | 'vnpay'>) => {
      state.paymentType = action.payload;
    }
  },
  extraReducers: {}
});
