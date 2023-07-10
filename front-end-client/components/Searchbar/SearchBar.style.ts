import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const useSearchBarStyles = createStyles((theme) => ({
  group: {
    marginBottom: 10
  },

  datePicker: {},

  selected: {
    backgroundColor: `${PRIMARY_COLOR.PRIMARY_DARK_GREEN} !important`,
    color: 'white !important'
  }
}));
