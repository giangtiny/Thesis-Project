import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const useCalendarStyle = createStyles((theme) => ({
  text: {
    textDecoration: 'underline'
  },

  day: {
    '&[data-selected]': {
      backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN,
      borderRadius: 100,
      position: 'relative'
    },

    '&[data-in-range]': {
      backgroundColor: PRIMARY_COLOR.PRIMARY_LEAST_GREEN
    },

    '&[data-first-in-range]': {
      backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN,
      borderRadius: 100,
      position: 'relative',

      '&::after': {
        content: '""',
        backgroundColor: PRIMARY_COLOR.PRIMARY_LEAST_GREEN,
        position: 'absolute',
        right: 0,
        left: 20,
        top: 0,
        bottom: 0,
        zIndex: -1
      }
    },

    '&[data-last-in-range]': {
      backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN,
      borderRadius: 100,
      '&::after': {
        content: '""',
        backgroundColor: PRIMARY_COLOR.PRIMARY_LEAST_GREEN,
        position: 'absolute',
        left: 0,
        right: 20,
        top: 0,
        bottom: 0,
        zIndex: -1
      }
    }
  },

  button: {
    color: PRIMARY_COLOR.PRIMARY_DARK_GREEN
  }
}));
