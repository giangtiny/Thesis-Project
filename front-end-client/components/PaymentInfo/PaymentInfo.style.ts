import { createStyles } from '@mantine/core';
import { PRIMARY_COLOR } from '@/constants/theme';

export const usePaymentInfoStyle = createStyles((theme) => ({
  paymentButton: {
    fontSize: 18,
    height: 50,
    backgroundColor: '#3072BF',
    '&:hover': {
      backgroundColor: '#015AAC'
    }
  }
}));
