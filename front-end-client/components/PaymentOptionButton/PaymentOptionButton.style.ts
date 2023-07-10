import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const usePaymentOptionButtonStyle = createStyles((theme) => ({
  container: {
    border: `1px solid ${SECONDARY_COLOR.SECONDARY_GREY}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.gray[1]
    }
  },
  containerActive: {
    backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN,
    color: 'white',
    '&:hover': {
      backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN,
      color: 'white'
    }
  }
}));
