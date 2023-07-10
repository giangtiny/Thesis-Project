import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const useDateSelectStyles = createStyles((theme) => ({
  group: {
    marginBottom: 10
  },

  datePicker: {
    width: '45%'
  },

  selected: {
    backgroundColor: `${PRIMARY_COLOR.PRIMARY_DARK_GREEN} !important`,
    color: 'white !important'
  }
}));
